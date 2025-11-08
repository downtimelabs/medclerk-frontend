import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHeart, FaRulerVertical, FaBalanceScale, FaAllergies, FaUserShield, FaPhoneAlt, FaEnvelopeOpen } from 'react-icons/fa';
import { register } from '../services/authService';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PatientSignup = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [basic, setBasic] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [medical, setMedical] = useState({
    bloodGroup: '',
    heightCm: '',
    weightKg: '',
    allergies: '',
    chronicConditions: ''
  });

  const [emergency, setEmergency] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const onChangeBasic = (e) => {
    setBasic({ ...basic, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const onChangeMedical = (e) => {
    setMedical({ ...medical, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const onChangeEmergency = (e) => {
    setEmergency({ ...emergency, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const validate = () => {
    const name = basic.name.trim();
    const email = basic.email.trim();
    const pwd = basic.password;
    const cpwd = basic.confirmPassword;
    const height = medical.heightCm ? parseInt(medical.heightCm, 10) : 0;
    const weight = medical.weightKg ? parseInt(medical.weightKg, 10) : 0;
    const eName = emergency.name.trim();
    const ePhone = emergency.phone.trim();

    if (!name) return 'Full name is required';
    if (!email) return 'Email is required';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRe.test(email)) return 'Please enter a valid email address';
    if (!pwd) return 'Password is required';
    if (pwd.length < 8 || !/[A-Za-z]/.test(pwd) || !/\d/.test(pwd)) return 'Password must be at least 8 characters and include letters and numbers';
    if (pwd !== cpwd) return 'Passwords do not match';
    if (!medical.bloodGroup) return 'Blood group is required';
    if (isNaN(height) || height < 80 || height > 250) return 'Height should be between 80 and 250 cm';
    if (isNaN(weight) || weight < 20 || weight > 300) return 'Weight should be between 20 and 300 kg';
    if (!eName || !ePhone) return 'Emergency contact name and phone are required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        email: basic.email.trim(),
        password: basic.password,
        confirmPassword: basic.password,
        name: basic.name.trim(),
        role: 'PATIENT',
        patientProfile: {
          bloodGroup: medical.bloodGroup,
          heightCm: parseInt(medical.heightCm, 10),
          weightKg: parseInt(medical.weightKg, 10),
          allergies: medical.allergies || '',
          chronicConditions: medical.chronicConditions 
            ? medical.chronicConditions.split(',').map((s) => s.trim()).filter(Boolean) 
            : [],
          emergencyContact: {
            name: emergency.name || '',
            phone: emergency.phone || '',
            email: emergency.email || ''
          }
        }
      });

      // Handle different response formats
      let userData = null;
      
      if (response?.data?.user) {
        userData = response.data.user;
      } else if (response?.user) {
        userData = response.user;
      } else if (response?.data) {
        // Backend might return user data directly in data field
        userData = response.data;
      } else {
        // Backend might return user data at root level
        userData = response;
      }
      
      // Ensure we have at least email and role
      if (!userData || !userData.email) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server. Please check console for details.');
      }

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.patientProfile) {
        localStorage.setItem('patientProfile', JSON.stringify(userData.patientProfile));
      }

      // Call onAuthSuccess to update App state
      if (onAuthSuccess) {
        onAuthSuccess(userData);
      }
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (e1) {
      console.error('Registration error:', e1);
      setError(e1?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen flex flex-col text-dark-700 relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-blue-50/60 to-indigo-100/60"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="flex items-center px-4 py-2 sticky top-0 z-40 bg-white/95 shadow-md">
          <div className="py-0 ml-4">
            <img src="/logo1.jpg" alt="MedClerk Logo" className="h-12 md:h-14 object-contain" />
          </div>
        </header>

        <main className="flex-1 p-5">
          <div className="max-w-3xl mx-auto">
            <div className="text-left mb-6">
              <h1 className="text-3xl font-bold text-dark-900 mb-2">Create Patient Account</h1>
              <p className="text-dark-500">Join MedClerk and manage your health with AI</p>
            </div>

            <div className="card p-6">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="name">
                      <FaUser className="text-primary-500" />
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={basic.name}
                      onChange={onChangeBasic}
                      className="form-input"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="email">
                      <FaEnvelope className="text-primary-500" />
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={basic.email}
                      onChange={onChangeBasic}
                      className="form-input"
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="password">
                      <FaLock className="text-primary-500" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={basic.password}
                        onChange={onChangeBasic}
                        className="form-input pr-12"
                        placeholder="Enter your password"
                        autoComplete="new-password"
                        required
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="confirmPassword">
                      <FaLock className="text-primary-500" />
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={basic.confirmPassword}
                      onChange={onChangeBasic}
                      className="form-input"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <hr className="border-dark-100" />

                <h3 className="text-lg font-semibold text-dark-900">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="bloodGroup">
                      <FaHeart className="text-red-500" />
                      Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={medical.bloodGroup}
                      onChange={onChangeMedical}
                      className="form-input"
                      required
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="heightCm">
                      <FaRulerVertical className="text-blue-500" />
                      Height (cm)
                    </label>
                    <input
                      id="heightCm"
                      name="heightCm"
                      type="number"
                      value={medical.heightCm}
                      onChange={onChangeMedical}
                      className="form-input"
                      placeholder="e.g., 175"
                      min="80"
                      max="250"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="weightKg">
                      <FaBalanceScale className="text-green-500" />
                      Weight (kg)
                    </label>
                    <input
                      id="weightKg"
                      name="weightKg"
                      type="number"
                      value={medical.weightKg}
                      onChange={onChangeMedical}
                      className="form-input"
                      placeholder="e.g., 70"
                      min="20"
                      max="300"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="allergies">
                      <FaAllergies className="text-orange-500" />
                      Allergies
                    </label>
                    <input
                      id="allergies"
                      name="allergies"
                      type="text"
                      value={medical.allergies}
                      onChange={onChangeMedical}
                      className="form-input"
                      placeholder="e.g., Peanuts, Shellfish"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="chronicConditions">
                      <FaUserShield className="text-purple-500" />
                      Chronic Conditions
                    </label>
                    <input
                      id="chronicConditions"
                      name="chronicConditions"
                      type="text"
                      value={medical.chronicConditions}
                      onChange={onChangeMedical}
                      className="form-input"
                      placeholder="Separate multiple conditions with commas"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-dark-900">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="emergencyName">
                      <FaUser className="text-indigo-500" />
                      Contact Name
                    </label>
                    <input
                      id="emergencyName"
                      name="name"
                      type="text"
                      value={emergency.name}
                      onChange={onChangeEmergency}
                      className="form-input"
                      placeholder="Emergency contact name"
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="emergencyPhone">
                      <FaPhoneAlt className="text-teal-500" />
                      Phone Number
                    </label>
                    <input
                      id="emergencyPhone"
                      name="phone"
                      type="tel"
                      value={emergency.phone}
                      onChange={onChangeEmergency}
                      className="form-input"
                      placeholder="e.g., +1-555-123-4567"
                      autoComplete="tel"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="emergencyEmail">
                      <FaEnvelopeOpen className="text-cyan-500" />
                      Email
                    </label>
                    <input
                      id="emergencyEmail"
                      name="email"
                      type="email"
                      value={emergency.email}
                      onChange={onChangeEmergency}
                      className="form-input"
                      placeholder="contact@example.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {error && <div className="error">{error}</div>}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
                  <button type="submit" className="btn btn-primary min-w-48 py-3 text-base" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientSignup;
