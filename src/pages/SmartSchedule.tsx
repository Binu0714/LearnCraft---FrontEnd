import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { 
  FaUser, FaSignOutAlt, FaPlus, FaTrash, FaRobot, FaCalendarAlt, FaCheck, FaClock, FaSave, FaPrint 
} from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import { getSubjects } from "../services/subject";
import { createRoutine, getRoutines, deleteRoutine } from "../services/routines"; 
import { setPriorityLevel, getPriorityLevel } from "../services/priority";
import { generateScheduleWithGemini} from "../services/gemini";
import { saveUserSchedule } from "../services/schedule";

interface Subject {
  id: number;
  name: string;
  color: string;
}

interface Routine {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
}

interface TimeSlot {
  time: string;
  activity: string;
  type: "study" | "routine" | "break";
  color?: string;
}

const bgColors: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  green: "bg-green-100 text-green-700 border-green-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  red: "bg-red-100 text-red-700 border-red-200",
  pink: "bg-pink-100 text-pink-700 border-pink-200",
  gray: "bg-slate-100 text-slate-700 border-slate-200", 
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
  cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
};

const cardTheme: Record<string, string> = {
  blue: "border-blue-500 shadow-blue-100",
  green: "border-green-500 shadow-green-100",
  purple: "border-purple-500 shadow-purple-100",
  orange: "border-orange-500 shadow-orange-100",
  red: "border-red-500 shadow-red-100",
  pink: "border-pink-500 shadow-pink-100",
  yellow: "border-yellow-500 shadow-yellow-100",
  cyan: "border-cyan-500 shadow-cyan-100",
};

// --- Helper Function ---
const mergeConsecutiveSlots = (slots: TimeSlot[]) => {
  if (slots.length === 0) return [];
  const merged: TimeSlot[] = [];
  let currentSlot = slots[0];

  for (let i = 1; i < slots.length; i++) {
    const nextSlot = slots[i];
    if (currentSlot.activity === nextSlot.activity && currentSlot.type === nextSlot.type) {
      const startTime = currentSlot.time.split("-")[0].trim();
      const endTime = nextSlot.time.split("-")[1].trim();
      currentSlot = { ...currentSlot, time: `${startTime} - ${endTime}` };
    } else {
      merged.push(currentSlot);
      currentSlot = nextSlot;
    }
  }
  merged.push(currentSlot);
  return merged;
};

