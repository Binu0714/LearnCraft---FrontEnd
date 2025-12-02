import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaClock, 
  FaSearch, 
  FaTimes 
} from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import { createSubject } from "../services/subject";

// --- Types ---
interface Subject {
  id: number;
  name: string;
  description: string;
  color: string; 
  timeLearned: string;
}

// --- Color Mapping for Tailwind ---
const bgColors: Record<string, string> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  pink: "bg-pink-500",
};

const MySubjects: React.FC = () => {
  // --- Main Data State ---
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // --- Individual Form States (No formData object) ---
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("blue");

  // --- Handlers ---
  const handleOpenModal = (subject?: Subject) => {
    if (subject) {
      // Edit Mode: Populate individual states
      setEditingSubject(subject);
      setName(subject.name);
      setDescription(subject.description);
      setColor(subject.color);
    } else {
      // Add Mode: Reset individual states
      setEditingSubject(null);
      setName("");
      setDescription("");
      setColor("blue");
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSubject) {
      // Update Logic (Using individual states)
      setSubjects(subjects.map(s => 
        s.id === editingSubject.id 
          ? { ...s, name, description, color } // Update fields
          : s
      ));
    } else {
      
      const createNewSubject = async () => {
        try {
          const obj = {
            name,
            description,
            color,
            timeLearned: "0m"
          }

          const res: any = await createSubject(obj);

          const newSubject = {
          ...res.data,
          timeLearned: res.data.timeLearned || "0m" // ensure fallback
        };

          setSubjects([...subjects, newSubject]);

          console.log(res.data)
          console.log(res.message)

          alert(`Subject created successfully: ${res?.data?.name}`);

        }catch (error) {
          console.error("Failed to create subject:", error);
        }
      };
      createNewSubject();
    }
    setIsModalOpen(false);
  };

  const colors = ["blue", "green", "purple", "orange", "red", "pink"];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* --- 1. TOP NAVBAR --- */}
      <nav className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LuSparkles className="text-lg" />
            </div>
            <span className="text-lg font-bold tracking-wide">LearnCraft</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/home" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Dashboard</Link>
            <span className="text-white text-sm font-medium border-b-2 border-blue-500 pb-0.5">My Subjects</span>
            <Link to="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Analytics</Link>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold border border-blue-500">
            U
          </div>
        </div>
      </nav>

      {/* --- 2. MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Subjects</h1>
            <p className="text-slate-500 mt-1">Manage your courses and track your progress.</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <FaSearch className="absolute left-3 top-3.5 text-slate-400 text-sm" />
              <input 
                type="text" 
                placeholder="Search subjects..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <FaPlus /> Add Subject
            </button>
          </div>
        </div>

        {/* Subjects Grid */}
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard 
                key={subject.id} 
                subject={subject} 
                onEdit={() => handleOpenModal(subject)}
                onDelete={() => handleDelete(subject.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400 text-lg">No subjects found. Start by adding one!</p>
          </div>
        )}
      </div>

      {/* --- 3. MODAL (Add/Edit) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">
                {editingSubject ? "Edit Subject" : "New Subject"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500">
                <FaTimes />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Name Input */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subject Name</label>
                <input 
                  type="text" 
                  required
                  value={name} // Using individual state
                  onChange={(e) => setName(e.target.value)} // Setting individual state
                  placeholder="e.g. Advanced Calculus"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  required
                  value={description} // Using individual state
                  onChange={(e) => setDescription(e.target.value)} // Setting individual state
                  placeholder="Short description of what you are learning..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                />
              </div>

              {/* Color Label Input */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Color Label</label>
                <div className="flex gap-3">
                  {colors.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)} // Setting individual state
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        color === c
                          ? "ring-2 ring-offset-2 ring-slate-800 scale-110"
                          : "border border-transparent hover:scale-110"
                      }`}
                    >
                      <div className={`w-full h-full rounded-full ${bgColors[c]}`}></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors"
                >
                  {editingSubject ? "Update Subject" : "Create Subject"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// --- Sub-Component: Subject Card ---
const SubjectCard = ({ subject, onEdit, onDelete }: { subject: Subject, onEdit: () => void, onDelete: () => void }) => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-green-100 text-green-700 border-green-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    red: "bg-red-100 text-red-700 border-red-200",
    pink: "bg-pink-100 text-pink-700 border-pink-200",
  };

  const themeClass = colorMap[subject.color] || colorMap.blue;
  const topBarColor = bgColors[subject.color] || bgColors.blue;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1.5 ${topBarColor}`}></div>
      <div className="flex justify-between items-start mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${themeClass}`}>
          {subject.color}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <FaEdit />
          </button>
          <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <FaTrash />
          </button>
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{subject.name}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6 h-10 line-clamp-2">
        {subject.description}
      </p>
      <div className="flex items-center gap-2 pt-4 border-t border-slate-100 text-slate-400 text-sm font-medium">
        <FaClock className="text-blue-500" />
        <span>{subject.timeLearned} learned</span>
      </div>
    </div>
  );
};

export default MySubjects;