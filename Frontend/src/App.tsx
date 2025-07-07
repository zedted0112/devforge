import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';


// import Signup from './pages/Signup'; // Create later
// import Dashboard from './pages/Dashboard'; // Create later

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
  <Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    }
  />
  <Route path="*" element={<div className="p-8 text-center text-red-500">404 Not Found</div>} />
</Routes>

    </div>
  );
};

export default App;
