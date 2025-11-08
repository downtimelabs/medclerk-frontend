import React, { useState, useEffect } from 'react';
import { FaUserMd, FaRocket, FaHeart, FaShieldAlt, FaBrain, FaUsers, FaAward, FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

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
            className="transition-all duration-300 px-3 py-2 text-dark-700 hover:text-primary-600 font-medium"
            onClick={() => navigate('/services')}
          >
            Services
          </button>
          <button 
            className="transition-all duration-300 px-3 py-2 text-primary-600 font-semibold"
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
        className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white py-20 px-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[url('/Infographic medical with photo _ Premium Vector[1].jpg')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90"></div>
        
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
            <FaBrain className="text-7xl mx-auto mb-6 animate-pulse" />
          </motion.div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            About MedClerk
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing healthcare data management with AI-powered intelligence
          </p>
        </motion.div>
      </motion.section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <FaRocket className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-dark-900 mb-4">Our Mission</h2>
              <p className="text-dark-600 text-lg leading-relaxed">
                To empower patients and healthcare providers with intelligent, AI-driven tools that transform complex medical data into actionable insights. We believe everyone deserves clear, organized access to their health information.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <FaLightbulb className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-dark-900 mb-4">Our Vision</h2>
              <p className="text-dark-600 text-lg leading-relaxed">
                A future where medical information is seamlessly integrated, instantly accessible, and intelligently analyzed. We envision a world where AI helps bridge the gap between medical complexity and patient understanding.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl p-10 shadow-xl border border-blue-100">
            <h2 className="text-4xl font-bold text-dark-900 mb-6 text-center">Our Story</h2>
            <div className="space-y-6 text-dark-600 text-lg leading-relaxed">
              <p>
                MedClerk was born from a simple observation: healthcare generates massive amounts of data, yet patients struggle to understand and organize their own medical records. Lab reports, imaging studies, doctor's notes — all valuable information trapped in complex formats.
              </p>
              <p>
                Our founding team of AI engineers and healthcare professionals came together with a shared vision: leverage cutting-edge technology to make medical information accessible, understandable, and actionable for everyone.
              </p>
              <p>
                Today, MedClerk combines advanced OCR, natural language processing, and retrieval-augmented generation to transform how people interact with their health data. We're proud to serve thousands of users across 12 languages, helping them take control of their healthcare journey.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center text-dark-900 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Core Values
          </motion.h2>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 text-center hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -8 }}
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">Privacy First</h3>
              <p className="text-dark-600">Your health data is sacred. We employ HIPAA-style security measures to protect your information.</p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 text-center hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -8 }}
            >
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserMd className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">Patient-Centric</h3>
              <p className="text-dark-600">Every feature is designed with the patient in mind, making healthcare accessible and understandable.</p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 text-center hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -8 }}
            >
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaAward className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">Excellence</h3>
              <p className="text-dark-600">We strive for the highest accuracy in OCR, NLP, and data analysis to deliver reliable insights.</p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 text-center hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -8 }}
            >
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-3xl text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">Empathy</h3>
              <p className="text-dark-600">We understand healthcare can be overwhelming. Our platform is built with compassion and care.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-white to-blue-50">
        <motion.div 
          className="max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <FaUsers className="text-6xl text-blue-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-dark-900 mb-6">Meet Our Team</h2>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Our diverse team brings together expertise in artificial intelligence, healthcare technology, user experience design, and medical informatics. We're united by a passion for improving healthcare through innovation.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-lg"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                AI
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">AI Engineers</h3>
              <p className="text-dark-600">Building cutting-edge models for OCR, NLP, and medical data analysis</p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-6 shadow-lg"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                MD
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Medical Advisors</h3>
              <p className="text-dark-600">Ensuring clinical accuracy and healthcare compliance</p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-6 shadow-lg"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                UX
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">UX Designers</h3>
              <p className="text-dark-600">Creating intuitive experiences for seamless health data management</p>
            </motion.div>
          </div>
        </motion.div>
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
          <h2 className="text-4xl font-bold mb-6">Join Us on This Journey</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Whether you're a patient looking to organize your health records or a healthcare provider seeking better data solutions, we're here to help.
          </p>
          <motion.button 
            className="bg-white text-blue-600 hover:bg-blue-50 transition-all px-8 py-4 rounded-lg shadow-lg text-lg font-semibold"
            onClick={() => navigate('/start')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-dark-900 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-dark-400">© {new Date().getFullYear()} MedClerk. All rights reserved.</p>
          <p className="text-dark-500 text-sm mt-2">Transforming healthcare data with AI</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
