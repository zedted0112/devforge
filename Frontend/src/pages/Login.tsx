import React, { useState } from 'react';
import { login } from '../api/auth';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login({ email, password });
      setAuthData({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: String(data.user.id),
        email: data.user.email,



      });

      console.log('Logged in:', data.user.email);
console.log(' Token:', data.accessToken);
      navigate('/dashboard');




      // TODO: redirect to /dashboard after success
    
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Login failed';
    
      setError(errorMsg);
    
      // If backend sends specific message for missing user
   
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8 tracking-wide">DevForge</h1>

      <div className="w-full max-w-md p-6 bg-white bg-opacity-90 shadow-xl rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Log In
          </button>
        </form>

        
        <p className="mt-4 text-center text-sm text-gray-600">
  Don’t have an account?{' '}
  <button
    onClick={() => navigate('/signup')}
    className="text-indigo-600 hover:text-indigo-800 font-medium underline"
  >
    Sign up here
  </button>
</p>
      </div>
    </div>
  );
};

export default Login;
