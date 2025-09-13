import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useI18n } from '../i18n';

const Auth = ({ selectedLanguage, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(true);
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
      const userData = {
        id: Date.now(),
        name: isSignUp ? formData.name : 'John Doe',
        email: formData.email,
        language: selectedLanguage,
        createdAt: new Date().toISOString()
      };

      setSuccess(isSignUp ? 'Account created successfully!' : 'Login successful!');
      
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

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col text-dark-300">
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 text-white">
              {isSignUp ? t('auth_create_account') : t('auth_welcome_back')}
            </h1>
            <p className="text-lg text-dark-400">
              {isSignUp ? t('auth_signup_sub') : t('auth_signin_sub')}
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <div className="relative mb-5">
                  <label className="flex items-center gap-2 mb-2 font-semibold text-dark-300">
                    <FaUser className="text-primary-500 text-sm" />
                    {t('full_name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="relative mb-5">
                <label className="flex items-center gap-2 mb-2 font-semibold text-dark-300">
                  <FaEnvelope className="text-primary-500 text-sm" />
                  {t('email_address')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>

              <div className="relative mb-5">
                <label className="flex items-center gap-2 mb-2 font-semibold text-dark-300">
                  <FaLock className="text-primary-500 text-sm" />
                  {t('password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input pr-12"
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
                <div className="relative mb-5">
                  <label className="flex items-center gap-2 mb-2 font-semibold text-dark-300">
                    <FaLock className="text-primary-500 text-sm" />
                    {t('confirm_password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="form-input pr-12"
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

              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <button
                type="submit"
                className={`btn btn-primary w-full mt-5 py-4 text-base font-semibold ${isLoading ? 'cursor-not-allowed' : ''}`}
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

          <div className="text-center mt-5">
            <p className="text-dark-500 text-sm bg-white bg-opacity-5 px-4 py-2 rounded-full inline-block">
              Language: {selectedLanguage?.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
