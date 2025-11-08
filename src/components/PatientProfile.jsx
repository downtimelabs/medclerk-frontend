import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  FaUser, 
  FaHeart, 
  FaWeight, 
  FaRuler, 
  FaExclamationTriangle, 
  FaUserMd, 
  FaPhone, 
  FaEnvelope, 
  FaArrowRight,
  FaTint,
  FaRulerVertical,
  FaBalanceScale,
  FaAllergies,
  FaStethoscope,
  FaUserShield,
  FaPhoneAlt,
  FaEnvelopeOpen,
  FaUserCircle,
  FaChevronDown,
  FaSignOutAlt,
  FaTimes,
  FaPencilAlt
} from 'react-icons/fa';
import { useI18n } from '../i18n';

const PatientProfile = ({ user, onProfileComplete, onLogout }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    bloodGroup: '',
    heightCm: '',
    weightKg: '',
    allergies: '',
    chronicConditions: [],
    emergencyContact: {
      name: '',
      phone: '',
      email: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const loadProfile = () => {
      try {
        const savedProfile = localStorage.getItem('patientProfile');
        console.log('Loading saved profile:', savedProfile);
        
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          console.log('Parsed profile:', parsedProfile);
          
          // Ensure emergencyContact exists and has required fields
          const emergencyContact = {
            name: '',
            phone: '',
            email: '',
            ...(parsedProfile.emergencyContact || {})
          };
          
          const newFormData = {
            bloodGroup: parsedProfile.bloodGroup || '',
            heightCm: parsedProfile.heightCm || '',
            weightKg: parsedProfile.weightKg || '',
            allergies: parsedProfile.allergies || '',
            chronicConditions: Array.isArray(parsedProfile.chronicConditions) 
              ? parsedProfile.chronicConditions 
              : [],
            emergencyContact: emergencyContact
          };
          
          console.log('Setting form data:', newFormData);
          setFormData(newFormData);
          
        } else if (user?.patientProfile) {
          console.log('Using user prop profile:', user.patientProfile);
          
          const emergencyContact = {
            name: '',
            phone: '',
            email: '',
            ...(user.patientProfile.emergencyContact || {})
          };
          
          const newFormData = {
            bloodGroup: user.patientProfile.bloodGroup || '',
            heightCm: user.patientProfile.heightCm || '',
            weightKg: user.patientProfile.weightKg || '',
            allergies: user.patientProfile.allergies || '',
            chronicConditions: Array.isArray(user.patientProfile.chronicConditions) 
              ? user.patientProfile.chronicConditions 
              : [],
            emergencyContact: emergencyContact
          };
          
          console.log('Setting form data from user prop:', newFormData);
          setFormData(newFormData);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Initialize with default values on error
        setFormData({
          bloodGroup: '',
          heightCm: '',
          weightKg: '',
          allergies: '',
          chronicConditions: [],
          emergencyContact: {
            name: '',
            phone: '',
            email: ''
          }
        });
      }
    };
    
    loadProfile();
  }, [user]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const commonConditions = ['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis', 'Depression', 'Anxiety', 'High Cholesterol'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value
      }
    }));
  };

  const handleConditionToggle = (condition) => {
    setFormData(prev => ({
      ...prev,
      chronicConditions: prev.chronicConditions.includes(condition)
        ? prev.chronicConditions.filter(c => c !== condition)
        : [...prev.chronicConditions, condition]
    }));
  };

  const validateForm = () => {
    console.log('Validating form data:', formData);
    
    if (!formData.bloodGroup) {
      const errorMsg = 'Blood group is required';
      console.log(errorMsg);
      setError(errorMsg);
      return false;
    }
    
    const height = parseInt(formData.heightCm, 10);
    if (!formData.heightCm || isNaN(height) || height < 100 || height > 250) {
      const errorMsg = 'Please enter a valid height (100-250 cm)';
      console.log(errorMsg);
      setError(errorMsg);
      return false;
    }
    
    const weight = parseInt(formData.weightKg, 10);
    if (!formData.weightKg || isNaN(weight) || weight < 30 || weight > 200) {
      const errorMsg = 'Please enter a valid weight (30-200 kg)';
      console.log(errorMsg);
      setError(errorMsg);
      return false;
    }
    
    if (!formData.emergencyContact?.name || !formData.emergencyContact?.phone) {
      const errorMsg = 'Emergency contact name and phone are required';
      console.log(errorMsg);
      setError(errorMsg);
      return false;
    }
    
    console.log('Form validation passed');
    return true;
  };

  // Removed the separate saveProfileData function as it's now handled in handleSubmit

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submit triggered');
    
    // Validate form
    const isValid = validateForm();
    console.log('Form validation result:', isValid);
    
    if (!isValid) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form data being submitted:', formData);
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare profile data
      const profileData = {
        ...formData,
        heightCm: formData.heightCm ? parseInt(formData.heightCm) : '',
        weightKg: formData.weightKg ? parseInt(formData.weightKg) : '',
        lastUpdated: new Date().toISOString()
      };

      console.log('Saving profile data:', profileData);
      
      // Save data to localStorage
      localStorage.setItem('patientProfile', JSON.stringify(profileData));
      
      // Update the form data state
      setFormData(profileData);
      
      // Show success message with state update
      setSuccess('Profile saved successfully!');
      setShowSuccessMessage(true);
      
      // Log success to console for debugging
      console.log('Profile saved successfully, showing success message');
      
      // Clear any existing timeouts to prevent multiple messages
      if (window.successTimeout) {
        clearTimeout(window.successTimeout);
      }
      
      // Hide the message after 3 seconds
      window.successTimeout = setTimeout(() => {
        console.log('Hiding success message');
        setShowSuccessMessage(false);
      }, 3000);
      
      // Close modal if open
      if (showProfileModal) {
        setIsEditMode(false);
        setShowProfileModal(false);
      }
      
      // Notify parent component if callback is provided
      if (onProfileComplete) {
        const updatedUser = {
          ...user,
          patientProfile: profileData
        };
        onProfileComplete(updatedUser);
      }

    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col text-dark-700">
      {/* Top bar */}
      <div className="flex justify-between items-center p-5 bg-white border-b border-dark-200 shadow-md">
        <div className="flex items-center">
          <img src="/logo1.jpg" alt="MedClerk Logo" className="h-16 w-26 object-contain" />
        </div>
        <div className="flex gap-4 items-center">
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 bg-white/80 backdrop-blur border border-blue-200 rounded-xl px-4 py-2 hover:bg-white hover:shadow-md transition-all"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-sm">
                <FaUserCircle className="text-lg" />
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-semibold text-gray-800">{user?.name || 'Patient'}</div>
                <div className="text-xs text-gray-500">Patient Account</div>
              </div>
              <FaChevronDown className={`text-xs text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-dark-200 rounded-xl shadow-xl z-50">
                <div className="p-4 border-b border-dark-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white">
                      <FaUserCircle className="text-2xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-dark-900 truncate">{user?.name || 'Patient'}</div>
                      <div className="text-xs text-dark-500 truncate">Patient Account</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowProfileModal(true);
                      setIsEditMode(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <FaUser className="text-sm" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-dark-900">View Profile</div>
                      <div className="text-xs text-dark-500">See and edit your details</div>
                    </div>
                  </button>
                </div>
                
                <div className="p-2 border-t border-dark-100">
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600 group-hover:bg-red-100">
                      <FaSignOutAlt className="text-sm" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-red-600">Sign Out</div>
                      <div className="text-xs text-red-500">Logout from your account</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-900 mb-2">Complete Your Patient Profile</h1>
            <p className="text-dark-500">Help us provide better care by sharing your medical information</p>
            <p className="text-dark-400 text-sm mt-2">You can skip this step and add your profile information later</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Medical Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                      <FaHeart className="text-white text-sm" />
                    </div>
                    Basic Medical Information
                  </h3>

                  <div>
                    <label className="flex items-center gap-3 mb-2 font-semibold text-dark-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                        <FaTint className="text-white text-xs" />
                      </div>
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 mb-2 font-semibold text-dark-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <FaRulerVertical className="text-white text-xs" />
                      </div>
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="heightCm"
                      value={formData.heightCm}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g., 175"
                      min="100"
                      max="250"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-3 mb-2 font-semibold text-dark-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                        <FaBalanceScale className="text-white text-xs" />
                      </div>
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weightKg"
                      value={formData.weightKg}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g., 70"
                      min="30"
                      max="200"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-3 mb-2 font-semibold text-dark-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                        <FaAllergies className="text-white text-xs" />
                      </div>
                      Allergies
                    </label>
                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g., Peanuts, Shellfish"
                    />
                  </div>
                </div>

                {/* Chronic Conditions & Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <FaStethoscope className="text-white text-sm" />
                    </div>
                    Health Conditions
                  </h3>

                  <div>
                    <label className="block mb-3 font-semibold text-dark-700">
                      Chronic Conditions (select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {commonConditions.map(condition => (
                        <label key={condition} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.chronicConditions.includes(condition)}
                            onChange={() => handleConditionToggle(condition)}
                            className="rounded border-dark-200 text-primary-500 focus:ring-primary-500"
                          />
                          <span className="text-sm text-dark-700">{condition}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                      <FaUserShield className="text-white text-sm" />
                    </div>
                    Emergency Contact
                  </h3>

                  <div>
                    <label className="flex items-center gap-3 mb-2 font-semibold text-dark-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                        <FaUser className="text-white text-xs" />
                      </div>
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.emergencyContact.name}
                      onChange={handleEmergencyContactChange}
                      className="form-input"
                      placeholder="e.g: Tanu Kumar "
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-3 mb-2 font-semibold text-dark-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                        <FaPhoneAlt className="text-white text-xs" />
                      </div>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.emergencyContact.phone}
                      onChange={handleEmergencyContactChange}
                      className="form-input"
                      placeholder="e.g., +91-8837852977"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-3 mb-2 font-semibold text-dark-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-sm">
                        <FaEnvelopeOpen className="text-white text-xs" />
                      </div>
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.emergencyContact.email}
                      onChange={handleEmergencyContactChange}
                      className="form-input"
                      placeholder="e.g., tanu.kumar@example.com"
                    />
                  </div>
                </div>
              </div>

              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <button
                  type="button"
                  className="btn btn-secondary min-w-48 flex items-center justify-center gap-2.5 text-base py-4 px-8 order-2 sm:order-1"
                  onClick={() => {
                    const userWithSkippedProfile = {
                      ...user,
                      patientProfile: {
                        skipped: true,
                        bloodGroup: '',
                        heightCm: null,
                        weightKg: null,
                        allergies: '',
                        chronicConditions: [],
                        emergencyContact: {
                          name: '',
                          phone: '',
                          email: ''
                        }
                      }
                    };
                    onProfileComplete(userWithSkippedProfile);
                  }}
                  disabled={isLoading}
                >
                  <span>Skip for Now</span>
                </button>
                <button
                  type="submit"
                  className="btn btn-primary min-w-48 flex items-center justify-center gap-2.5 text-base py-4 px-8 order-1 sm:order-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2.5">
                      <div className="spinner"></div>
                      <span>Saving Profile...</span>
                    </div>
                  ) : (
                    <>
                      <span>Complete Profile</span>
                      <FaArrowRight />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-5">
            <p className="text-dark-500 text-sm bg-dark-50 px-4 py-2 rounded-full inline-block">
              Your information is secure and will only be used for medical care
            </p>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowProfileMenu(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-black/5" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-dark-900">
                  {isEditMode ? 'Edit Profile' : 'Your Profile'}
                </h2>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setIsEditMode(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {!isEditMode ? (
                // View Mode (modern card style)
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">Full Name</p>
                          <p className="font-medium text-gray-900">{user?.name || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{user?.email || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold text-gray-900">Medical Information</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">Blood Group</p>
                            <p className="font-medium text-gray-900">{formData.bloodGroup || 'Not provided'}</p>
                          </div>
                          <button onClick={() => setIsEditMode(true)} className="text-sm text-blue-600 hover:underline">Edit</button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">Height</p>
                            <p className="font-medium text-gray-900">{formData.heightCm ? `${formData.heightCm} cm` : 'Not provided'}</p>
                          </div>
                          {!formData.heightCm && (
                            <FaExclamationTriangle className="text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">Weight</p>
                            <p className="font-medium text-gray-900">{formData.weightKg ? `${formData.weightKg} kg` : 'Not provided'}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {!formData.weightKg && (
                              <FaExclamationTriangle className="text-yellow-500" />
                            )}
                            <button onClick={() => setIsEditMode(true)} className="text-sm text-blue-600 hover:underline">Edit</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(!formData.emergencyContact?.name || !formData.emergencyContact?.phone) && (
                    <div className="bg-amber-50 text-amber-900 rounded-xl border border-amber-200 px-4 py-3 flex items-start gap-3">
                      <FaExclamationTriangle className="mt-0.5 text-amber-500" />
                      <div className="flex-1">
                        <p className="text-sm">No emergency contact recorded</p>
                        <button onClick={() => setIsEditMode(true)} className="text-sm text-blue-600 hover:underline">Set Now</button>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold text-gray-900">Emergency Contact</h3>
                      <button onClick={() => setIsEditMode(true)} className="text-sm text-blue-600 hover:underline">Edit</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">{formData.emergencyContact?.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">{formData.emergencyContact?.phone || 'Not provided'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{formData.emergencyContact?.email || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold text-gray-900">Health Data</h3>
                    </div>
                    {formData.chronicConditions?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.chronicConditions.map(condition => (
                          <span key={condition} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {condition}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <span>No chronic conditions recorded</span>
                        <button onClick={() => setIsEditMode(true)} className="text-blue-600 hover:underline">Add Now</button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditMode(true)}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <FaPencilAlt /> Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={(e) => {
                  console.log('Form submit event triggered');
                  handleSubmit(e);
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={user?.name || ''}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Blood Group
                          </label>
                          <select
                            name="bloodGroup"
                            value={formData.bloodGroup || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Blood Group</option>
                            {bloodGroups.map(group => (
                              <option key={group} value={group}>{group}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Height (cm)
                          </label>
                          <input
                            type="number"
                            name="heightCm"
                            value={formData.heightCm || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 175"
                            min="100"
                            max="250"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            name="weightKg"
                            value={formData.weightKg || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 70"
                            min="30"
                            max="200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Chronic Conditions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {commonConditions.map(condition => (
                        <label key={condition} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.chronicConditions?.includes(condition) || false}
                            onChange={() => handleConditionToggle(condition)}
                            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{condition}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.emergencyContact?.name || ''}
                          onChange={handleEmergencyContactChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Contact name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.emergencyContact?.phone || ''}
                          onChange={handleEmergencyContactChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., +91-8837852977"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email (optional)
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.emergencyContact?.email || ''}
                          onChange={handleEmergencyContactChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., contact@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        console.log('Save button clicked');
                        handleSubmit(e);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Render nothing here - notification is rendered via portal */}
      {showSuccessMessage && createPortal(
        <div className="fixed inset-0 pointer-events-none z-[9999] flex justify-end p-4 transition-opacity duration-300" style={{ opacity: showSuccessMessage ? 1 : 0 }}>
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-2xl flex items-start gap-3 max-w-md animate-fadeIn">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm sm:text-base leading-tight">Profile Updated</p>
              <p className="text-sm opacity-90 mt-1">{success || 'Your changes have been saved successfully'}</p>
            </div>
            <button 
              onClick={() => setShowSuccessMessage(false)}
              className="text-white hover:text-gray-200 focus:outline-none ml-2 flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PatientProfile;
