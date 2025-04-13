import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProfileDropdown = ({ logout }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { to: '/profile', label: 'Profile', emoji: '👤' },
    { to: '/settings', label: 'Settings', emoji: '⚙️' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 text-gray-200 hover:text-green-400 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full"
        title={`Hi, ${user?.name || 'User'}!`}
      >
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold animate-pulse group-hover:scale-110 transition-transform">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="hidden sm:inline group-hover:text-green-400">
          {user?.name || 'Profile'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 animate-fade-in-down sm:w-64">
          {/* Profile Card */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-green-400 font-semibold">{user?.name || 'User'}</p>
                <p className="text-gray-400 text-xs truncate">{user?.email || 'No email'}</p>
              </div>
            </div>
          </div>
          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map(({ to, label, emoji }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-green-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span>{emoji}</span> {label}
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;