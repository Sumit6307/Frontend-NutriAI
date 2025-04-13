import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="transform transition-all duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-3xl animate-pulse">🌱</span>
              NutriAI
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your AI-powered nutrition assistant to track, scan, and optimize your health journey.
            </p>
            {/* Social Media Links */}
            <div className="flex gap-4 mt-4">
              {[
                { emoji: '🐦', href: 'https://twitter.com/nutriai', label: 'Twitter' },
                { emoji: '📸', href: 'https://instagram.com/nutriai', label: 'Instagram' },
                { emoji: '📘', href: 'https://facebook.com/nutriai', label: 'Facebook' },
                { emoji: '💼', href: 'https://linkedin.com/company/nutriai', label: 'LinkedIn' },
              ].map(({ emoji, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                  aria-label={label}
                >
                  <span className="text-xl">{emoji}</span>
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-xl">ℹ️</span> About Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-400">🚀</span> Built by Team GRAVITY
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">🏆</span> Hackathon 2025 Winner
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">🎯</span> Mission: Simplify Nutrition
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-xl">📞</span> Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-400">📧</span>
                <a
                  href="mailto:support@nutriai.app"
                  className="hover:text-green-400 transition-colors duration-200"
                >
                  support@nutriai.app
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">📞</span>
                <a
                  href="tel:+919876543210"
                  className="hover:text-green-400 transition-colors duration-200"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">📍</span> Bengaluru, India
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-xl">✨</span> Features
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-400">📷</span> AI Food Scanner
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">📊</span> Calorie Tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">🤖</span> Nutrition Chatbot
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">🏋️</span> Personalized Goals
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold text-green-400 mb-4">
              Stay Healthy with NutriAI
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe for tips, updates, and exclusive offers!
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  📧
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-green-400 mt-2 animate-fade-in-up">
                Thanks for subscribing! 🎉
              </p>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} NutriAI by Team GRAVITY. All rights reserved.
          <div className="mt-2 flex justify-center gap-4">
            <Link to="/privacy" className="hover:text-green-400 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-green-400 transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;