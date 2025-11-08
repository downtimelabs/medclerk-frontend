import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n';
import { register, login, forgotPassword } from '../services/authService';

const Auth = ({ selectedRole, onAuthSuccess, isSignInMode = false, isSignUpMode = false }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(isSignUpMode || !isSignInMode);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: selectedRole?.toLowerCase() || 'patient'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.email.trim()) {
        setError('Email is required');
        return;
      }

      await forgotPassword({ email: formData.email });
      setSuccess('Password reset link has been sent to your email!');
      
      setTimeout(() => {
        setIsForgotPassword(false);
        setFormData({ ...formData, email: '' });
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isForgotPassword) {
      return handleForgotPassword(e);
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simple validation
      if (isSignUp && !formData.name.trim()) {
        setError('Name is required');
        setIsLoading(false);
        return;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        setIsLoading(false);
        return;
      }
      if (!formData.password) {
        setError('Password is required');
        setIsLoading(false);
        return;
      }
      if (isSignUp && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      let response;
      
      if (isSignUp) {
        // Register new user
        response = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
      } else {
        // Login existing user
        response = await login({
          email: formData.email,
          password: formData.password
        });
      }

      // Extract user data from API response
      const userData = response?.data?.user || response?.user;
      
      if (!userData) {
        throw new Error('Invalid response from server');
      }

      setSuccess(isSignUp ? 'Account created successfully!' : 'Login successful!');
      
      // Update App state and redirect
      if (onAuthSuccess) {
        onAuthSuccess(userData);
      }
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);

    } catch (err) {
      const errorMessage = err.message || (isSignUp ? 'Failed to create account' : 'Login failed');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine background image based on role
  const backgroundImage = selectedRole === 'doctor' ? '/doctorprofile.jpg' : '/patient.png';
  const backgroundOpacity = selectedRole === 'doctor' ? 0.6 : 0.69;

  return (
    <div className="min-h-screen flex flex-col text-dark-700 relative overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: backgroundOpacity }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Soft White Overlay */}
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

        <div className="flex-1 p-5">
        <div className="max-w-xl mx-auto">
          <div className="w-full">
            <div className="text-left mb-6">
              <h1 className="text-4xl mb-3 font-bold text-dark-900">
                {isForgotPassword ? 'Reset Password' : (isSignUp ? t('auth_create_account') : t('auth_welcome_back'))}
              </h1>
              <p className="text-lg text-dark-500">
                {isForgotPassword ? 'Enter your email to receive a password reset link' : (isSignUp ? t('auth_signup_sub') : t('auth_signin_sub'))}
              </p>
              {selectedRole && !isForgotPassword && (
                <div className="mt-3 inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  {selectedRole === 'patient' ? '👤 Patient Account' : '👨‍⚕️ Doctor Account'}
                </div>
              )}
            </div>

            <div className="card p-5">
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && !isForgotPassword && (
                  <div className="relative">
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                      <FaUser className="text-primary-500 text-sm" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input py-2"
                      placeholder="Enter your full name"
                      disabled={isLoading}
                      required={isSignUp}
                    />
                  </div>
                )}

                <div className="relative">
                  <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                    <FaEnvelope className="text-primary-500 text-sm" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input py-2"
                    placeholder="Enter your email"
                    disabled={isLoading}
                    required
                  />
                </div>

                {!isForgotPassword && (
                  <div className="relative">
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                      <FaLock className="text-primary-500 text-sm" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-input pr-12 py-2"
                        placeholder="Enter your password"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-none border-0 text-dark-500 cursor-pointer text-base p-1 transition-colors hover:text-primary-500"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                )}

                {isSignUp && !isForgotPassword && (
                  <div className="relative">
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                      <FaLock className="text-primary-500 text-sm" />
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="form-input py-2"
                      placeholder="Confirm your password"
                      disabled={isLoading}
                      required
                    />
                  </div>
                )}

                {!isSignUp && !isForgotPassword && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="bg-none border-0 text-primary-500 text-sm cursor-pointer underline transition-colors hover:text-primary-600"
                      onClick={() => setIsForgotPassword(true)}
                      disabled={isLoading}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}

                <button
                  type="submit"
                  className="btn btn-primary w-full mt-5 py-4 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2.5">
                      <div className="spinner"></div>
                      <span>{isForgotPassword ? 'Sending Reset Link...' : (isSignUp ? 'Creating Account...' : 'Signing In...')}</span>
                    </div>
                  ) : (
                    isForgotPassword ? 'Send Reset Link' : (isSignUp ? 'Create Account' : 'Sign In')
                  )}
                </button>
              </form>

              {!isSignUpMode && (
                <div className="text-center mt-8 pt-5 border-t border-white/10">
                  <p className="text-dark-500 text-sm">
                    {isForgotPassword ? 'Remember your password?' : (isSignUp ? 'Already have an account?' : "Don't have an account?")}
                    <button
                      type="button"
                      className="bg-none border-0 text-primary-500 font-semibold cursor-pointer underline ml-1 transition-colors hover:text-primary-600"
                      onClick={() => {
                        if (isForgotPassword) {
                          setIsForgotPassword(false);
                        } else if (isSignUp) {
                          // If in sign-up mode, toggle to sign-in
                          setIsSignUp(false);
                        } else {
                          // If in sign-in mode, navigate to /signup
                          navigate('/signup');
                        }
                      }}
                      disabled={isLoading}
                    >
                      {isForgotPassword ? 'Back to Sign In' : (isSignUp ? 'Sign In' : 'Sign Up')}
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
