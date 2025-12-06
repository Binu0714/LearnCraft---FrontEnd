import React, {useState, type FormEvent} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { LuSparkles } from 'react-icons/lu';
import { register } from '../services/auth';

export default function SignUp() {

const navigate = useNavigate();

const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try{
      const obj = {
        username,
        email,
        password
      }

      const res: any = await register(obj)
      console.log(res.data);
      console.log(res.message);

      alert('Registration successful! You can now log in.');
      navigate('/login');

    }catch (error: any) {
      console.error(error?.response?.data);
    }
}

const handleGoogleLogin = () => {
  window.location.href = "http://localhost:5000/api/v1/auth/google";
};

const handleFacebookLogin = () => {
  window.location.href = "http://localhost:5000/api/v1/auth/facebook";
};

  return (
    <div className="flex h-screen w-full font-sans">
      
      {/* LEFT SIDE - SIGNUP FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 md:p-16">
        <div className="w-full max-w-md">
          
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-blue-100 p-2 rounded-lg">
              <LuSparkles className="text-blue-600 text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">LearnCraft</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
          <p className="text-gray-500 mb-8">Enter your details to start your learning journey.</p>

          <form className="flex flex-col gap-4">
            
            {/* Username Input */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Username</label>
              <input 
                type="text" 
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Email Input */}
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

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input 
                type="password" 
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <button onClick={handleRegister} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-2">
              Sign up
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
            <span className="text-gray-500">Already have an account? </span>
            {/* Link to Login Page */}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Log in
            </Link>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE - BLUE GRADIENT (Same as Login) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-50"></div>
        <div className="relative z-10 text-center max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Start Your Journey</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Join millions of learners on LearnCraft. Create your account today and start mastering new skills.
          </p>
        </div>
      </div>

    </div>
  )
}

