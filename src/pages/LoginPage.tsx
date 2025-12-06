import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { LuSparkles } from 'react-icons/lu';
import { FaTimes, FaEnvelope } from 'react-icons/fa'; 
import { getMyDetails, login, requestPasswordReset } from '../services/auth';
import { AuthContext } from '../context/authContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);

      if (!res.data.accessToken) {
        alert('Login failed. Please try again.');
        return;
      }

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      const detail = await getMyDetails();
      setUser(detail.data);

      navigate('/dashboard');

    } catch (error) {
      console.error(error);
      alert('Invalid email or password.');

    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      alert("Please enter your email.");
      return;
    }

    setResetLoading(true);

    try {
      const res = await requestPasswordReset(resetEmail);
      alert(res.message || "Password reset link sent! Please check your email.");
      setIsModalOpen(false);

    } catch (error) {
      console.error(error);
      alert("Failed to send reset link. Please try again.");
      
    } finally {
      setResetLoading(false);
    }
  };

  const openForgotModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setResetEmail(email); 
    setIsModalOpen(true);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/facebook";
  };

  return (
    <div className="flex h-screen w-full font-sans relative">
     
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 md:p-16">
        <div className="w-full max-w-md">
          
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-blue-100 p-2 rounded-lg">
              <LuSparkles className="text-blue-600 text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">LearnCraft</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Please enter your details to sign in.</p>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Email address</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex justify-end items-center">
              <button 
                onClick={openForgotModal}
                className="text-sm text-blue-600 hover:underline font-medium bg-transparent border-none cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-2 disabled:bg-blue-400"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleGoogleLogin} className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              <FcGoogle className="text-xl" />
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button onClick={handleFacebookLogin} className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              <FaFacebook className="text-xl text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Facebook</span>
            </button>
          </div>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Sign up
            </Link>
          </div>

        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-50"></div>
        <div className="relative z-10 text-center max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Craft Your Future</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Join millions of learners on LearnCraft. Master new skills, track your progress, and achieve your goals.
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
            
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-lg">Reset Password</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaEnvelope className="text-xl" />
                </div>
                <h4 className="text-gray-900 font-semibold text-lg">Forgot your password?</h4>
                <p className="text-gray-500 text-sm mt-1">
                  Enter your email address and we will send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-blue-200 disabled:bg-blue-300"
                >
                  {resetLoading ? "Sending Link..." : "Send Reset Link"}
                </button>

                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-transparent text-gray-500 hover:text-gray-700 font-medium py-2 text-sm"
                >
                  Back to Login
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}