import React, { useState } from 'react';
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
  FaEnvelopeOpen
} from 'react-icons/fa';
import { useI18n } from '../i18n';

const PatientProfile = ({ user, selectedLanguage, onLanguageSelect, onProfileComplete }) => {
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
    if (!formData.bloodGroup) {
      setError('Blood group is required');
      return false;
    }
    if (!formData.heightCm || formData.heightCm < 100 || formData.heightCm > 250) {
      setError('Please enter a valid height (100-250 cm)');
      return false;
    }
    if (!formData.weightKg || formData.weightKg < 30 || formData.weightKg > 200) {
      setError('Please enter a valid weight (30-200 kg)');
      return false;
    }
    if (!formData.emergencyContact.name || !formData.emergencyContact.phone) {
      setError('Emergency contact name and phone are required');
      return false;
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
      
      // Update user with profile data
      const updatedUser = {
        ...user,
        patientProfile: {
          bloodGroup: formData.bloodGroup,
          heightCm: parseInt(formData.heightCm),
          weightKg: parseInt(formData.weightKg),
          allergies: formData.allergies,
          chronicConditions: formData.chronicConditions,
          emergencyContact: formData.emergencyContact
        }
      };

      setSuccess('Profile completed successfully!');
      
      setTimeout(() => {
        onProfileComplete(updatedUser);
      }, 1000);

    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col text-dark-700">
      {/* Top bar */}
      <div className="flex justify-between items-center p-5 bg-white/90 backdrop-blur-md border-b border-dark-200 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="MedClerk Logo" className="h-8 w-8 object-contain" />
          <div className="text-2xl font-bold text-dark-950">MedClerk</div>
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
                      placeholder="e.g., Jane Doe"
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
                      placeholder="e.g., +1-555-123-4567"
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
                      placeholder="e.g., jane.doe@example.com"
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
    </div>
  );
};

export default PatientProfile;
