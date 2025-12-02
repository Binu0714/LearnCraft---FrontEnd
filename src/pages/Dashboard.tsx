import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/authContext"; 
import { FaBook, FaClock, FaChartLine, FaSignOutAlt, FaUser, FaPlay, FaRobot } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu"; // Your logo icon

const Dashboard: React.FC = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* --- 1. TOP NAVBAR (Website Style) --- */}
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LuSparkles className="text-lg" />
            </div>
            <span className="text-lg font-bold tracking-wide">LearnCraft</span>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/subjects">My Subjects</Link>
            <Link to="/schedule">Smart Schedule</Link>
            <Link to="/analytics">Analytics</Link>
          </div>

          {/* Right Side: Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white border border-blue-500">
                {user?.username ? user.username.charAt(0).toUpperCase() : <FaUser />}
              </div>
              <span className="hidden sm:block text-sm font-medium">{user?.username || "Student"}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-white transition-colors"
              title="Logout"
            >
              <FaSignOutAlt className="text-lg" />
            </button>
          </div>
        </div>
      </nav>

      {/* --- 2. MAIN CONTENT CONTAINER --- */}
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
            
            {/* AI Card (The Advanced Feature) */}
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