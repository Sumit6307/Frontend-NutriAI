import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../constants';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [daysLeft, setDaysLeft] = useState(30);
  const [totalCalories, setTotalCalories] = useState(0);
  const [filter, setFilter] = useState('all');
  const [quote, setQuote] = useState('');
  const [showLogs, setShowLogs] = useState(true);
  const [error, setError] = useState('');
  const chartRef = useRef(null);

  const quotes = [
    '🥗 "Eat well, live well!"',
    '💪 "Your body deserves the best fuel."',
    '🌱 "Small steps lead to big health wins."',
    '🍎 "Nourish your body, thrive every day."',
    '🏃 "Health is wealth, keep moving!"',
  ];

  useEffect(() => {
    if (user) {
      // Fetch calorie logs
      const fetchLogs = async () => {
        try {
          const res = await axios.get(`${API_URL}/calories`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setLogs(res.data);
          setTotalCalories(res.data.reduce((sum, log) => sum + (log.calories || 0), 0));
          setError('');
        } catch (err) {
          console.error('Failed to fetch logs:', err);
          setError('Unable to load calorie logs. Please try again.');
        }
      };
      fetchLogs();

      // Calculate trial days
      const trialStart = new Date(user.trialStart);
      if (!isNaN(trialStart)) {
        const msInDay = 1000 * 60 * 60 * 24;
        const elapsed = Math.floor((Date.now() - trialStart) / msInDay);
        setDaysLeft(Math.max(0, 30 - elapsed));
      }

      // Set random quote
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  }, [user]);

  // Draw calorie trend chart
  useEffect(() => {
    if (logs.length > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const validLogs = logs.filter(
        (log) => log.date && !isNaN(new Date(log.date)) && typeof log.calories === 'number'
      );
      const dates = [
        ...new Set(validLogs.map((log) => new Date(log.date).toLocaleDateString())),
      ].slice(-5);
      const caloriesByDate = dates.map((date) =>
        validLogs
          .filter((log) => new Date(log.date).toLocaleDateString() === date)
          .reduce((sum, log) => sum + log.calories, 0)
      );

      // Clear previous chart
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if (dates.length === 0) return;

      // Chart dimensions
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      const maxCalories = Math.max(...caloriesByDate, 1000);
      const stepX = dates.length > 1 ? chartWidth / (dates.length - 1) : chartWidth;
      const stepY = chartHeight / maxCalories;

      // Draw grid
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = height - padding - (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }

      // Draw Y-axis labels
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#d1d5db';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) {
        const cal = Math.round((maxCalories / 4) * i);
        ctx.fillText(cal, padding - 10, height - padding - (chartHeight / 4) * i + 4);
      }

      // Draw X-axis labels
      ctx.textAlign = 'center';
      dates.forEach((date, i) => {
        ctx.fillText(date, padding + i * stepX, height - padding + 20);
      });

      // Draw line
      ctx.beginPath();
      ctx.moveTo(padding, height - padding - caloriesByDate[0] * stepY);
      caloriesByDate.forEach((cal, i) => {
        ctx.lineTo(padding + i * stepX, height - padding - cal * stepY);
      });
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw points
      caloriesByDate.forEach((cal, i) => {
        ctx.beginPath();
        ctx.arc(padding + i * stepX, height - padding - cal * stepY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#4ade80';
        ctx.fill();
      });

      // Tooltip
      const canvas = chartRef.current;
      const showTooltip = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        caloriesByDate.forEach((cal, i) => {
          const px = padding + i * stepX;
          const py = height - padding - cal * stepY;
          if (Math.abs(x - px) < 10 && Math.abs(y - py) < 10) {
            canvas.title = `${dates[i]}: ${cal} kcal`;
          }
        });
      };
      canvas.addEventListener('mousemove', showTooltip);
      return () => canvas.removeEventListener('mousemove', showTooltip);
    }
  }, [logs]);

  const filteredLogs = filter === 'all' ? logs : logs.filter((log) => log.mealType === filter);

  // Meal type breakdown
  const mealBreakdown = logs.reduce(
    (acc, log) => {
      acc[log.mealType] = (acc[log.mealType] || 0) + 1;
      return acc;
    },
    { breakfast: 0, lunch: 0, dinner: 0, snack: 0 }
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-4xl animate-bounce inline-block mb-4">👤</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-green-400 font-sans tracking-tight">
            Your NutriAI Profile
          </h2>
          <p className="text-gray-400 mt-2 text-lg animate-pulse">{quote}</p>
        </div>

        {error && (
          <p className="text-red-400 bg-red-900/30 p-4 rounded-lg text-center mb-8">{error}</p>
        )}

        {/* Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Account Info */}
          <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center gap-2">
              <span className="text-2xl">👤</span> Account Info
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-xl animate-pulse">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-lg">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>
            <p className="text-sm flex items-center gap-2">
              <span className="text-green-400">📅</span>
              <strong>Trial Started:</strong>{' '}
              {user?.trialStart ? new Date(user.trialStart).toDateString() : 'Not set'}
            </p>
            <p className="text-sm flex items-center gap-2 mt-2">
              <span className="text-green-400">⏳</span>
              <strong>Trial Left:</strong>{' '}
              <span className={daysLeft <= 5 ? 'text-red-400' : 'text-green-400'}>
                {daysLeft} day(s)
              </span>
            </p>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(daysLeft / 30) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {Math.round((daysLeft / 30) * 100)}% of trial remaining
              </p>
            </div>
          </div>

          {/* Health Goals */}
          <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Health Goals
            </h3>
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <span className="text-green-400">⚖️</span>
                <strong>Weight:</strong> {user?.weight || 'Not set'} kg
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-400">🏁</span>
                <strong>Goal:</strong> {user?.goal || 'Not set'}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-400">🔥</span>
                <strong>Total Calories:</strong> {totalCalories} kcal
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-400">🍽️</span>
                <strong>Meals Logged:</strong> {logs.length}
              </p>
            </div>
          </div>
        </div>

        {/* Calorie Trends */}
        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl mb-12">
          <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center gap-2">
            <span className="text-2xl">📈</span> Calorie Trends
          </h3>
          {logs.length > 0 ? (
            <canvas ref={chartRef} width="400" height="200" className="w-full" />
          ) : (
            <p className="text-gray-400 text-center py-8">
              No data to display yet. Log some meals! 📊
            </p>
          )}
        </div>

        {/* Meal Breakdown */}
        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl mb-12">
          <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center gap-2">
            <span className="text-2xl">🍴</span> Meal Breakdown
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(mealBreakdown).map(([type, count]) => (
              <div
                key={type}
                className="p-4 bg-gray-700/50 rounded-lg text-center transform transition-all duration-200 hover:scale-105"
              >
                <p className="capitalize font-semibold">{type}</p>
                <p className="text-green-400 text-lg">{count} meal{count !== 1 ? 's' : ''}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calorie Logs */}
        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-green-400 flex items-center gap-2">
              <span className="text-2xl">📅</span> Calorie Logs
            </h3>
            <div className="flex gap-4 items-center">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Meals</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="text-green-400 hover:text-green-500 transition-colors duration-200"
              >
                {showLogs ? 'Hide Logs ▼' : 'Show Logs ▲'}
              </button>
            </div>
          </div>
          {showLogs && (
            filteredLogs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log._id}
                    className="p-4 bg-gray-700/50 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105"
                  >
                    <p className="font-semibold capitalize text-green-400">{log.food}</p>
                    <p className="text-lg">{log.calories} kcal</p>
                    <p className="text-sm text-gray-400 capitalize">{log.mealType}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(log.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No meals logged yet. Start tracking now! 🍽️
              </p>
            )
          )}
        </div>

        {/* Trial Warning */}
        {daysLeft === 0 && (
          <div className="mt-12 p-6 bg-red-900/30 rounded-3xl text-center shadow-lg transform transition-all duration-300 hover:scale-105">
            <p className="text-red-400 mb-4">
              Your free trial has ended. Upgrade to continue your nutrition journey!
            </p>
            <Link
              to="/login#pricing"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Upgrade Now 🌟
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;