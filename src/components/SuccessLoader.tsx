import React from 'react';
import { LuSparkles } from 'react-icons/lu';

interface SuccessLoaderProps {
  message?: string;
}

const SuccessLoader: React.FC<SuccessLoaderProps> = ({ message = "Welcome back!" }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white animate-fadeIn">
      {/* Bouncing Logo */}
      <div className="mb-6 p-4 bg-blue-50 rounded-full animate-bounce">
        <LuSparkles className="text-5xl text-blue-600" />
      </div>

      {/* Text */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
      <p className="text-gray-500 mb-8">{message}</p>

      {/* Loading Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default SuccessLoader;