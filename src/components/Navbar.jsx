import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) =>
    location.pathname === path
      ? 'text-green-400 font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-green-400 after:transition-all'
      : 'text-gray-200 hover:text-green-400 transition duration-300';

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { to: '/home', label: 'Home', emoji: '🏠' },
    { to: '/scanner', label: 'Scanner', emoji: '📸' },
    { to: '/search', label: 'Calorie Counter', emoji: '📈' },
    { to: '/chatbot', label: 'AI Chatbot', emoji: '🤖' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-gray-800/90 backdrop-blur-md shadow-md px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300 ${
        isScrolled ? 'bg-gray-800/95' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/home"
          className="text-2xl font-extrabold text-green-400 flex items-center gap-2 group"
        >
          <span className="text-3xl animate-bounce group-hover:scale-110 transition-transform">
            🍎
          </span>
          NutriAI
          <span className="hidden group-hover:inline text-sm text-gray-400 animate-pulse">
            Fuel Your Health!
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-base font-medium">
          {navLinks.map(({ to, label, emoji }) => (
            <Link
              key={to}
              to={to}
              className={`${isActive(to)} group relative`}
              title={`${label} ${emoji}`}
            >
              {label}
              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-700 text-green-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {emoji}
              </span>
            </Link>
          ))}
          {user ? (
            <ProfileDropdown logout={handleLogout} />
          ) : (
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
            >
              <span>🔑</span> Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-green-400 hover:text-green-500 transition"
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <span className="text-2xl animate-spin">✖️</span>
          ) : (
            <span className="text-2xl animate-bounce">🍔</span>
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800/95 backdrop-blur-md mt-4 rounded-lg p-4 flex flex-col gap-4 animate-slide-down">
          {navLinks.map(({ to, label, emoji }) => (
            <Link
              key={to}
              to={to}
              className={`${isActive(to)} flex items-center gap-2`}
              onClick={() => setMenuOpen(false)}
            >
              <span>{emoji}</span> {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/profile"
                className={`${isActive('/profile')} flex items-center gap-2`}
                onClick={() => setMenuOpen(false)}
              >
                <span>👤</span> Profile
              </Link>
              <Link
                to="/settings"
                className={`${isActive('/settings')} flex items-center gap-2`}
                onClick={() => setMenuOpen(false)}
              >
                <span>⚙️</span> Settings
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <span>🚪</span> Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <span>🔑</span> Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;