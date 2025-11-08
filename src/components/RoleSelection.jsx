import React, { useState } from 'react';
import { FaUserInjured, FaUserMd, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const RoleSelection = ({ onSelect, isSignInFlow = false }) => {
  const [hoveredRole, setHoveredRole] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState('patient');

  const backgroundImages = {
    patient: '/patient.png',
    doctor: '/doctorprofile.jpg'
  };

  const handleRoleHover = (role) => {
    setHoveredRole(role);
    setSelectedBackground(role);
  };

  const handleRoleLeave = () => {
    setHoveredRole(null);
  };

  return (
    <div className="min-h-screen flex flex-col text-dark-700 relative overflow-hidden">
      {/* Background Images with Smooth Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedBackground}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.69 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImages[selectedBackground]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </AnimatePresence>

      {/* Soft White Overlay with Blur */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-white/25 via-blue-50/15 to-indigo-50/20 backdrop-blur-[2px]" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top bar - Matching Landing Page */}
        <motion.header 
          className="flex items-center px-4 py-1 sticky top-0 z-40 bg-white shadow-md transition-all duration-300 ease-in-out"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <motion.div 
            className="flex items-center group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => window.history.back()}
            style={{ cursor: 'pointer' }}
          >
            <div className="py-0 ml-4">
              <img 
                src="/new_logo.png" 
                alt="MedClerk Logo" 
                className="h-12 md:h-14 object-contain transition-all duration-300 hover:opacity-90"
              />
            </div>
          </motion.div>
          
          {/* Right Side Navigation */}
          <motion.div 
            className="flex gap-3 items-center ml-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button 
              className="transition-all duration-300 px-4 py-2 rounded-lg bg-white text-dark-700 border border-dark-200 hover:bg-gray-50"
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </motion.div>
        </motion.header>

        <div className="flex-1 flex items-center justify-center p-5">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-dark-950 mb-2">
              {isSignInFlow ? 'Welcome back! Select your role' : 'How will you use the app?'}
            </h1>
            <p className="text-dark-500">
              {isSignInFlow 
                ? 'Choose your role to continue to sign in.' 
                : 'Choose your role to personalize your experience.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.button
              className="card p-6 text-left hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              onClick={() => onSelect('patient')}
              onMouseEnter={() => handleRoleHover('patient')}
              onMouseLeave={handleRoleLeave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {hoveredRole === 'patient' && (
                <motion.div
                  layoutId="activeRole"
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 grid place-items-center rounded-full bg-primary-50 text-primary-600">
                  <FaUserInjured />
                </span>
                <div className="text-lg font-semibold text-dark-900">I am a Patient</div>
              </div>
              <p className="text-sm text-dark-500">Organize medical reports, track values, and ask questions.</p>
              <div className="mt-4 inline-flex items-center gap-2 text-primary-600 font-medium relative z-10">
                Continue <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>

            <motion.button
              className="card p-6 text-left hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              onClick={() => onSelect('doctor')}
              onMouseEnter={() => handleRoleHover('doctor')}
              onMouseLeave={handleRoleLeave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {hoveredRole === 'doctor' && (
                <motion.div
                  layoutId="activeRole"
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 grid place-items-center rounded-full bg-primary-50 text-primary-600">
                  <FaUserMd />
                </span>
                <div className="text-lg font-semibold text-dark-900">I am a Doctor</div>
              </div>
              <p className="text-sm text-dark-500">Manage patient reports and insights with privacy controls.</p>
              <div className="mt-4 inline-flex items-center gap-2 text-primary-600 font-medium relative z-10">
                Continue <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;


