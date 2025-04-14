/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Loader2, Menu, X, Mic, MicOff } from 'lucide-react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const API_KEY = 'AIzaSyAhPAufrAIYi7ZUU4UBx-L3KcGomx6IxtE';
  let genAI = null;
  if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  const initialPrompt = `Hey there, ${user ? user.name : 'friend'}! 👋 I’m NutriAI’s Nutrition Assistant. Ask about fruits, veggies, calories, or healthy recipes, and I’ll dish out the details! 🍎🥗 Try "How many calories in an apple?" or ask for a meal idea!`;

  const SYSTEM_PROMPT = `You are NutriAI Assistant, a smart and supportive nutrition expert designed to help users understand the nutritional value of fruits, vegetables, and healthy foods.

Your mission is to **inform, inspire, and guide** users toward a healthier lifestyle with accurate, engaging answers.

👉 Your job is to have **engaging, helpful, and human-like** conversations:
1. **Context-based responses**: Tailor answers to the user’s query (e.g., calories, recipes, health benefits).
2. **Personalized touch**: Use the user’s name if available (e.g., "Hi Jane, here’s what I found!").
3. **Follow-up questions**: Ask things like:
   - "Want to add this to your calorie log?"
   - "Need a recipe with this ingredient?"
   - "Curious about another food?"
4. Use **emojis**, **markdown**, and a friendly tone to keep it warm and interactive.
5. **Celebrate choices**: Encourage healthy habits with positive vibes.

🧠 For nutrition queries, use this structure when relevant:

## 🥗 Nutrition Snapshot: [Food Name]

**🔍 Overview:**  
A quick summary of the food.

**🔥 Calories:** [X kcal] (per 100g)  
**💪 Key Nutrients:**  
- [Nutrient 1]  
- [Nutrient 2]  
- [Nutrient 3]  

**🌟 Health Benefits:**  
- [Benefit 1]  
- [Benefit 2]  
- [Benefit 3]  

**🍽️ Tips:**  
- [Tip 1]  
- [Tip 2]  
- [Tip 3]  

---

💬 Tone: **Friendly food coach**—encouraging, never judging. Keep it light, educational, and actionable. Stay focused on nutrition, food facts, and healthy habits. 🍏🥕✨`;

  const suggestions = [
    'How many calories in an apple?',
    'Suggest a low-carb meal',
    'What are the benefits of spinach?',
    'How much protein in chicken?',
    'Healthy snack ideas?',
    'What’s a good smoothie recipe?',
  ];

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

  // Initial message and error handling
  useEffect(() => {
    if (messages.length === 0 && !error && API_KEY) {
      setMessages([{ text: initialPrompt, sender: 'ai' }]);
    } else if (messages.length === 0 && error) {
      setMessages([{ text: `Error: ${error}`, sender: 'ai' }]);
    }
  }, [error, API_KEY]);

  // Scroll only on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // Depends on messages, not input

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !genAI) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig,
        safetySettings,
        systemInstruction: SYSTEM_PROMPT,
      });

      const result = await model.generateContent(input);
      const response = result.response;
      const responseText = response.text();

      if (responseText) {
        setMessages((prev) => [...prev, { text: responseText, sender: 'ai' }]);
      } else {
        throw new Error('No response text from AI.');
      }
    } catch (err) {
      console.error('Gemini API error:', err);
      setError(err.message || 'Failed to get a response from the AI.');
      setMessages((prev) => [
        ...prev,
        { text: 'Oops, something went wrong. Try again?', sender: 'ai' },
      ]);
    } finally {
      setIsLoading(false);
    }
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (text) => {
    setInput(text);
    inputRef.current.focus();
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-64 h-full bg-gray-800/90 backdrop-blur-lg p-6 z-50 shadow-2xl md:static md:w-1/4"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-nutri-green">Suggestions</h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-600/70 rounded-lg text-sm text-gray-200 transition-all duration-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="mt-12 flex flex-col flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 bg-gray-800/50 backdrop-blur-lg p-4 rounded-xl shadow-xl">
          <div className="flex items-center gap-3">
            <Bot size={32} className="text-nutri-green animate-pulse" />
            <h2 className="text-3xl font-bold text-white">NutriChat AI</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white md:hidden"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-inner">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-[75%] p-4 rounded-xl backdrop-blur-md shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-nutri-green/90 text-white'
                      : 'bg-gray-800/70 text-gray-100 border-l-4 border-nutri-green'
                  }`}
                >
                  {msg.sender === 'ai' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          />
                        ),
                        code: ({ node, inline, className, children, ...props }) => (
                          inline ? (
                            <code className="bg-gray-700 text-red-300 px-1 py-0.5 rounded" {...props}>
                              {children}
                            </code>
                          ) : (
                            <pre className="bg-gray-800 p-3 my-2 rounded-md overflow-x-auto">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          )
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-xl font-bold text-nutri-green mt-4 mb-2" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc pl-5 my-2" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="my-1" {...props} />
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-gray-800/70 p-4 rounded-xl backdrop-blur-md border-l-4 border-nutri-green flex items-center gap-2">
                  <Loader2 size={20} className="animate-spin text-nutri-green" />
                  <p className="text-gray-400">Thinking...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <motion.div
          className="mt-4 flex items-center gap-3 bg-gray-800/50 backdrop-blur-lg p-4 rounded-xl shadow-xl"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? 'Thinking...' : 'Ask about nutrition, calories, or recipes...'}
            className="flex-1 p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-nutri-green disabled:opacity-50 backdrop-blur-md"
            disabled={isLoading || !genAI}
          />
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-lg transition ${
              isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            {isListening ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
          </button>
          <button
            onClick={handleSendMessage}
            className={`p-3 rounded-lg flex items-center justify-center transition ${
              isLoading || !input.trim() || !genAI
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-nutri-green hover:bg-nutri-green/80'
            }`}
            disabled={isLoading || !input.trim() || !genAI}
          >
            <Send size={20} className="text-white" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Chatbot;