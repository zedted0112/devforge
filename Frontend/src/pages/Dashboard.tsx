import React from 'react';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { email, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth(); // Remove tokens from Zustand
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4 tracking-wide">DevForge</h1>

      <div className="w-full max-w-md p-6 bg-white bg-opacity-90 shadow-xl rounded-xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Welcome, Commander Luffy</h2>
        <p className="mb-6 text-gray-600">Logged in as <span className="font-medium">{email}</span></p>

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
