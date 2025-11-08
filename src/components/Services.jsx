import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaBrain, FaComments, FaLanguage, FaChartLine, FaShieldAlt, FaRobot, FaSearch, FaMobileAlt, FaCloud, FaLock, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Services = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lightweight SVG backgrounds encoded as data URIs for each use-case card
  const bgSvgs = {
    patients:
      "url('data:image/svg+xml;utf8,"
      + encodeURIComponent(
        `<svg width="360" height="240" viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" fill="none">
          <g opacity="0.25">
            <circle cx="300" cy="40" r="32" stroke="white" stroke-width="3"/>
            <path d="M300 8a32 32 0 0 1 0 64a48 48 0 0 1 0-64Z" stroke="white" stroke-width="2" opacity="0.4"/>
            <circle cx="270" cy="100" r="18" stroke="white" stroke-width="2"/>
            <circle cx="330" cy="120" r="26" stroke="white" stroke-width="2"/>
            <path d="M260 180c22-36 54-36 76 0" stroke="white" stroke-width="3" stroke-linecap="round"/>
            <circle cx="298" cy="170" r="8" fill="white" opacity="0.35"/>
          </g>
        </svg>`
      ) + "')",
    providers:
      "url('data:image/svg+xml;utf8,"
      + encodeURIComponent(
        `<svg width="360" height="240" viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" fill="none">
          <g opacity="0.22" stroke="white" stroke-width="3" stroke-linecap="round">
            <rect x="270" y="20" width="60" height="80" rx="8"/>
            <line x1="280" y1="40" x2="320" y2="40"/>
            <line x1="280" y1="56" x2="320" y2="56" opacity="0.7"/>
            <line x1="280" y1="72" x2="320" y2="72" opacity="0.45"/>
            <rect x="235" y="120" width="110" height="70" rx="10" opacity="0.7"/>
            <path d="M245 155h18l10-18l12 30l9-12h38"/>
          </g>
        </svg>`
      ) + "')",
    researchers:
      "url('data:image/svg+xml;utf8,"
      + encodeURIComponent(
        `<svg width="360" height="240" viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" fill="none">
          <g opacity="0.22" stroke="white" stroke-width="3" stroke-linecap="round">
            <polyline points="240,190 260,150 285,165 310,120 330,140" fill="none"/>
            <rect x="238" y="192" width="6" height="18" rx="2"/>
            <rect x="254" y="180" width="6" height="30" rx="2"/>
            <rect x="270" y="170" width="6" height="40" rx="2"/>
            <rect x="286" y="158" width="6" height="52" rx="2"/>
            <rect x="302" y="145" width="6" height="65" rx="2"/>
          </g>
        </svg>`
      ) + "')",
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const services = [
    {
      icon: <FaFileAlt className="text-4xl" />,
      title: "Smart OCR Processing",
      description: "Advanced optical character recognition extracts text from scanned medical reports, lab results, and prescriptions with 99%+ accuracy.",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: <FaBrain className="text-4xl" />,
      title: "AI-Powered Analysis",
      description: "Our NLP algorithms understand medical terminology, extract key findings, and generate human-readable summaries of complex reports.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: <FaComments className="text-4xl" />,
      title: "Interactive Chat",
      description: "Ask questions about your medical records in natural language. Our RAG system provides context-aware answers based on your data.",
      color: "from-green-500 to-teal-600",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: <FaLanguage className="text-4xl" />,
      title: "Multi-Language Support",
      description: "Access your health information in 12+ languages. Break down language barriers in healthcare communication.",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Trend Analysis",
      description: "Track changes in your health metrics over time. Visualize lab results, vital signs, and treatment outcomes.",
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      icon: <FaSearch className="text-4xl" />,
      title: "Smart Search",
      description: "Find specific information across all your medical documents instantly. Search by date, condition, medication, or doctor.",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-100",
      iconColor: "text-cyan-600"
    }
  ];

  const features = [
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "HIPAA-Style Security",
      description: "Military-grade encryption and compliance with healthcare privacy standards"
    },
    {
      icon: <FaCloud className="text-3xl" />,
      title: "Cloud Storage",
      description: "Secure cloud backup ensures your data is always accessible and protected"
    },
    {
      icon: <FaMobileAlt className="text-3xl" />,
      title: "Mobile Ready",
      description: "Access your health records anywhere, anytime from any device"
    },
    {
      icon: <FaLock className="text-3xl" />,
      title: "Data Control",
      description: "You own your data. Export or delete it anytime with one click"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40">
      {/* Navigation Bar */}
      <motion.header 
        className={`flex items-center px-6 py-4 sticky top-0 z-40 transition-all duration-300 ease-in-out ${
          isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm shadow-sm'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img src="/logo1.jpg" alt="MedClerk Logo" className="h-12 object-contain" />
        </motion.div>
        
        <motion.div 
          className="flex gap-4 items-center ml-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button 
            className="transition-all duration-300 px-3 py-2 text-dark-700 hover:text-primary-600 font-medium"
            onClick={() => navigate('/')}
          >
            Home
          </button>
          <button 
            className="transition-all duration-300 px-3 py-2 text-primary-600 font-semibold"
          >
            Services
          </button>
          <button 
            className="transition-all duration-300 px-3 py-2 text-dark-700 hover:text-primary-600 font-medium"
            onClick={() => navigate('/about')}
          >
            About Us
          </button>
          <button 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all px-5 py-2 rounded-lg shadow-md"
            onClick={() => navigate('/start')}
          >
            Get Started
          </button>
        </motion.div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white py-20 px-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[url('/Infographic medical with photo _ Premium Vector[1].jpg')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-cyan-600/90"></div>
        
        <motion.div 
          className="relative max-w-5xl mx-auto text-center z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <FaRobot className="text-7xl mx-auto mb-6 animate-pulse" />
          </motion.div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            AI-Powered Healthcare Solutions
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Transform complex medical data into actionable insights with our intelligent platform
          </p>
        </motion.div>
      </motion.section>

      {/* Main Services */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-dark-900 mb-4">Our Core Services</h2>
            <p className="text-xl text-dark-600 max-w-3xl mx-auto">
              Comprehensive AI-driven tools designed to simplify medical record management
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -8 }}
              >
                <div className={`w-16 h-16 ${service.bgColor} rounded-xl flex items-center justify-center mb-6 ${service.iconColor}`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-dark-900 mb-4">{service.title}</h3>
                <p className="text-dark-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center text-dark-900 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>

          <motion.div 
            className="grid md:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div 
              className="text-center"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">Upload Documents</h3>
              <p className="text-dark-600">Upload scanned medical reports, lab results, or prescriptions in any format</p>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">AI Processing</h3>
              <p className="text-dark-600">Our OCR and NLP models extract, analyze, and organize your medical data</p>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">Get Insights</h3>
              <p className="text-dark-600">View summaries, trends, and answers to your health questions instantly</p>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
                4
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">Stay Organized</h3>
              <p className="text-dark-600">All your health records in one secure, searchable, and shareable place</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center text-dark-900 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Additional Features
          </motion.h2>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 text-center hover:shadow-xl transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-3">{feature.title}</h3>
                <p className="text-dark-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-6 bg-gradient-to-br from-white to-blue-50">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-10 shadow-2xl text-white">
            <h2 className="text-4xl font-bold mb-6 text-center">Powered by Advanced AI</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-6xl font-bold mb-2">OCR</div>
                <p className="text-blue-100">Optical Character Recognition extracts text from images with precision</p>
              </div>
              <div>
                <div className="text-6xl font-bold mb-2">NLP</div>
                <p className="text-blue-100">Natural Language Processing understands medical terminology</p>
              </div>
              <div>
                <div className="text-6xl font-bold mb-2">RAG</div>
                <p className="text-blue-100">Retrieval-Augmented Generation provides intelligent answers</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center text-dark-900 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Perfect For
          </motion.h2>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div 
              className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl"
              variants={fadeInUp}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: bgSvgs.patients,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right -30px top -30px',
                  backgroundSize: '260px',
                }}
              />
              <FaGlobe className="text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">Patients</h3>
              <p className="text-blue-100 leading-relaxed">
                Organize all your medical records in one place. Understand your health data. Share with doctors easily.
              </p>
            </motion.div>

            <motion.div 
              className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 text-white shadow-xl"
              variants={fadeInUp}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: bgSvgs.providers,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right -30px top -20px',
                  backgroundSize: '280px',
                }}
              />
              <FaFileAlt className="text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">Healthcare Providers</h3>
              <p className="text-purple-100 leading-relaxed">
                Access comprehensive patient histories instantly. Make informed decisions with complete data visibility.
              </p>
            </motion.div>

            <motion.div 
              className="relative overflow-hidden bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl"
              variants={fadeInUp}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: bgSvgs.researchers,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right -30px top -20px',
                  backgroundSize: '280px',
                }}
              />
              <FaChartLine className="text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">Researchers</h3>
              <p className="text-green-100 leading-relaxed">
                Analyze trends across large datasets. Extract insights from medical literature and patient records.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Healthcare Data?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of users who trust MedClerk to organize and understand their medical records.
          </p>
          <motion.button 
            className="bg-white text-blue-600 hover:bg-blue-50 transition-all px-8 py-4 rounded-lg shadow-lg text-lg font-semibold"
            onClick={() => navigate('/start')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Free Trial
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-dark-900 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-dark-400">© {new Date().getFullYear()} MedClerk. All rights reserved.</p>
          <p className="text-dark-500 text-sm mt-2">AI-Powered Medical Record Organization</p>
        </div>
      </footer>
    </div>
  );
};

export default Services;
