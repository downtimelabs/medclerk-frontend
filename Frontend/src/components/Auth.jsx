import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaCheckCircle, FaPhone, FaUserMd, FaHospital, FaGraduationCap, FaIdCard, FaHeart, FaWeight, FaRuler, FaExclamationTriangle, FaUserFriends } from 'react-icons/fa';
import { useI18n } from '../i18n';

const Auth = ({ selectedLanguage, selectedRole, onLanguageSelect, onAuthSuccess, isSignInMode = false, isSignUpMode = false }) => {
  const [isSignUp, setIsSignUp] = useState(isSignUpMode || !isSignInMode);
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: selectedRole?.toUpperCase() || 'PATIENT',
    // Patient profile fields
    bloodGroup: '',
    heightCm: '',
    weightKg: '',
    allergies: '',
    chronicConditions: [],
    // Emergency contact
    emergencyContact: {
      name: '',
      phone: '',
      email: ''
    },
    // Doctor profile fields
    licenseNumber: '',
    specialization: '',
    clinicName: '',
    yearsOfExperience: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else if (name === 'chronicConditions') {
      // Handle comma-separated chronic conditions
      const conditions = value.split(',').map(c => c.trim()).filter(c => c.length > 0);
      setFormData(prev => ({
        ...prev,
        [name]: conditions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
      
      // Doctor-specific validation
      if (formData.role === 'DOCTOR') {
        if (!formData.licenseNumber.trim()) {
          setError('License number is required');
          return false;
        }
        if (!formData.specialization.trim()) {
          setError('Specialization is required');
          return false;
        }
        if (!formData.clinicName.trim()) {
          setError('Clinic/Hospital name is required');
          return false;
        }
        if (!formData.yearsOfExperience || formData.yearsOfExperience < 0) {
          setError('Years of experience is required');
          return false;
        }
      }
      
      // Patient-specific validation
      if (formData.role === 'PATIENT') {
        if (!formData.emergencyContact.name.trim()) {
          setError('Emergency contact name is required');
          return false;
        }
        if (!formData.emergencyContact.phone.trim()) {
          setError('Emergency contact phone is required');
          return false;
        }
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
      // For sign-up, prepare data according to backend API structure
      let apiData = {};
      
      if (isSignUp) {
        apiData = {
          email: formData.email?.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          name: formData.name?.trim(),
          role: formData.role
        };

        if (formData.role === 'PATIENT') {
          apiData.patientProfile = {
            bloodGroup: formData.bloodGroup,
            heightCm: parseInt(formData.heightCm) || 0,
            weightKg: parseInt(formData.weightKg) || 0,
            allergies: formData.allergies,
            chronicConditions: formData.chronicConditions
          };
          apiData.emergencyContact = formData.emergencyContact;
        } else if (formData.role === 'DOCTOR') {
          apiData.doctorProfile = {
            licenseNumber: formData.licenseNumber?.trim() || '',
            specialization: formData.specialization?.trim() || '',
            clinicName: formData.clinicName?.trim() || '',
            yearsOfExperience: parseInt(formData.yearsOfExperience) || 0
          };
          
          // Remove empty fields to avoid validation issues
          Object.keys(apiData.doctorProfile).forEach(key => {
            if (apiData.doctorProfile[key] === '' || apiData.doctorProfile[key] === null) {
              delete apiData.doctorProfile[key];
            }
          });
        }
      }

      // Make API call to your backend
      const endpoint = isSignUp ? 'https://medclerk-backend.vercel.app/api/v1/auth/register' : 'https://medclerk-backend.vercel.app/api/v1/auth/login';
      
      // Debug: Log the data being sent
      const requestData = isSignUp ? apiData : { email: formData.email, password: formData.password };
      console.log(`Sending ${isSignUp ? 'registration' : 'login'} data:`, JSON.stringify(requestData, null, 2));
      console.log('Request URL:', endpoint);
      console.log('Request method:', 'POST');
      
      // Check if backend is running
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(isSignUp ? apiData : { email: formData.email, password: formData.password })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Registration error details:', errorData);
          console.error('Full error object:', JSON.stringify(errorData, null, 2));
          
          // Show more specific error messages
          let errorMessage = errorData.message || errorData.error || 'Registration failed';
          if (errorData.details) {
            errorMessage += ` - Details: ${JSON.stringify(errorData.details)}`;
          }
          if (errorData.validationErrors) {
            errorMessage += ` - Validation: ${JSON.stringify(errorData.validationErrors)}`;
          }
          
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Registration success:', result);
        
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
          throw new Error('Cannot connect to server. Please check your internet connection or try again later.');
        }
        throw fetchError;
      }
      
      // Create user data for frontend
      let userData;
      
      if (isSignUp) {
        const normalizedRole = formData.role.toLowerCase();
        userData = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          language: selectedLanguage,
          role: normalizedRole,
          createdAt: new Date().toISOString(),
          // Include profile data
          ...(formData.role === 'PATIENT' ? {
            patientProfile: apiData.patientProfile
          } : {
            doctorProfile: apiData.doctorProfile
          })
        };
        
        // Debug: Log the created user data
        console.log('Created user data with profile:', userData);
      } else {
        // For sign-in, try to get existing user data from localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            // Only use if the stored user matches the email being used to sign in
            userData = parsed?.email === formData.email ? parsed : null;
          } catch (e) {
            console.error('Error parsing saved user data:', e);
            userData = null;
          }
        }
        
        // If no existing data found, create basic user data
        if (!userData) {
          const normalizedRole = (selectedRole || 'patient').toString().toLowerCase();
          userData = {
            id: Date.now(),
            name: getDisplayNameFromEmail(formData.email),
            email: formData.email,
            language: selectedLanguage,
            role: normalizedRole,
            createdAt: new Date().toISOString()
          };
        }
      }

      setSuccess(isSignUp ? `${selectedRole === 'patient' ? 'Patient' : 'Doctor'} account created successfully!` : 'Login successful!');
      
      setTimeout(() => {
        onAuthSuccess(userData);
      }, 1000);

    } catch (err) {
      setError(err.message || (isSignUp ? 'Failed to create account. Please try again.' : 'Login failed. Please check your credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    // Only allow toggle if not in forced sign-up mode
    if (!isSignUpMode) {
      setIsSignUp(!isSignUp);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: selectedRole?.toUpperCase() || 'PATIENT',
        // Patient profile fields
        bloodGroup: '',
        heightCm: '',
        weightKg: '',
        allergies: '',
        chronicConditions: [],
        // Emergency contact
        emergencyContact: {
          name: '',
          phone: '',
          email: ''
        },
        // Doctor profile fields
        licenseNumber: '',
        specialization: '',
        clinicName: '',
        yearsOfExperience: ''
      });
      setError('');
      setSuccess('');
    }
  };

  const handleForgotPassword = () => {
    setError('');
    setSuccess('If an account exists, a reset link will be sent to this email.');
  };

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

      <div className="flex-1 p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-center">
          <div className="max-w-md w-full mx-auto lg:mx-0">
            <div className={`text-left ${isSignUp ? 'mb-4' : 'mb-6'}`}>
              <h1 className={`${isSignUp ? 'text-3xl lg:text-4xl mb-1' : 'text-4xl mb-3'} font-bold text-dark-900`}>
              {isSignUp ? (isSignUpMode ? 'Complete Your Profile' : t('auth_create_account')) : t('auth_welcome_back')}
            </h1>
              <p className={`${isSignUp ? 'text-sm' : 'text-lg'} text-dark-500`}>
              {isSignUp ? (isSignUpMode ? 'Fill in your details to create your account' : t('auth_signup_sub')) : t('auth_signin_sub')}
            </p>
              {selectedRole && (
                <div className="mt-3 inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  {selectedRole === 'patient' ? '👤 Patient Account' : '👨‍⚕️ Doctor Account'}
                </div>
              )}
            </div>

            <div className={`card ${isSignUp ? 'p-6' : 'p-5'}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className={`${isSignUp ? 'border-b border-gray-200 pb-4' : ''}`}>
                {isSignUp && (
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="text-primary-500" />
                    Basic Information
                  </h3>
                )}
                <div className={`grid gap-4 ${isSignUp ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
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
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="form-input pr-12 py-2"
                          placeholder="Confirm your password"
                          disabled={isLoading}
                          required
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
              </div>

              {/* Patient Profile Section */}
              {isSignUp && formData.role === 'PATIENT' && (
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUserMd className="text-green-500" />
                    Medical Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="relative">
                      <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                        <FaHeart className="text-red-500 text-sm" />
                        Blood Group
                      </label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="form-input py-2"
                        disabled={isLoading}
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div className="relative">
                      <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                        <FaRuler className="text-blue-500 text-sm" />
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        name="heightCm"
                        value={formData.heightCm}
                        onChange={handleInputChange}
                        className="form-input py-2"
                        placeholder="e.g., 175"
                        disabled={isLoading}
                        min="100"
                        max="250"
                      />
                    </div>

                    <div className="relative">
                      <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                        <FaWeight className="text-purple-500 text-sm" />
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weightKg"
                        value={formData.weightKg}
                        onChange={handleInputChange}
                        className="form-input py-2"
                        placeholder="e.g., 70"
                        disabled={isLoading}
                        min="30"
                        max="300"
                      />
                    </div>

                    <div className="relative">
                      <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                        <FaExclamationTriangle className="text-yellow-500 text-sm" />
                        Allergies
                      </label>
                      <input
                        type="text"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        className="form-input py-2"
                        placeholder="e.g., Peanuts, Shellfish"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="relative md:col-span-2">
                      <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                        <FaHeart className="text-red-500 text-sm" />
                        Chronic Conditions
                      </label>
                      <input
                        type="text"
                        name="chronicConditions"
                        value={formData.chronicConditions.join(', ')}
                        onChange={handleInputChange}
                        className="form-input py-2"
                        placeholder="e.g., Diabetes, Hypertension"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple conditions with commas</p>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaUserFriends className="text-orange-500" />
                      Emergency Contact
                    </h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="relative">
                        <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                          <FaUser className="text-primary-500 text-sm" />
                          Contact Name
                        </label>
                        <input
                          type="text"
                          name="emergencyContact.name"
                          value={formData.emergencyContact.name}
                          onChange={handleInputChange}
                          className="form-input py-2"
                          placeholder="Emergency contact name"
                          disabled={isLoading}
                          required
                        />
                      </div>

                      <div className="relative">
                        <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                          <FaPhone className="text-green-500 text-sm" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="emergencyContact.phone"
                          value={formData.emergencyContact.phone}
                          onChange={handleInputChange}
                          className="form-input py-2"
                          placeholder="+1-555-123-4567"
                          disabled={isLoading}
                          required
                        />
                      </div>

                      <div className="relative">
                        <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                          <FaEnvelope className="text-blue-500 text-sm" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="emergencyContact.email"
                          value={formData.emergencyContact.email}
                          onChange={handleInputChange}
                          className="form-input py-2"
                          placeholder="contact@example.com"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Doctor Profile Section */}
              {isSignUp && formData.role === 'DOCTOR' && (
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUserMd className="text-blue-500" />
                    Professional Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="relative">
                      <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                        <FaIdCard className="text-purple-500 text-sm" />
                        License Number
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="form-input py-2"
                        placeholder="e.g., MD12345678"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="relative">
                      <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                        <FaGraduationCap className="text-green-500 text-sm" />
                        Specialization
                      </label>
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="form-input py-2"
                        disabled={isLoading}
                        required
                      >
                        <option value="">Select Specialization</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Psychiatry">Psychiatry</option>
                        <option value="Radiology">Radiology</option>
                        <option value="Surgery">Surgery</option>
                        <option value="General Practice">General Practice</option>
                        <option value="Emergency Medicine">Emergency Medicine</option>
                      </select>
                    </div>

                    <div className="relative">
                      <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                        <FaHospital className="text-blue-500 text-sm" />
                        Clinic/Hospital Name
                      </label>
                      <input
                        type="text"
                        name="clinicName"
                        value={formData.clinicName}
                        onChange={handleInputChange}
                        className="form-input py-2"
                        placeholder="e.g., Heart Care Medical Center"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="relative">
                      <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                        <FaGraduationCap className="text-orange-500 text-sm" />
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        className="form-input py-2"
                        placeholder="e.g., 15"
                        disabled={isLoading}
                        min="0"
                        max="50"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

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
                    <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
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

            {!isSignUpMode && (
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
            )}
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
