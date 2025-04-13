import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    weight: user?.weight || '',
    goal: user?.goal || 'Maintain',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState('');

  const validatePassword = (password) => {
    if (password.length < 6) return 'Weak';
    if (password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password)) return 'Strong';
    return 'Medium';
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (profileForm.weight && (isNaN(profileForm.weight) || profileForm.weight <= 0)) {
      setError('Weight must be a positive number.');
      return;
    }
    setLoading(true);
    setError('');
    const payload = {
      name: profileForm.name.trim(),
      weight: profileForm.weight ? Number(profileForm.weight) : null,
      goal: profileForm.goal,
    };
    try {
      console.log('Sending profile update:', {
        payload,
        token: localStorage.getItem('token'),
        url: `${API_URL}/user/profile`,
      });
      const res = await axios.put(`${API_URL}/user/profile`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Profile update response:', res.data);
      if (res.data.user) {
        if (typeof setUser === 'function') {
          setUser(res.data.user);
        } else {
          console.warn('setUser is not a function, updating localStorage manually');
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      } else {
        console.warn('No user data in response:', res.data);
        if (typeof setUser === 'function') {
          setUser({ ...user, ...payload });
        } else {
          console.warn('setUser is not a function, updating localStorage manually');
          localStorage.setItem('user', JSON.stringify({ ...user, ...payload }));
        }
      }
      setMessage('Profile updated successfully! 🎉');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Profile update error:', {
        message: err.message,
        response: err.response ? {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        } : 'No response',
        url: `${API_URL}/user/profile`,
        token: localStorage.getItem('token') ? 'Present' : 'Missing',
        payload,
      });
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setError('All password fields are required.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (validatePassword(passwordForm.newPassword) === 'Weak') {
      setError('Password is too weak. Use at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(
        `${API_URL}/user/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setMessage('Password changed successfully! 🔒');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStrength('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (passwordForm.newPassword) {
      setPasswordStrength(validatePassword(passwordForm.newPassword));
    } else {
      setPasswordStrength('');
    }
  }, [passwordForm.newPassword]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-4xl animate-bounce inline-block mb-4">⚙️</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-green-400 font-sans tracking-tight">
            Settings
          </h2>
          <p className="text-gray-400 mt-2 text-lg animate-pulse">
            Customize your NutriAI experience! 🌟
          </p>
        </div>

        {message && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-8 text-center animate-fade-in-down">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-900/30 text-red-400 p-4 rounded-lg mb-8 text-center animate-fade-in-down">
            {error}
          </div>
        )}

        {/* Profile Settings */}
        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl mb-8 transform transition-all duration-300 hover:scale-105">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-green-400 flex items-center gap-2">
              <span className="text-2xl">👤</span> Profile Settings
            </h3>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="text-green-400 hover:text-green-500 transition-colors duration-200"
            >
              {showProfile ? 'Hide ▼' : 'Show ▲'}
            </button>
          </div>
          {showProfile && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={profileForm.weight}
                  onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 70"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Health Goal</label>
                <select
                  value={profileForm.goal}
                  onChange={(e) => setProfileForm({ ...profileForm, goal: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option>Maintain</option>
                  <option>Lose Weight</option>
                  <option>Gain Muscle</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span> Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Password Settings */}
        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-green-400 flex items-center gap-2">
              <span className="text-2xl">🔒</span> Change Password
            </h3>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-green-400 hover:text-green-500 transition-colors duration-200"
            >
              {showPassword ? 'Hide ▼' : 'Show ▲'}
            </button>
          </div>
          {showPassword && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter new password"
                  required
                />
                {passwordStrength && (
                  <p
                    className={`text-sm mt-1 ${
                      passwordStrength === 'Weak'
                        ? 'text-red-400'
                        : passwordStrength === 'Medium'
                        ? 'text-yellow-400'
                        : 'text-green-400'
                    }`}
                  >
                    Password Strength: {passwordStrength}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span> Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;