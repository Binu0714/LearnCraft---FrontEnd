import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { 
  FaUser, FaSignOutAlt, FaPlus, FaTrash, FaRobot, FaCalendarAlt, FaCheck, FaClock 
} from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import { getSubjects } from "../services/subject";
import { createRoutine, getRoutines, deleteRoutine } from "../services/routines"; 

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

const SmartSchedule: React.FC = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- State ---
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [priorities, setPriorities] = useState<Record<number, number>>({});
  const [routines, setRoutines] = useState<Routine[]>([]);

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

        } catch (err) {
            console.error("Failed to fetch subjects:", err);
        }
    };

    fetchSubjects();
    }, 
[]);
  
  const [newRoutine, setNewRoutine] = useState({ name: "", start: "", end: "" });
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedule, setSchedule] = useState<TimeSlot[]>([]);

  // --- Logout Logic ---
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  // --- Handlers ---
  
  // Toggle Subject Selection
  const toggleSubject = (id: number) => {
    if (selectedSubjectIds.includes(id)) {
      setSelectedSubjectIds(selectedSubjectIds.filter(sid => sid !== id));
      // Remove priority if deselected
      const newPriorities = { ...priorities };
      delete newPriorities[id];
      setPriorities(newPriorities);
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, id]);
      // Default priority 3
      setPriorities({ ...priorities, [id]: 3 });
    }
  };

  // Set Priority (1-5)
  const handlePriorityChange = (id: number, level: number) => {
    setPriorities({ ...priorities, [id]: level });
  };

  // Add Routine
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

        setRoutines([
            ...routines, 
            {
                _id: res.data._id,
                name: res.data.name,
                startTime: res.data.startTime,
                endTime: res.data.endTime
            }
        ]);

        setNewRoutine({ name: "", start: "", end: "" });
        alert("Routine added successfully!");

    } catch (err) {
        console.error("Failed to create routine:", err);
    }
  };

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

  // --- GENERATE ALGORITHM (Mock Logic) ---
  const generateSchedule = () => {
    setIsGenerating(true);
    setSchedule([]); // Clear previous

    // Simulate AI delay
    setTimeout(() => {
      // Simple mock schedule generation for demo
      const mockSchedule: TimeSlot[] = [
        { time: "08:00 - 09:00", activity: "Morning Routine", type: "routine", color: "gray" },
        { time: "09:00 - 10:30", activity: "Data Structures (High Priority)", type: "study", color: "purple" },
        { time: "10:30 - 10:45", activity: "Short Break", type: "break", color: "gray" },
        { time: "10:45 - 12:00", activity: "Web Development", type: "study", color: "blue" },
        { time: "12:00 - 13:00", activity: "Lunch Break", type: "routine", color: "gray" },
        { time: "13:00 - 14:30", activity: "UI/UX Design", type: "study", color: "pink" },
        { time: "14:30 - 16:00", activity: "Mathematics", type: "study", color: "orange" },
        { time: "16:00 - 17:00", activity: "Review & Notes", type: "study", color: "blue" },
      ];
      
      setSchedule(mockSchedule);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* --- TOP NAVBAR (Exact match) --- */}
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LuSparkles className="text-xl" />
            </div>
            <span className="text-xl font-bold tracking-wide">LearnCraft</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Dashboard</Link>
            <Link to="/subjects" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">My Subjects</Link>
            {/* Active Link */}
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
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">AI Schedule Generator</h1>
          <p className="text-slate-500 mt-1">Configure your preferences and let our AI build your perfect study day.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- LEFT COLUMN: Configuration (Steps 1, 2, 3) --- */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Step 1 & 2: Subjects & Priorities */}
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
                      
                      {/* Checkbox Row */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={isSelected} 
                            onChange={() => toggleSubject(sub.id)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                          <span className={`font-semibold ${isSelected ? "text-slate-900" : "text-slate-500"}`}>{sub.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold ${bgColors[sub.color]}`}>
                          {sub.color}
                        </span>
                      </div>

                      {/* Priority Slider (Only if selected) */}
                      {isSelected && (
                        <div className="mt-3 pl-8 animate-fadeIn">
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Low Priority</span>
                            <span>High Priority</span>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button
                                key={level}
                                onClick={() => handlePriorityChange(sub.id, level)}
                                className={`flex-1 h-2 rounded-full transition-all ${
                                  (priorities[sub.id] || 0) >= level ? "bg-blue-500" : "bg-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-right text-xs font-bold text-blue-600 mt-1">
                            Level: {priorities[sub.id]}/5
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Daily Routines */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><FaCalendarAlt /></div>
                <h3 className="font-bold text-slate-800">2. Fixed Routines</h3>
              </div>

              {/* List Routines */}
              <div className="space-y-2 mb-6">
                {routines.map(r => (
                  <div key={r._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <span className="font-semibold text-slate-700 text-sm block">{r.name}</span>
                      <span className="text-xs text-slate-500">{r.startTime} - {r.endTime}</span>
                    </div>
                    <button onClick={() => removeRoutine(r._id)} className="text-slate-400 hover:text-red-500 p-1">
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Routine Form */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input 
                  type="text" 
                  placeholder="Activity (e.g. Gym)" 
                  className="col-span-2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  value={newRoutine.name}
                  onChange={(e) => setNewRoutine({...newRoutine, name: e.target.value})}
                />
                <input 
                  type="time" 
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  value={newRoutine.start}
                  onChange={(e) => setNewRoutine({...newRoutine, start: e.target.value})}
                />
                <input 
                  type="time" 
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  value={newRoutine.end}
                  onChange={(e) => setNewRoutine({...newRoutine, end: e.target.value})}
                />
              </div>
              <button 
                onClick={addRoutine}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <FaPlus size={12} /> Add Routine
              </button>
            </div>

            {/* Step 4: Generate Button */}
            <button 
              onClick={generateSchedule}
              disabled={isGenerating || selectedSubjectIds.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all ${
                isGenerating || selectedSubjectIds.length === 0
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1"
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Plan...
                </>
              ) : (
                <>
                  <FaRobot className="text-xl" /> Generate My Schedule
                </>
              )}
            </button>

          </div>

          {/* --- RIGHT COLUMN: Timetable Display (Step 5) --- */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
              
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-600" /> Your Smart Schedule
                </h3>
                <span className="text-sm text-slate-500">{new Date().toDateString()}</span>
              </div>

              <div className="flex-1 p-6 overflow-y-auto min-h-[500px]">
                {schedule.length > 0 ? (
                  <div className="space-y-4">
                    {schedule.map((slot, index) => (
                      <div 
                        key={index} 
                        className={`flex gap-4 p-4 rounded-xl border-l-4 shadow-sm animate-fadeInUp ${
                          slot.type === 'study' ? "bg-white border-blue-500 shadow-blue-100" : 
                          slot.type === 'break' ? "bg-green-50 border-green-400" : 
                          "bg-slate-50 border-slate-400"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-slate-100 pr-4">
                          <FaClock className="text-slate-400 mb-1" />
                          <span className="text-sm font-bold text-slate-700">{slot.time}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">{slot.activity}</h4>
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded uppercase font-bold ${
                            slot.type === 'study' ? bgColors[slot.color || 'blue'] : "text-slate-500 bg-slate-200"
                          }`}>
                            {slot.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Empty State
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-60">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                      <FaRobot className="text-4xl text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Schedule Yet</h3>
                    <p className="text-slate-500 max-w-sm">
                      Select your subjects, set priorities, and add your daily routines to generate a personalized study plan.
                    </p>
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