const SmartSchedule: React.FC = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- State ---
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [priorities, setPriorities] = useState<Record<number, number>>({});
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [newRoutine, setNewRoutine] = useState({ name: "", start: "", end: "" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  const [schedule, setSchedule] = useState<TimeSlot[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
        try {
            const res: any = await getSubjects();  
            const subjectsWithId = res.data.map((s: any) => ({
                    id: s._id, 
                    name: s.name,
                    description: s.description,
                    color: s.color,
                    timeLearned: s.timeLearned || "0m"
                })
            );
            
            setAvailableSubjects(subjectsWithId);  

            const routineRes: any = await getRoutines();
            const userRoutines = routineRes.data.map((r: any) => ({
                    _id: r._id,
                    name: r.name,
                    startTime: r.startTime,
                    endTime: r.endTime
                })
            );
            setRoutines(userRoutines);

            const priorityRes: any = await getPriorityLevel();
            const savedPriorities: Record<string, number> = {};

              priorityRes.data.forEach((p: any) => {
                savedPriorities[p.subjectId] = p.priority;
              });

            setPriorities(savedPriorities);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        }
    };
    fetchSubjects();
  }, []);

  // --- Handlers ---
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/home");
  };
 
  const toggleSubject = (id: number) => {
    if (selectedSubjectIds.includes(id)) {
        setSelectedSubjectIds(selectedSubjectIds.filter((sid) => sid !== id));
        const updated = { ...priorities };
        delete updated[id];
        setPriorities(updated);
    } else {
        setSelectedSubjectIds([...selectedSubjectIds, id]);
        if (!priorities[id]) setPriorities({ ...priorities, [id]: 3 });
    }
  };

  const handlePriorityChange = async(id: number, level: number) => {
    setPriorities({ ...priorities, [id]: level });
    try{
      await setPriorityLevel({ subjectId: id, priority: level });
    } catch (err) {
      console.error("Failed to set priority level:", err);
    }
  };

  // Create Routine

  const addRoutine = async () => {
    if (!newRoutine.name || !newRoutine.start || !newRoutine.end) {
      alert("Please fill in all routine fields.");
      return;
    }
    try{
        const res: any = await createRoutine({
            name: newRoutine.name,
            startTime: newRoutine.start,
            endTime: newRoutine.end
        })
        setRoutines([...routines, { _id: res.data._id, name: res.data.name, startTime: res.data.startTime, endTime: res.data.endTime }]);
        setNewRoutine({ name: "", start: "", end: "" });
        alert("Routine added successfully!");
    } catch (err) {
        console.error("Failed to create routine:", err);
    }
  };

  // Remove Routine

  const removeRoutine = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this routine?")) {
        try{
            await deleteRoutine(id);
            setRoutines(routines.filter(r => r._id !== id));
            alert("Routine deleted successfully!");
        } catch (err) {
            console.error("Failed to delete routine:", err);
        }
    }
  };

  // Generate Schedule

  const generateSchedule = async () => {
    if (selectedSubjectIds.length === 0) {
      alert("Please select at least one subject.");
      return;
    }
    setIsGenerating(true);
    setSchedule([]); 

    try {
      const activeSubjects = availableSubjects.filter((sub) => selectedSubjectIds.includes(sub.id));
      const response = await generateScheduleWithGemini({
        subjects: activeSubjects,
        priorities: priorities,
        routines: routines
      });

      const aiSchedule = response.data || []; 
      const formattedSchedule = aiSchedule.map((slot: TimeSlot) => ({
        ...slot,
        color: bgColors[slot.color || "blue"] ? slot.color : "blue"
      })
    );

      const cleanSchedule = mergeConsecutiveSlots(formattedSchedule);
      setSchedule(cleanSchedule);

    } catch (error) {
      console.error("Schedule Generation Failed:", error);
      alert("Failed to generate schedule. Please try again.");

    } finally {
      setIsGenerating(false);
    }
  };

  // Save Schedule

  const handleSaveSchedule = async () => {
    if (schedule.length === 0) return;
    setIsSaving(true);

    try {
      console.log("Current Auth Context User:", user); 

      const validUserId = user?._id || user?.id;

      if (!validUserId) {
        alert("Error: User ID not found. Please log out and log in again.");
        setIsSaving(false);
        return;
      }

      await saveUserSchedule({
        userId: validUserId, 
        date: new Date(),
        slots: schedule
      });

      alert("Schedule saved successfully!");

    } catch (error: any) {
      console.error("Save failed:", error);
      alert(error.response?.data?.message || "Failed to save schedule.");
    } finally {
      setIsSaving(false);
    }
  };

  // Print Schedule

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* --- TOP NAVBAR --- */}
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LuSparkles className="text-xl" />
            </div>
            <span className="text-xl font-bold tracking-wide">LearnCraft</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/home" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Dashboard</Link>
            <Link to="/subjects" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">My Subjects</Link>
            <Link to="/schedule" className="text-white text-sm font-medium border-b-2 border-blue-500 pb-0.5">Smart Schedule</Link>
            <Link to="/analytics" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Analytics</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white border border-blue-500">
                {user?.username ? user.username.charAt(0).toUpperCase() : <FaUser />}
              </div>
              <span className="hidden sm:block text-sm font-medium">{user?.username || "Student"}</span>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors" title="Logout">
              <FaSignOutAlt className="text-lg" />
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 no-print">
          <h1 className="text-3xl font-bold text-slate-900">AI Schedule Generator</h1>
          <p className="text-slate-500 mt-1">Configure your preferences and let our AI build your perfect study day.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- LEFT COLUMN: Configuration --- */}
          <div className="lg:col-span-5 space-y-8 no-print">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FaCheck /></div>
                <h3 className="font-bold text-slate-800">1. Select Subjects & Priority</h3>
              </div>
              <div className="space-y-4">
                {availableSubjects.map((sub) => {
                  const isSelected = selectedSubjectIds.includes(sub.id);
                  return (
                    <div key={sub.id} className={`p-4 rounded-xl border transition-all ${isSelected ? "border-blue-500 bg-blue-50/50" : "border-slate-200"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={isSelected} onChange={() => toggleSubject(sub.id)} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                          <span className={`font-semibold ${isSelected ? "text-slate-900" : "text-slate-500"}`}>{sub.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold ${bgColors[sub.color]}`}>{sub.color}</span>
                      </div>
                      {isSelected && (
                        <div className="mt-3 pl-8 animate-fadeIn">
                          <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Low Priority</span><span>High Priority</span></div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button key={level} onClick={() => handlePriorityChange(sub.id, level)} className={`flex-1 h-2 rounded-full transition-all ${(priorities[sub.id] || 0) >= level ? "bg-blue-500" : "bg-slate-200"}`} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><FaCalendarAlt /></div>
                <h3 className="font-bold text-slate-800">2. Fixed Routines</h3>
              </div>
              <div className="space-y-2 mb-6">
                {routines.map(r => (
                  <div key={r._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <span className="font-semibold text-slate-700 text-sm block">{r.name}</span>
                      <span className="text-xs text-slate-500">{r.startTime} - {r.endTime}</span>
                    </div>
                    <button onClick={() => removeRoutine(r._id)} className="text-slate-400 hover:text-red-500 p-1"><FaTrash size={12} /></button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input type="text" placeholder="Activity" className="col-span-2 px-3 py-2 border border-slate-300 rounded-lg text-sm" value={newRoutine.name} onChange={(e) => setNewRoutine({...newRoutine, name: e.target.value})} />
                <input type="time" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" value={newRoutine.start} onChange={(e) => setNewRoutine({...newRoutine, start: e.target.value})} />
                <input type="time" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" value={newRoutine.end} onChange={(e) => setNewRoutine({...newRoutine, end: e.target.value})} />
              </div>
              <button onClick={addRoutine} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"><FaPlus size={12} /> Add Routine</button>
            </div>

            <button onClick={generateSchedule} disabled={isGenerating || selectedSubjectIds.length === 0} className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all ${isGenerating || selectedSubjectIds.length === 0 ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1"}`}>
              {isGenerating ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Generating...</> : <><FaRobot className="text-xl" /> Generate My Schedule</>}
            </button>
          </div>

          {/* --- RIGHT COLUMN: Timetable Display --- */}
          <div className="lg:col-span-7">
            {/* Added ID for printing */}
            <div id="printable-schedule" className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
              
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-600" /> Your Smart Schedule
                </h3>
                
                {/* ACTION BUTTONS (Save & Print) */}
                <div className="flex gap-2 no-print">
                  <button 
                    onClick={handleSaveSchedule}
                    disabled={schedule.length === 0 || isSaving}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FaSave /> {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button 
                    onClick={handlePrint}
                    disabled={schedule.length === 0}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FaPrint /> Print
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto min-h-[500px]">
                {schedule.length > 0 ? (
                  <div className="space-y-4">
                    {schedule.map((slot, index) => {
                      let cardStyle = "";
                      if (slot.type === 'study') {
                        const theme = cardTheme[slot.color || 'blue'] || cardTheme['blue']; 
                        cardStyle = `bg-white ${theme}`; 
                      } else if (slot.type === 'break') {
                        cardStyle = "bg-emerald-50 border-emerald-400";
                      } else {
                        cardStyle = "bg-slate-50 border-slate-400";
                      }

                      return (
                        <div key={index} className={`flex gap-4 p-4 rounded-xl border-l-4 shadow-sm animate-fadeInUp ${cardStyle}`} style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-slate-100 pr-4">
                            <FaClock className="text-slate-400 mb-1" />
                            <span className="text-sm font-bold text-slate-700">{slot.time}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-lg">{slot.activity}</h4>
                            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded uppercase font-bold ${slot.type === 'study' ? bgColors[slot.color || 'blue'] : "text-slate-500 bg-slate-200"}`}>{slot.type}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-60">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6"><FaRobot className="text-4xl text-slate-400" /></div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Schedule Yet</h3>
                    <p className="text-slate-500 max-w-sm">Select your subjects, set priorities, and add your daily routines to generate a personalized study plan.</p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SmartSchedule;