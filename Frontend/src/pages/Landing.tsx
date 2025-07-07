import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-indigo-50 flex flex-col items-center justify-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-indigo-700 tracking-tight mb-4 text-center"
      >
        Welcome to <span className="text-black">DevForge</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-gray-600 text-center max-w-xl mb-8 text-lg"
      >
        Build, authenticate, and scale your microservices like a pro. The next-gen developer toolkit is here.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/login')}
        className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition"
      >
        Launch Command Center
      </motion.button>

      <p className="mt-12 text-sm text-gray-400">Version 0.1 · MVP in Progress</p>
    </div>
  );
};

export default Landing;
