import React from 'react';
import { Link } from 'react-router-dom';
import { LuSparkles} from 'react-icons/lu';
import { FaArrowRight } from 'react-icons/fa';

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Moving Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40"></div>
      <div className="absolute top-20 -left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40"></div>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-12 pb-12 px-6">
        
        {/* 1. LOGO (Moved inside Hero) */}
        <div className="flex items-center gap-3 mb-12 animate-fade-in-down">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl text-white shadow-xl shadow-blue-500/30">
            <LuSparkles className="text-3xl" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">LearnCraft</span>
        </div>

        {/* 2. HERO TEXT */}
        <div className="max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-100 text-blue-600 text-sm font-medium mb-8 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            The #1 Platform for Crafters
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
            Craft Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Future</span> <br />
            One Skill at a Time.
          </h1>

          {/* Subhead */}
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join a community of millions. Master new skills, track your progress, 
            and unlock new career opportunities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-16">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-full transition-all shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2 group hover:-translate-y-1"
            >
              Get Started Free
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 bg-white border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 text-lg font-bold rounded-full transition-all shadow-sm hover:shadow-md"
            >
              I have an account
            </Link>
          </div>
        </div>

        
      </main>

    </div>
  );
};

