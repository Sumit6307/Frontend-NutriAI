import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Enhanced mock replies
  const mockReplies = {
    protein: 'Protein is essential for muscle repair and growth. Aim for 0.8-1.2g per kg of body weight daily. Try eggs, chicken, tofu, or lentils for variety!',
    calories: 'Calories fuel your body. To maintain weight, match intake to expenditure. For weight loss, aim for a 500-750 kcal deficit daily.',
    fat: 'Healthy fats boost brain function and hormones. Include avocados, nuts, and olive oil, but limit saturated fats to 10% of calories.',
    carbs: 'Carbs provide energy for daily tasks. Choose complex carbs like oats, quinoa, or sweet potatoes for sustained release.',
    diet: 'A balanced diet includes proteins, carbs, fats, and micronutrients. Tailor it to your goals—weight loss, muscle gain, or wellness.',
    hydration: 'Stay hydrated with 2-3 liters of water daily, more if active. Electrolytes from foods like bananas can help too!',
    vitamins: 'Vitamins support immunity and energy. Get Vitamin C from oranges, D from sunlight or fish, and B12 from eggs or supplements.',
    macros: 'Macros—protein, carbs, fats—drive nutrition. A balanced split might be 30% protein, 40% carbs, 30% fats, adjusted for your needs.',
    meal: 'Meal plans depend on goals. For weight loss, prioritize veggies and lean protein. For gain, add calorie-dense foods like rice and nuts.',
    weight: 'Weight management balances calories and activity. Track intake with NutriAI’s tools and aim for gradual changes—1-2 lbs per week.',
  };

  // Suggested questions
  const suggestions = [
    'How much protein do I need?',
    'What are healthy fats?',
    'Tell me about calories',
    'Best carbs for energy?',
    'Hydration tips?',
    'Vitamin sources?',
  ];

  // Load chat history
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save chat history
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Voice input setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setInput(transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const keyword = Object.keys(mockReplies).find((key) =>
      input.toLowerCase().includes(key)
    );

    const botReply = {
      sender: 'bot',
      text: keyword
        ? mockReplies[keyword]
        : `Hi${user ? ` ${user.name}` : ''}, I'm still learning! Try asking about protein, calories, or meal plans.`,
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 1000);

    setInput('');
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  const handleSuggestionClick = (text) => {
    setInput(text);
    inputRef.current.focus();
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white font-sans relative overflow-hidden">
      {/* Gradient Wave Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-50 animate-fade-in-slow pointer-events-none"></div>
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-1 h-1 bg-nutri-green rounded-full opacity-30 animate-pulse top-20 left-1/4"></div>
        <div className="absolute w-1 h-1 bg-nutri-green rounded-full opacity-30 animate-pulse top-40 right-1/3 delay-200"></div>
        <div className="absolute w-1 h-1 bg-nutri-green rounded-full opacity-30 animate-pulse bottom-20 left-1/2 delay-400"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-gray-800/50 backdrop-blur-lg p-4 rounded-xl shadow-xl">
          <div className="flex items-center gap-3">
            <svg className="w-10 h-10 text-nutri-green animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h2 className="text-4xl md:text-5xl font-bold text-white">NutriChat AI</h2>
          </div>
          {user && (
            <Link
              to="/profile"
              className="bg-nutri-green hover:bg-nutri-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Profile
            </Link>
          )}
        </div>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 shadow-2xl"
          role="log"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <div className="text-center mt-20 animate-fade-in">
              <svg className="w-16 h-16 mx-auto text-nutri-green animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-200 text-lg mt-4">
                {user ? `Hi ${user.name}, ` : ''}Ask me about nutrition! Try protein, calories, or meal plans.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {suggestions.slice(0, 3).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm transition-all duration-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                role="listitem"
              >
                <div
                  className={`flex items-start gap-3 max-w-[70%] p-4 rounded-lg shadow-md ${
                    msg.sender === 'user' ? 'bg-nutri-green text-white' : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <svg className="w-6 h-6 text-nutri-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )}
                  <div>
                    <p>{msg.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {msg.sender === 'user' && (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-700 p-4 rounded-lg flex items-center gap-2">
                <svg className="w-6 h-6 text-nutri-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about nutrition, calories, or diet..."
                className="w-full p-4 pr-12 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nutri-green transition-all duration-300"
                aria-label="Chat input"
              />
              {input && (
                <button
                  onClick={() => setInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Clear input"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={handleVoiceInput}
              className={`p-4 rounded-lg transition-all duration-300 ${
                isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button
              onClick={handleSend}
              className="bg-nutri-green hover:bg-nutri-accent text-white p-4 rounded-lg flex items-center gap-2 transition-all duration-300"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm transition-all duration-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <button
            onClick={handleClearChat}
            className="text-gray-400 hover:text-white text-sm underline mt-2"
            aria-label="Clear chat history"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;