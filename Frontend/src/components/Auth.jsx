import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { useI18n } from '../i18n';

const Auth = ({ selectedLanguage, selectedRole, onLanguageSelect, onAuthSuccess, isSignInMode = false }) => {
  const [isSignUp, setIsSignUp] = useState(!isSignInMode);
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (isSignUp) {
      if (!formData.name.trim()) {
        setError('Name is required');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!formData.password) {
        setError('Password is required');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    } else {
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!formData.password) {
        setError('Password is required');
        return false;
      }
    }
    return true;
  };

  // Utility: derive a nice display name from an email address
  const getDisplayNameFromEmail = (email) => {
    const local = (email || '').split('@')[0] || '';
    // Remove digits and convert separators to spaces, collapse spaces
    const cleaned = local
      .replace(/[0-9]+/g, '')
      .replace(/[._-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleaned) return local || 'User';
    return cleaned
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful authentication
      const normalizedRole = (selectedRole || 'patient').toString().toLowerCase();
      
      // For sign-in, try to get existing user data from localStorage
      let existingUserData = null;
      if (!isSignUp) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            // Only use if the stored user matches the email being used to sign in
            existingUserData = parsed?.email === formData.email ? parsed : null;
          } catch (e) {
            console.error('Error parsing saved user data:', e);
          }
        }
      }
      
      const userData = {
        id: isSignUp ? Date.now() : (existingUserData?.id || Date.now()),
        name: isSignUp 
          ? formData.name 
          : (existingUserData?.name || getDisplayNameFromEmail(formData.email)),
        email: formData.email,
        language: selectedLanguage,
        role: normalizedRole,
        createdAt: isSignUp ? new Date().toISOString() : (existingUserData?.createdAt || new Date().toISOString()),
        // Preserve existing profile data if signing in
        ...(existingUserData && !isSignUp ? {
          patientProfile: existingUserData.patientProfile,
          doctorProfile: existingUserData.doctorProfile
        } : {})
      };

      setSuccess(isSignUp ? `${selectedRole === 'patient' ? 'Patient' : 'Doctor'} account created successfully!` : 'Login successful!');
      
      setTimeout(() => {
        onAuthSuccess(userData);
      }, 1000);

    } catch (err) {
      setError(isSignUp ? 'Failed to create account. Please try again.' : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  };

  const handleForgotPassword = () => {
    setError('');
    setSuccess('If an account exists, a reset link will be sent to this email.');
  };

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col text-dark-700">
      {/* Top bar */}
      <div className="flex justify-between items-center p-5 bg-white/90 backdrop-blur-md border-b border-dark-200 shadow-sm">
        <div className="text-2xl font-bold text-dark-950">AI Report Organizer</div>
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

      <div className="flex-1 p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-center">
          <div className="max-w-md w-full mx-auto lg:mx-0">
            <div className={`text-left ${isSignUp ? 'mb-4' : 'mb-6'}`}>
              <h1 className={`${isSignUp ? 'text-3xl lg:text-4xl mb-1' : 'text-4xl mb-3'} font-bold text-dark-900`}>
              {isSignUp ? t('auth_create_account') : t('auth_welcome_back')}
            </h1>
              <p className={`${isSignUp ? 'text-sm' : 'text-lg'} text-dark-500`}>
              {isSignUp ? t('auth_signup_sub') : t('auth_signin_sub')}
            </p>
              {selectedRole && (
                <div className="mt-3 inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  {selectedRole === 'patient' ? '👤 Patient Account' : '👨‍⚕️ Doctor Account'}
                </div>
              )}
            </div>

            <div className={`card ${isSignUp ? 'p-4' : 'p-5'}`}>
            <form onSubmit={handleSubmit}>
              <div className={`grid gap-4 ${isSignUp ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
              {isSignUp && (
                <div className="relative">
                  <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                    <FaUser className="text-primary-500 text-sm" />
                    {t('full_name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${isSignUp ? 'py-2' : ''}`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="relative">
                <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                  <FaEnvelope className="text-primary-500 text-sm" />
                  {t('email_address')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${isSignUp ? 'py-2' : ''}`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                  <FaLock className="text-primary-500 text-sm" />
                  {t('password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input pr-12 ${isSignUp ? 'py-2' : ''}`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-none border-0 text-dark-500 cursor-pointer text-base p-1 transition-colors hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="relative">
                  <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                    <FaLock className="text-primary-500 text-sm" />
                    {t('confirm_password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-input pr-12 ${isSignUp ? 'py-2' : ''}`}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-none border-0 text-dark-500 cursor-pointer text-base p-1 transition-colors hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              )}
              </div>

              {/* Forgot password link moved below submit button */}

              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <button
                type="submit"
                className={`btn btn-primary w-full ${isSignUp ? 'mt-4 py-3' : 'mt-5 py-4'} text-base font-semibold ${isLoading ? 'cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2.5">
                    <div className="spinner"></div>
                    <span>{isSignUp ? t('create_account') : t('sign_in_action')}...</span>
                  </div>
                ) : (
                  isSignUp ? t('create_account') : t('sign_in_action')
                )}
              </button>

              {isSignUp && (
                <div className="mt-2 space-y-1.5 text-dark-400 text-xs hidden lg:block">
                </div>
              )}

              {!isSignUp && (
                <div className="flex justify-center mt-3">
                  <button
                    type="button"
                    className="bg-transparent border-0 text-primary-500 text-sm font-semibold cursor-pointer underline hover:text-primary-600"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </form>

            <div className="text-center mt-8 pt-5 border-t border-white/10">
              <p className="text-dark-500 text-sm">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  className="bg-none border-0 text-primary-500 font-semibold cursor-pointer underline ml-1 transition-colors hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={toggleMode}
                  disabled={isLoading}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>

            <div className="text-left mt-4">
              <p className="text-dark-500 text-sm bg-dark-50 px-4 py-2 rounded-full inline-block">
                Language: {selectedLanguage?.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-xl rounded-2xl overflow-hidden border border-dark-100 shadow-2xl ring-1 ring-dark-100">
              <img
                src={'/Infographic medical with photo _ Premium Vector[1].jpg'}
                alt="Healthcare illustration"
                className="w-full lg:max-h-[520px] object-contain"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary-500/10 via-transparent to-dark-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
