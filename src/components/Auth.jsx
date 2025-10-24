import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useI18n } from '../i18n';

const Auth = ({ selectedLanguage, selectedRole, onLanguageSelect, onAuthSuccess, isSignInMode = false, isSignUpMode = false }) => {
  const [isSignUp, setIsSignUp] = useState(isSignUpMode || !isSignInMode);
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: selectedRole?.toUpperCase() || 'PATIENT'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simple validation
      if (isSignUp && !formData.name.trim()) {
        setError('Name is required');
        return;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return;
      }
      if (!formData.password) {
        setError('Password is required');
        return;
      }
      if (isSignUp && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Create user data
      const userData = {
        id: Date.now(),
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        language: selectedLanguage,
        role: (selectedRole || 'patient').toLowerCase(),
        createdAt: new Date().toISOString()
      };

      setSuccess(isSignUp ? 'Account created successfully!' : 'Login successful!');
      
      setTimeout(() => {
        onAuthSuccess(userData);
      }, 1000);

    } catch (err) {
      setError(err.message || (isSignUp ? 'Failed to create account' : 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col text-dark-700">
      {/* Top bar */}
      <div className="flex justify-between items-center p-5 bg-white/90 backdrop-blur-md border-b border-dark-200 shadow-sm">
        <div className="flex items-center">
          <img src="/logo1.jpg" alt="MedClerk Logo" className="h-16 w-22 object-contain" />
        </div>
        <div className="flex gap-4 items-center">
          <select
            className="appearance-none bg-white text-dark-700 border border-dark-200 rounded-lg px-3 py-2 pr-7 text-sm cursor-pointer focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500 focus:ring-opacity-15"
            value={selectedLanguage || 'en'}
            onChange={(e) => onLanguageSelect?.(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="hi">Hindi</option>
          </select>
          <button className="btn btn-link" onClick={() => window.history.back()}>Back</button>
        </div>
      </div>

      <div className="flex-1 p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-center">
          <div className="max-w-md w-full mx-auto lg:mx-0">
            <div className="text-left mb-6">
              <h1 className="text-4xl mb-3 font-bold text-dark-900">
                {isSignUp ? t('auth_create_account') : t('auth_welcome_back')}
              </h1>
              <p className="text-lg text-dark-500">
                {isSignUp ? t('auth_signup_sub') : t('auth_signin_sub')}
              </p>
              {selectedRole && (
                <div className="mt-3 inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  {selectedRole === 'patient' ? '👤 Patient Account' : '👨‍⚕️ Doctor Account'}
                </div>
              )}
            </div>

            <div className="card p-5">
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
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

                {isSignUp && (
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
                      <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                    </div>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </button>
              </form>

              {!isSignUpMode && (
                <div className="text-center mt-8 pt-5 border-t border-white/10">
                  <p className="text-dark-500 text-sm">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button
                      type="button"
                      className="bg-none border-0 text-primary-500 font-semibold cursor-pointer underline ml-1 transition-colors hover:text-primary-600"
                      onClick={() => setIsSignUp(!isSignUp)}
                      disabled={isLoading}
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              )}
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
