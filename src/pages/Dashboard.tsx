import React, { useContext, useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/authContext"; 
import { 
  FaBook, FaClock, FaChartLine, FaSignOutAlt, FaUser, FaPlay, FaRobot, 
  FaTimes, FaCamera, FaSave, FaPen 
} from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import { updateMyDetails } from "../services/auth";

const Dashboard: React.FC = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ username: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/home");
  };

  const openProfile = () => {
    setEditFormData({
      username: user?.username || "",
      email: user?.email || "user@example.com" 
    });
    setIsEditing(false);
    setIsProfileOpen(true);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response: any = await updateMyDetails(user!.id, editFormData);

      const updatedData = response.data || response;

      setUser((prev: any) => ({
        ...prev,
        ...updatedData,
        username: editFormData.username, // Force update from form data to be instant
        email: editFormData.email
      }));

      setIsEditing(false);
      alert("Profile updated successfully!");

    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* --- 1. TOP NAVBAR --- */}
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LuSparkles className="text-lg" />
            </div>
            <span className="text-lg font-bold tracking-wide">LearnCraft</span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/subjects">My Subjects</Link>
            <Link to="/schedule">Smart Schedule</Link>
            <Link to="/analytics">Analytics</Link>
          </div>

          {/* Right Side: Profile & Logout */}
          <div className="flex items-center gap-4">
            
            {/* CLICKABLE PROFILE SECTION */}
            <button 
              onClick={openProfile}
              className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-800 px-2 py-1.5 rounded-lg transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white border border-blue-500">
                {user?.username ? user.username.charAt(0).toUpperCase() : <FaUser />}
              </div>
              <span className="hidden sm:block text-sm font-medium">{user?.username || "Student"}</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-white transition-colors ml-2"
              title="Logout"
            >
              <FaSignOutAlt className="text-lg" />
            </button>
          </div>
        </div>
      </nav>

      {/* --- 2. MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-2">
              Welcome back! You have <span className="text-blue-600 font-bold">2 sessions</span> planned for today.
            </p>
          </div>
          <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
            <FaPlay className="text-sm" /> Start Study Timer
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Total Study Hours" 
            value="24.5h" 
            sub="+2.5h this week" 
            icon={<FaClock className="text-blue-500" />} 
          />
          <StatCard 
            title="Active Subjects" 
            value="4" 
            sub="On track" 
            icon={<FaBook className="text-purple-500" />} 
          />
          <StatCard 
            title="Productivity Score" 
            value="85%" 
            sub="High Focus" 
            icon={<FaChartLine className="text-green-500" />} 
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (2/3 width) - Charts/Timer */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Main Action Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4">
                <FaClock />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready to focus?</h2>
              <p className="text-slate-500 max-w-md mb-6">
                Start a focus session now. We'll track your time and minimize distractions.
              </p>
              <div className="w-full max-w-md bg-slate-100 rounded-xl p-4 mb-6">
                <div className="text-4xl font-mono font-bold text-slate-800">00:00:00</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Recent Sessions</h3>
                <Link to="#" className="text-sm text-blue-600 hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-slate-50">
                <SessionRow subject="React Development" time="2 hours ago" duration="45m" />
                <SessionRow subject="Database Systems" time="Yesterday" duration="1h 20m" />
                <SessionRow subject="Algorithm Design" time="Yesterday" duration="30m" />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (1/3 width) - Sidebar features */}
          <div className="space-y-8">
            
            {/* AI Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <FaRobot className="text-2xl text-purple-200" />
                <h3 className="text-lg font-bold">AI Smart Plan</h3>
              </div>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                Based on your habits, you should study <strong>Data Structures</strong> today at 4:00 PM.
              </p>
              <button className="w-full py-2.5 bg-white text-indigo-700 font-bold rounded-lg text-sm hover:bg-indigo-50 transition-colors">
                Generate Schedule
              </button>
            </div>

            {/* Quick Subjects List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">Your Subjects</h3>
              <div className="space-y-3">
                <SubjectTag name="Web Development" color="bg-blue-100 text-blue-700" />
                <SubjectTag name="Data Structures" color="bg-green-100 text-green-700" />
                <SubjectTag name="Mathematics" color="bg-orange-100 text-orange-700" />
                <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm hover:bg-slate-50 hover:text-slate-700 transition-colors">
                  + Add New Subject
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* --- 3. PROFILE MODAL --- */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">My Profile</h3>
              <button 
                onClick={() => setIsProfileOpen(false)} 
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="flex flex-col items-center mb-6">
                {/* Avatar */}
                <div className="relative group cursor-pointer mb-4">
                  <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white ring-2 ring-blue-100">
                    {editFormData.username.charAt(0).toUpperCase()}
                  </div>
                  {/* Camera Icon Overlay */}
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaCamera className="text-white text-xl" />
                  </div>
                </div>
                
                {!isEditing && (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">{user?.username}</h2>
                    <p className="text-slate-500">{editFormData.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                      Free Plan
                    </span>
                  </div>
                )}
              </div>

              {/* Form / Details */}
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Username</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editFormData.username}
                      onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                      required
                    />
                  ) : (
                    <div className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                      {user?.username}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Email Address</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                      required
                    />
                  ) : (
                    <div className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                      {editFormData.email}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-6">
                  {isEditing ? (
                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors flex items-center justify-center gap-2"
                      >
                        {isSaving ? "Saving..." : <><FaSave /> Save Changes</>}
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="w-full py-2.5 rounded-lg border-2 border-slate-200 text-slate-600 font-bold hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      <FaPen size={14} /> Edit Profile
                    </button>
                  )}
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

/* --- SIMPLE HELPER COMPONENTS --- */

// 1. Navigation Link Style
const NavLink = ({ children, active }: { children: React.ReactNode, active?: boolean }) => (
  <span className={`cursor-pointer text-sm font-medium transition-colors ${active ? "text-white" : "text-slate-400 hover:text-white"}`}>
    {children}
  </span>
);

// 2. Stat Card
const StatCard = ({ title, value, sub, icon }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
    <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
  </div>
);

// 3. Session Row
const SessionRow = ({ subject, time, duration }: any) => (
  <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{subject}</p>
        <p className="text-xs text-slate-400">{time}</p>
      </div>
    </div>
    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">{duration}</span>
  </div>
);

// 4. Subject Tag
const SubjectTag = ({ name, color }: any) => (
  <div className={`px-3 py-2 rounded-lg text-sm font-medium ${color}`}>
    {name}
  </div>
);

export default Dashboard;