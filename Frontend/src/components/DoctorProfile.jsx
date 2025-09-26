import React, { useState } from 'react';
import { FaIdBadge, FaUserMd, FaHospital, FaClock, FaArrowRight } from 'react-icons/fa';

const DoctorProfile = ({ user, selectedLanguage, onLanguageSelect, onProfileComplete }) => {
  const [formData, setFormData] = useState({
    licenseNumber: '',
    specialization: '',
    clinicName: '',
    yearsOfExperience: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.licenseNumber || formData.licenseNumber.trim().length < 6) {
      setError('Valid license number is required');
      return false;
    }
    if (!formData.specialization.trim()) {
      setError('Specialization is required');
      return false;
    }
    if (!formData.clinicName.trim()) {
      setError('Clinic name is required');
      return false;
    }
    const years = parseInt(formData.yearsOfExperience, 10);
    if (Number.isNaN(years) || years < 0 || years > 70) {
      setError('Years of experience must be between 0 and 70');
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
      await new Promise(resolve => setTimeout(resolve, 1200));

      const updatedUser = {
        ...user,
        doctorProfile: {
          licenseNumber: formData.licenseNumber.trim(),
          specialization: formData.specialization.trim(),
          clinicName: formData.clinicName.trim(),
          yearsOfExperience: parseInt(formData.yearsOfExperience, 10)
        }
      };

      setSuccess('Profile completed successfully!');
      setTimeout(() => onProfileComplete(updatedUser), 800);
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
        </div>
      </div>

      <div className="flex-1 p-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-900 mb-2">Complete Your Doctor Profile</h1>
            <p className="text-dark-500">Provide your professional details to continue</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                    <FaIdBadge className="text-primary-500 text-sm" />
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., MD12345678"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                    <FaUserMd className="text-primary-500 text-sm" />
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Cardiology"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                    <FaHospital className="text-primary-500 text-sm" />
                    Clinic/Hospital Name
                  </label>
                  <input
                    type="text"
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Heart Care Medical Center"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700">
                    <FaClock className="text-primary-500 text-sm" />
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 15"
                    min="0"
                    max="70"
                    required
                  />
                </div>
              </div>

              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <div className="text-center mt-8">
                <button
                  type="submit"
                  className="btn btn-primary min-w-48 flex items-center justify-center gap-2.5 text-base py-4 px-8"
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
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;


