import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import './Auth.css';
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
    <div className="auth">
      <div className="main-content">
        <div className="page-container">
          <div className="header">
            <h1>{isSignUp ? t('auth_create_account') : t('auth_welcome_back')}</h1>
            <p>{isSignUp ? t('auth_signup_sub') : t('auth_signin_sub')}</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <div className="form-group">
                  <label className="form-label">
                    <FaUser className="input-icon" />
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

              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope className="input-icon" />
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

              <div className="form-group">
                <label className="form-label">
                  <FaLock className="input-icon" />
                  {t('password')}
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input password-input"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="form-group">
                  <label className="form-label">
                    <FaLock className="input-icon" />
                    {t('confirm_password')}
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="form-input password-input"
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
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
                className={`btn btn-primary submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                    <span>{isSignUp ? t('create_account') : t('sign_in_action')}...</span>
                  </div>
                ) : (
                  isSignUp ? t('create_account') : t('sign_in_action')
                )}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  className="switch-btn"
                  onClick={toggleMode}
                  disabled={isLoading}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>

          <div className="footer-info">
            <p>Language: {selectedLanguage?.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
