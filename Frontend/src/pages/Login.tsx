import React, { useState } from 'react';
import { login, syncUser } from '../api/auth';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const data = await login({ email, password });
      setAuthData({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: String(data.user.id),
        email: data.user.email,
      });

      // Ensure token is in localStorage before calling syncUser
      localStorage.setItem('accessToken', data.accessToken);

      // console.log('Logged in:', data.user.email);
      // console.log(' Token:', data.accessToken);
      
      // Sync user to project service
      try {
        await syncUser({
          id: data.user.id,
          email: data.user.email
        });
        // console.log('User synced to project service');
      } catch (syncErr: any) {
        // console.warn('Failed to sync user to project service:', syncErr);
        // Don't block login if sync fails, just log it
      }

      navigate('/dashboard', { replace: true });

      // Redirect to dashboard after success
    
    } catch (err: any) {
      let errorMsg = 'Login failed';
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message === 'Network Error') {
        errorMsg = 'Cannot reach the server. Please try again later.';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
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
            aria-label="Email address"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-gray-600">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-indigo-600 hover:text-indigo-800 font-medium underline"
            >
              Forgot your password?
            </button>
          </p>
          
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-indigo-600 hover:text-indigo-800 font-medium underline"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
