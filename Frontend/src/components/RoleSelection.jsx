import React from 'react';
import { FaUserInjured, FaUserMd, FaArrowRight } from 'react-icons/fa';

const RoleSelection = ({ selectedLanguage, onLanguageSelect, onSelect, isSignInFlow = false }) => {
  return (
    <div className="min-h-screen bg-gradient-main flex flex-col text-dark-700">
      {/* Top bar */}
      <div className="flex justify-between items-center p-5 bg-white/90 backdrop-blur-md border-b border-dark-200 shadow-sm">
        <div className="flex items-center">
          <img src="/logo1.jpg" alt="MedClerk Logo" className="h-16 w-22 object-contain" />
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <select
              className="appearance-none bg-white text-dark-700 border border-dark-200 rounded-lg px-3 py-2 pr-7 text-sm cursor-pointer focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500 focus:ring-opacity-15"
              value={selectedLanguage || 'en'}
              onChange={(e) => onLanguageSelect?.(e.target.value)}
            >
              <option value="en" className="bg-white text-dark-700">English</option>
              <option value="es" className="bg-white text-dark-700">Español</option>
              <option value="fr" className="bg-white text-dark-700">Français</option>
              <option value="de" className="bg-white text-dark-700">Deutsch</option>
              <option value="it" className="bg-white text-dark-700">Italiano</option>
              <option value="pt" className="bg-white text-dark-700">pt</option>
              <option value="ru" className="bg-white text-dark-700">ru</option>
              <option value="zh" className="bg-white text-dark-700">zh</option>
              <option value="ja" className="bg-white text-dark-700">ja</option>
              <option value="ko" className="bg-white text-dark-700">ko</option>
              <option value="ar" className="bg-white text-dark-700">ar</option>
              <option value="hi" className="bg-white text-dark-700">Hindi</option>
            </select>
          </div>
          <button className="btn btn-link" onClick={() => window.history.back()}>Back</button>
        </div>
      </div>

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
            <button
              className="card p-6 text-left hover:-translate-y-1 transition-all duration-300 group"
              onClick={() => onSelect('patient')}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 grid place-items-center rounded-full bg-primary-50 text-primary-600">
                  <FaUserInjured />
                </span>
                <div className="text-lg font-semibold text-dark-900">I am a Patient</div>
              </div>
              <p className="text-sm text-dark-500">Organize medical reports, track values, and ask questions.</p>
              <div className="mt-4 inline-flex items-center gap-2 text-primary-600 font-medium">
                Continue <FaArrowRight className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            <button
              className="card p-6 text-left hover:-translate-y-1 transition-all duration-300 group"
              onClick={() => onSelect('doctor')}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 grid place-items-center rounded-full bg-primary-50 text-primary-600">
                  <FaUserMd />
                </span>
                <div className="text-lg font-semibold text-dark-900">I am a Doctor</div>
              </div>
              <p className="text-sm text-dark-500">Manage patient reports and insights with privacy controls.</p>
              <div className="mt-4 inline-flex items-center gap-2 text-primary-600 font-medium">
                Continue <FaArrowRight className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;


