import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateScheduleWithGemini = async (data: {
  subjects: any[];
  priorities: Record<number, number>;
  routines: any[];
}) => {
  try {
    // FIX: Use a valid model name (1.5-flash is current standard)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // We add specific instructions about Priority Weighting
    const prompt = `
      Act as an expert academic scheduler. Create a daily schedule (06:00 - 00:00) strictly as a JSON Array.
      
      **Inputs:**
      - Fixed Routines (Cannot be changed): ${JSON.stringify(data.routines)}
      - Subjects: ${JSON.stringify(data.subjects)}
      - Priorities (1 = Low, 5 = High): ${JSON.stringify(data.priorities)}

      **CRITICAL RULES FOR GENERATION:**

      1. **Time Allocation based on Priority:**
         - **Priority 5:** MUST receive the longest blocks (e.g., 1.5 to 2 hours) or multiple sessions.
         - **Priority 4:** Receive significant time (e.g., 1 to 1.5 hours).
         - **Priority 3:** Standard duration (e.g., 45 mins to 1 hour).
         - **Priority 1-2:** Fill smaller gaps or shorter review sessions (30-45 mins).
         - Do not schedule Priority 1 subjects if Priority 5 subjects haven't been given enough time.

      2. **Respect Routines:** 
         - Absolutely NO overlaps with Fixed Routines.
         - Do not schedule study sessions inside routines.

      3. **Consolidation (Important):** 
         - **Do NOT split continuous activities.** If a student studies "Math" from 09:00 to 11:00, return ONE object: {"time": "09:00 - 11:00", ...}. 
         - Do not create separate 30-minute blocks for the same activity consecutively.

      4. **Logic:** 
         - Insert 10-15 minute "Break" sessions between long study blocks to avoid burnout.
      
      5. **Output Format:**
         - JSON Keys: "time" (e.g., "08:00 - 09:30"), "activity", "type" ("study"|"routine"|"break"), "color".
         - "color": Use "blue", "green", "purple", "orange", "red", "pink", "gray". Pick a color that matches the subject list if possible.
      
      **Return ONLY raw JSON. No markdown.**
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();

    return { data: JSON.parse(cleanJson) };

  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};