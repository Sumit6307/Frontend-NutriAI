import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../constants';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(res.data.message || 'Reset link sent! Check your email.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-24 text-white">
      <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 max-w-md w-full p-10">
        <div className="text-center mb-8">
          <span className="text-4xl animate-bounce inline-block mb-4">📧</span>
          <h2 className="text-4xl font-extrabold text-green-400 font-sans tracking-tight">
            Forgot Password?
          </h2>
          <p className="text-gray-400 mt-2 text-sm font-light">
            Enter your email to receive a reset link
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
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                📧
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 transition-all py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-green-600/50 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;