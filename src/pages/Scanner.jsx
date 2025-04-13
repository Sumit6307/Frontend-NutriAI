import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import foodData from '../data/food';

const Scanner = () => {
  const [image, setImage] = useState(null);
  const [foodName, setFoodName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [mealType, setMealType] = useState('snack');
  const [suggestions, setSuggestions] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImage(URL.createObjectURL(file));
        setFoodName('Apple'); // Simulated detection
        setError('');
      } else {
        setError('Please upload a valid image file.');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!foodName) {
      setError('Please enter a food name.');
      return;
    }
    setLoading(true);
    setError('');
    const food = foodData.find((item) => item.name.toLowerCase() === foodName.toLowerCase());
    if (food) {
      try {
        await axios.post(
          `${API_URL}/calories`,
          {
            food: food.name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            mealType,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        setResult(food);
        setToast('Food logged successfully! 🎉');
        setTimeout(() => setToast(''), 3000);
      } catch (err) {
        console.error('Failed to log food:', err);
        setError('Failed to log food. Please try again.');
      }
    } else {
      setError('Food not found in database.');
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (!searchTerm) {
      setError('Please enter a food to search.');
      return;
    }
    const food = foodData.find((item) => item.name.toLowerCase() === searchTerm.toLowerCase());
    setResult(food || null);
    setError(food ? '' : 'Food not found in database.');
    setSuggestions([]);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 1) {
      const matches = foodData
        .filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (name) => {
    setSearchTerm(name);
    setSuggestions([]);
    handleSearch();
  };

  const resetScanner = () => {
    setImage(null);
    setFoodName('');
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <span className="text-4xl animate-bounce inline-block mb-4">📸</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-400 font-sans tracking-tight">
            Food Scanner & Nutrition Finder
          </h1>
          <p className="text-gray-400 mt-2 text-lg animate-pulse">
            Scan or search to track your nutrition! 🍎
          </p>
        </div>

        {error && (
          <p className="text-red-400 bg-red-900/30 p-4 rounded-lg text-center">{error}</p>
        )}
        {toast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg animate-fade-in-down">
            {toast}
          </div>
        )}

        {/* Search Section */}
        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold text-green-400 mb-6 flex items-center gap-2">
            <span className="text-2xl">🔍</span> Search Food
          </h2>
          <div className="relative flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="e.g. Apple, Banana, Rice..."
              value={searchTerm}
              onChange={handleSearchInput}
              className="flex-1 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSearch}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
            >
              <span className="text-xl">🔍</span> Search
            </button>
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-2 bg-gray-700 rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
                {suggestions.map((item) => (
                  <li
                    key={item.name}
                    onClick={() => selectSuggestion(item.name)}
                    className="p-3 hover:bg-gray-600 cursor-pointer capitalize"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {result && (
            <div className="mt-6 p-6 bg-gray-700/50 rounded-lg">
              <p className="font-semibold capitalize text-green-400 text-lg">{result.name}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4b5563"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="2"
                      strokeDasharray={`${(result.calories / 2000) * 100}, 100`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm text-green-400">
                    {result.calories}
                  </span>
                </div>
                <div>
                  <p>Calories: <span className="text-green-400">{result.calories} kcal</span></p>
                  <p>Protein: {result.protein} g</p>
                  <p>Carbs: {result.carbs} g</p>
                  <p>Fat: {result.fat} g</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scanner Section */}
        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold text-green-400 mb-6 flex items-center gap-2">
            <span className="text-2xl">📸</span> Scan Food
          </h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-400 file:p-3 file:bg-green-500 file:hover:bg-green-600 file:text-white file:rounded-lg file:border-0 file:cursor-pointer file:transition-all file:duration-300"
          />
          {image && (
            <div className="mt-6 space-y-6">
              <div className="relative w-80 h-80 mx-auto group">
                <img
                  src={image}
                  alt="Food Preview"
                  className="w-full h-full object-cover rounded-lg shadow-md transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gray-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 text-lg">Zoom</span>
                </div>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Detected food (edit if needed)"
                />
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
                <div className="flex gap-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300"
                  >
                    {loading ? 'Analyzing...' : 'Analyze & Log'}
                  </button>
                  <button
                    onClick={resetScanner}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-lg transition-all duration-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
          {result && (
            <div className="mt-6 p-6 bg-gray-700/50 rounded-lg">
              <p className="font-semibold capitalize text-green-400 text-lg">{result.name}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4b5563"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="2"
                      strokeDasharray={`${(result.calories / 2000) * 100}, 100`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm text-green-400">
                    {result.calories}
                  </span>
                </div>
                <div>
                  <p>Calories: <span className="text-green-400">{result.calories} kcal</span></p>
                  <p>Protein: {result.protein} g</p>
                  <p>Carbs: {result.carbs} g</p>
                  <p>Fat: {result.fat} g</p>
                  <p className="text-sm text-gray-400 mt-2">Logged as {mealType}!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;