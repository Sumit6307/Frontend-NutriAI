import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../constants';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password,
      });
      setMessage(response.data.message || 'Password reset successfully!');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-24 text-white">
      <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 max-w-md w-full p-10">
        <div className="text-center mb-8">
          <span className="text-4xl animate-bounce inline-block mb-4">🔒</span>
          <h2 className="text-4xl font-extrabold text-green-400 font-sans tracking-tight">
            Reset Your Password
          </h2>
          <p className="text-gray-400 mt-2 text-sm font-light">
            Enter a new password for your account
          </p>
        </div>
        {message && (
          <p className="text-green-400 text-center mb-4 bg-green-900/30 p-3 rounded-lg">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-400 text-center mb-4 bg-red-900/30 p-3 rounded-lg">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                🔒
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                🔒
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 transition-all py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-green-600/50 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Back to{' '}
          <Link to="/login" className="text-green-400 hover:underline font-medium">
            Sign In
          </Link>
        </p>
        <p className="text-xs text-center text-gray-500 mt-4">
          Your data stays safe and private. We never share your info.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;