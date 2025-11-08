import React, { useState } from 'react';
import { FaIdBadge, FaUserMd, FaHospital, FaClock, FaArrowRight } from 'react-icons/fa';

const DoctorProfile = ({ user, onProfileComplete }) => {
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
        <div className="flex items-center">
          <img src="/logo1.jpg" alt="MedClerk Logo" className="h-14 w-22 object-contain" />
        </div>
      </div>

      <div className="flex-1 p-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-900 mb-2">Complete Your Doctor Profile</h1>
            <p className="text-dark-500">Provide your professional details to continue</p>
            <p className="text-dark-400 text-sm mt-2">You can skip this step and add your profile information later</p>
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

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <button
                  type="button"
                  className="btn btn-secondary min-w-48 flex items-center justify-center gap-2.5 text-base py-4 px-8 order-2 sm:order-1"
                  onClick={() => {
                    const userWithSkippedProfile = {
                      ...user,
                      doctorProfile: {
                        skipped: true,
                        licenseNumber: '',
                        specialization: '',
                        clinicName: '',
                        yearsOfExperience: null
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
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;


