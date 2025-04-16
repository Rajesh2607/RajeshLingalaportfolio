import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Lock } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAdminAuth();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation will be handled by the useEffect above once isAdmin updates
    } catch (error) {
      console.error('Login error:', error);
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address format');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later');
          break;
        default:
          setError('Failed to login. Please check your credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a192f] px-4">
      <div className="max-w-md w-full space-y-8 bg-[#112240] p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-[#17c0f8]" />
          <h2 className="mt-6 text-3xl font-bold text-white">Admin Access</h2>
          <p className="mt-2 text-sm text-gray-400">Secure administrative portal</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-[#1d3a6e] placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-[#17c0f8] focus:border-[#17c0f8] sm:text-sm"
                placeholder="Admin email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-[#1d3a6e] placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-[#17c0f8] focus:border-[#17c0f8] sm:text-sm"
                placeholder="Admin password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#17c0f8] hover:bg-[#17c0f8]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17c0f8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                'Access Admin Panel'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;