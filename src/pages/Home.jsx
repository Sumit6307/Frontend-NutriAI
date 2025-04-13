import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  const [typedText, setTypedText] = useState('');
  const [counts, setCounts] = useState({ users: 0, foods: 0, calories: 0, accuracy: 0 });
  const [formData, setFormData] = useState({ email: '', name: '' });
  const [formStep, setFormStep] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // Typing effect for hero headline
  useEffect(() => {
    const headline = user ? `Welcome, ${user.name}!` : 'Transform Your Health with NutriAI';
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(headline.slice(0, index));
      index++;
      if (index > headline.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [user]);

  // Animated counters
  useEffect(() => {
    const animateCounter = (key, target, duration) => {
      let start = 0;
      const step = target / (duration / 16);
      const interval = setInterval(() => {
        start += step;
        if (start >= target) {
          start = target;
          clearInterval(interval);
        }
        setCounts((prev) => ({ ...prev, [key]: Math.floor(start) }));
      }, 16);
    };
    animateCounter('users', 10000, 2000);
    animateCounter('foods', 50000, 2500);
    animateCounter('calories', 2000000, 3000);
    animateCounter('accuracy', 98, 2000);
  }, []);

  const features = [
    {
      to: '/profile',
      icon: (
        <svg className="w-12 h-12 text-green-500 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Precision Calorie Tracking',
      desc: 'Leverage advanced analytics to monitor and optimize your daily nutritional intake with unparalleled accuracy.',
      progress: user ? 80 : null,
    },
    {
      to: '/scanner',
      icon: (
        <svg className="w-12 h-12 text-green-500 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Intelligent Food Scanner',
      desc: 'Utilize cutting-edge image recognition to log nutritional data instantly and effortlessly.',
      progress: user ? 65 : null,
    },
    {
      to: '/chatbot',
      icon: (
        <svg className="w-12 h-12 text-green-500 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'AI-Powered Nutritionist',
      desc: 'Access personalized dietary recommendations tailored to your unique health goals, available 24/7.',
      progress: user ? 90 : null,
    },
    {
      to: '/profile',
      icon: (
        <svg className="w-12 h-12 text-green-500 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: 'Advanced Profile Management',
      desc: 'Set precise goals, track progress with detailed metrics, and customize your health journey.',
      progress: user ? 85 : null,
    },
  ];

  const caseStudies = [
    {
      title: 'Optimized Weight Management',
      desc: 'Sarah leveraged NutriAI’s tracking tools to reduce her daily calorie intake, achieving significant results.',
      metric: '7kg Lost in 4 Months',
      image: 'https://via.placeholder.com/300x200?text=Weight+Loss',
    },
    {
      title: 'Streamlined Nutrition Logging',
      desc: 'James utilized the food scanner to log over 100 unique foods, enhancing his dietary efficiency.',
      metric: '100+ Foods Logged Monthly',
      image: 'https://via.placeholder.com/300x200?text=Food+Scanner',
    },
  ];

  const partners = [
    { name: 'HealthCorp', logo: 'https://via.placeholder.com/150x50?text=HealthCorp' },
    { name: 'FitLabs', logo: 'https://via.placeholder.com/150x50?text=FitLabs' },
    { name: 'NutriTech', logo: 'https://via.placeholder.com/150x50?text=NutriTech' },
    { name: 'WellnessPro', logo: 'https://via.placeholder.com/150x50?text=WellnessPro' },
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formStep === 1 && formData.email) {
      setFormStep(2);
    } else if (formStep === 2 && formData.name) {
      console.log('Demo Request:', formData);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        setFormData({ email: '', name: '' });
        setFormStep(1);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-28 text-center relative z-10">
        {/* Gradient Wave Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-60 animate-fade-in-slow pointer-events-none"></div>
        {/* Particle Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-1 h-1 bg-green-500 rounded-full opacity-30 animate-pulse top-20 left-1/4"></div>
          <div className="absolute w-1 h-1 bg-green-500 rounded-full opacity-30 animate-pulse top-40 right-1/3 delay-200"></div>
          <div className="absolute w-1 h-1 bg-green-500 rounded-full opacity-30 animate-pulse bottom-20 left-1/2 delay-400"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-center mb-6 animate-fade-in">
            <svg className="w-10 h-10 text-green-500 mr-3 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              {typedText}
              <span className="animate-pulse">|</span>
            </h1>
          </div>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-12 animate-fade-in animation-delay-200">
            {user
              ? 'Take control of your wellness with personalized tools designed for your goals.'
              : 'NutriAI empowers you with precision nutrition tracking and AI-driven insights for optimal health.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 animate-fade-in animation-delay-400">
            <Link
              to={user ? '/profile' : '/register'}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {user ? 'Access Dashboard' : 'Start Free Trial'}
            </Link>
            <ScrollLink
              to="features"
              smooth={true}
              duration={500}
              className="bg-transparent border-2 border-green-500 hover:bg-green-500/10 text-green-500 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Explore Features
            </ScrollLink>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Request Demo
            </button>
            {!user && (
              <Link
                to="/login"
                className="text-green-500 hover:text-green-400 underline text-lg font-semibold transition-all duration-300 flex items-center gap-2 animate-fade-in animation-delay-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-800/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16 animate-fade-in">
            Industry-Leading Nutrition Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <Link
                key={feature.title}
                to={feature.to}
                className="group bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${idx * 200}ms` }}
              >
                <div className="mb-6 flex justify-center">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-base">{feature.desc}</p>
                {feature.progress && (
                  <div className="mt-6">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <span className="text-xs font-semibold text-gray-400">Progress</span>
                        <span className="text-xs font-semibold text-green-500">{feature.progress}%</span>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                        <div
                          style={{ width: `${feature.progress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 text-center bg-gray-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-16 animate-fade-in">
            Data-Driven Results
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="animate-fade-in animation-delay-200">
              <p className="text-5xl font-bold text-green-500">{counts.users.toLocaleString()}</p>
              <p className="text-lg text-gray-300 mt-2">Active Users</p>
            </div>
            <div className="animate-fade-in animation-delay-400">
              <p className="text-5xl font-bold text-green-500">{counts.foods.toLocaleString()}</p>
              <p className="text-lg text-gray-300 mt-2">Foods Logged</p>
            </div>
            <div className="animate-fade-in animation-delay-600">
              <p className="text-5xl font-bold text-green-500">{counts.calories.toLocaleString()}</p>
              <p className="text-lg text-gray-300 mt-2">Calories Tracked</p>
            </div>
            <div className="animate-fade-in animation-delay-800">
              <p className="text-5xl font-bold text-green-500">{counts.accuracy}%</p>
              <p className="text-lg text-gray-300 mt-2">Scanner Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 bg-gray-800/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16 animate-fade-in">
            Real-World Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study, idx) => (
              <div
                key={study.title}
                className="group bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl animate-fade-in"
                style={{ animationDelay: `${idx * 200}ms` }}
              >
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{study.title}</h3>
                  <p className="text-gray-300 mb-4">{study.desc}</p>
                  <p className="text-green-500 font-semibold">{study.metric}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 text-center bg-gray-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-16 animate-fade-in">
            Trusted by Industry Leaders
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {partners.map((partner, idx) => (
              <img
                key={partner.name}
                src={partner.logo}
                alt={partner.name}
                className="h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-fade-in"
                style={{ animationDelay: `${idx * 200}ms` }}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-500 to-green-600 text-white text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8 animate-fade-in">
            Experience NutriAI Today
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-10 animate-fade-in animation-delay-200">
            Join thousands of users optimizing their health with NutriAI’s advanced nutrition platform.
          </p>
          <form onSubmit={handleFormSubmit} className="max-w-lg mx-auto space-y-4 animate-fade-in animation-delay-400">
            {formStep === 1 ? (
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            ) : (
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            )}
            <button
              type="submit"
              className="w-full bg-white text-green-500 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {formStep === 1 ? 'Continue' : 'Submit Request'}
            </button>
          </form>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-semibold text-white mb-4">Demo Request Submitted</h3>
            <p className="text-gray-300">Thank you for your interest! Our team will contact you soon.</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;