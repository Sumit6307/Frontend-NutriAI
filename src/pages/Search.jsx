import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Droplet, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../constants';

const Search = () => {
  const [meals, setMeals] = useState({ breakfast: [], lunch: [], dinner: [], snacks: [] });
  const [current, setCurrent] = useState({
    food: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: 'breakfast',
  });
  const [waterIntake, setWaterIntake] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/calories`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const grouped = res.data.reduce(
          (acc, log) => {
            acc[log.mealType].push(log);
            return acc;
          },
          { breakfast: [], lunch: [], dinner: [], snacks: [] }
        );
        setMeals(grouped);
      } catch (err) {
        setError('Failed to fetch meals. Please try again.');
        console.error('Fetch logs error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const addFoodItem = async () => {
    if (!current.food.trim()) {
      setError('Food name is required.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (!current.calories || isNaN(current.calories) || current.calories <= 0) {
      setError('Calories must be a positive number.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `${API_URL}/calories`,
        {
          food: current.food.trim(),
          calories: parseInt(current.calories),
          protein: parseFloat(current.protein) || 0,
          carbs: parseFloat(current.carbs) || 0,
          fat: parseFloat(current.fat) || 0,
          mealType: current.mealType,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setMeals((prev) => ({
        ...prev,
        [current.mealType]: [...prev[current.mealType], res.data],
      }));
      setCurrent({
        food: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        mealType: 'breakfast',
      });
      setMessage('Meal added successfully! 🍽️');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add meal.');
      console.error('Add food error:', err);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id, mealType) => {
    try {
      await axios.delete(`${API_URL}/calories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMeals((prev) => ({
        ...prev,
        [mealType]: prev[mealType].filter((log) => log._id !== id),
      }));
      setMessage('Meal deleted! 🗑️');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete meal.');
      console.error('Delete log error:', err);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleWaterAdd = (amount) => {
    setWaterIntake((prev) => prev + amount);
    setMessage(`Added ${amount}ml of water! 💧`);
    setTimeout(() => setMessage(''), 3000);
  };

  const getTotalCalories = () => {
    return Object.values(meals)
      .flat()
      .reduce((sum, item) => sum + item.calories, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-green-400 tracking-tight">
            Calorie Tracker
          </h1>
          <p className="mt-2 text-lg text-gray-300 animate-pulse">
            Log your meals and stay hydrated with ease! 🌟
          </p>
        </motion.div>

        {/* Notifications */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-2 z-50"
            >
              <CheckCircle size={20} />
              {message}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-4 bg-red-900/80 text-red-200 p-4 rounded-lg shadow-lg flex items-center gap-2 z-50"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Meal Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50"
        >
          <h2 className="text-2xl font-semibold text-green-400 mb-6 flex items-center gap-2">
            <PlusCircle size={24} /> Log a New Meal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Food name (e.g., Avocado Toast)"
              value={current.food}
              onChange={(e) => setCurrent({ ...current, food: e.target.value })}
              className="p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 hover:bg-gray-600/50"
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Calories (kcal)"
              value={current.calories}
              onChange={(e) => setCurrent({ ...current, calories: e.target.value })}
              className="p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 hover:bg-gray-600/50"
              min="0"
              disabled={loading}
            />
            <select
              value={current.mealType}
              onChange={(e) => setCurrent({ ...current, mealType: e.target.value })}
              className="p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 hover:bg-gray-600/50"
              disabled={loading}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
            </select>
            <input
              type="number"
              placeholder="Protein (g)"
              value={current.protein}
              onChange={(e) => setCurrent({ ...current, protein: e.target.value })}
              className="p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 hover:bg-gray-600/50"
              min="0"
              step="0.1"
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Carbs (g)"
              value={current.carbs}
              onChange={(e) => setCurrent({ ...current, carbs: e.target.value })}
              className="p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 hover:bg-gray-600/50"
              min="0"
              step="0.1"
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Fat (g)"
              value={current.fat}
              onChange={(e) => setCurrent({ ...current, fat: e.target.value })}
              className="p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 hover:bg-gray-600/50"
              min="0"
              step="0.1"
              disabled={loading}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addFoodItem}
            disabled={loading}
            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="inline-block">
                  ⏳
                </motion.span>
                Adding...
              </>
            ) : (
              <>
                <PlusCircle size={20} />
                Add Meal
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Meal Logs */}
        <div className="space-y-8">
          {Object.keys(meals).map((mealKey) => (
            <motion.div
              key={mealKey}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50"
            >
              <h3 className="text-2xl font-semibold text-green-400 capitalize mb-6 flex items-center gap-2">
                {mealKey === 'breakfast' && '☀️'}
                {mealKey === 'lunch' && '🍴'}
                {mealKey === 'dinner' && '🌙'}
                {mealKey === 'snacks' && '🥐'}
                {mealKey}
              </h3>
              {loading ? (
                <p className="text-gray-400 flex items-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    ⏳
                  </motion.span>
                  Loading meals...
                </p>
              ) : meals[mealKey].length === 0 ? (
                <p className="text-gray-400">No meals logged yet. Start adding above! 😋</p>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence>
                    {meals[mealKey].map((item) => (
                      <motion.li
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all duration-200"
                      >
                        <div>
                          <p className="font-semibold text-lg text-white">{item.food}</p>
                          <p className="text-sm text-gray-300">
                            {item.calories} kcal | P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteLog(item._id, mealKey)}
                          className="text-red-400 hover:text-red-500 transition-colors duration-200"
                          title="Delete meal"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        {/* Water Intake */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50"
        >
          <h3 className="text-2xl font-semibold text-green-400 mb-6 flex items-center gap-2">
            <Droplet size={24} className="text-blue-400" /> Water Intake
          </h3>
          <div className="flex flex-wrap gap-4 mb-6">
            {[250, 500, 750].map((amt) => (
              <motion.button
                key={amt}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleWaterAdd(amt)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-300"
              >
                <Droplet size={18} /> +{amt}ml
              </motion.button>
            ))}
          </div>
          <p className="text-lg font-semibold text-green-400">
            Total Water: <span className="text-blue-400">{waterIntake} ml</span>
          </p>
          <motion.div
            className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((waterIntake / 2000) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-full bg-blue-400"></div>
          </motion.div>
          <p className="text-sm text-gray-400 mt-2">
            {waterIntake >= 2000 ? 'Great job staying hydrated! 💦' : `Aim for 2000ml daily!`}
          </p>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center p-6 bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50"
        >
          <h3 className="text-2xl font-bold text-green-400">
            Total Calories Today: <span className="text-white">{getTotalCalories()} kcal</span>
          </h3>
          <p className="mt-2 text-gray-300">
            {getTotalCalories() > 0 ? 'Keep tracking to reach your goals! 🚀' : 'Log some meals to see your progress!'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Search;