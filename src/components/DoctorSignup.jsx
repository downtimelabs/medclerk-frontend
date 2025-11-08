import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaIdBadge, FaGraduationCap, FaHospitalAlt, FaClock } from 'react-icons/fa';
import { register } from '../services/authService';

const specializations = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician',
  'Orthopedic', 'Psychiatrist', 'Oncologist', 'Gynecologist', 'ENT Specialist'
];

const DoctorSignup = ({ onAuthSuccess }) => {
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


  const [professional, setProfessional] = useState({
    licenseNumber: '',
    specialization: '',
    clinicName: '',
    yearsExperience: ''
  });

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });

  const [clinicAddress, setClinicAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });

  const onChangeBasic = (e) => {
    setBasic({ ...basic, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const onChangeProfessional = (e) => {
    setProfessional({ ...professional, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const validate = () => {
    const name = basic.name.trim();
    const email = basic.email.trim();
    const pwd = basic.password;
    const cpwd = basic.confirmPassword;
    const license = professional.licenseNumber.trim();
    const clinic = professional.clinicName.trim();
    const years = parseInt(professional.yearsExperience, 10);

    if (!name) return 'Full name is required';
    if (!email) return 'Email is required';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRe.test(email)) return 'Please enter a valid email address';
    if (!pwd) return 'Password is required';
    if (pwd.length < 8 || !/[A-Za-z]/.test(pwd) || !/\d/.test(pwd)) return 'Password must be at least 8 characters and include letters and numbers';
    if (pwd !== cpwd) return 'Passwords do not match';
    if (!license) return 'License number is required';
    const licRe = /^[A-Za-z0-9-]{3,}$/;
    if (!licRe.test(license)) return 'License number should be alphanumeric';
    if (!professional.specialization) return 'Specialization is required';
    if (!clinic) return 'Clinic/Hospital name is required';
    if (isNaN(years)) return 'Years of experience must be a number';
    if (years < 0 || years > 60) return 'Years of experience must be between 0 and 60';
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
      const clampedYears = Math.max(0, Math.min(60, professional.yearsExperience ? parseInt(professional.yearsExperience, 10) : 0));
      
      const response = await register({
        email: basic.email.trim(),
        password: basic.password,
        confirmPassword: basic.password,
        name: basic.name.trim(),
        role: 'DOCTOR',
        address: {
          street: address.street || '00',
          city: address.city || 'City',
          state: address.state || 'State',
          country: address.country || 'India',
          postalCode: address.postalCode || '000000'
        },
        doctorProfile: {
          licenseNumber: professional.licenseNumber.trim(),
          specialization: professional.specialization,
          clinicName: professional.clinicName.trim(),
          yearsOfExperience: clampedYears,
          clinicAddress: {
            street: clinicAddress.street || '00',
            city: clinicAddress.city || 'City',
            state: clinicAddress.state || 'State',
            country: clinicAddress.country || 'India',
            postalCode: clinicAddress.postalCode || '000000'
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
        <header className="flex items-center justify-between px-4 py-2 sticky top-0 z-40 bg-white/95 shadow-md">
          <div className="py-0 ml-4">
            <img src="/logo1.jpg" alt="MedClerk Logo" className="h-12 md:h-14 object-contain" />
          </div>
          <button 
            onClick={() => navigate('/auth')}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
          >
            Sign In
          </button>
        </header>

        <main className="flex-1 p-5">
          <div className="max-w-3xl mx-auto">
            <div className="text-left mb-6">
              <h1 className="text-3xl font-bold text-dark-900 mb-2">Create Doctor Account</h1>
              <p className="text-dark-500">Join MedClerk as a doctor and manage your patients</p>
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

                <h3 className="text-lg font-semibold text-dark-900">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="licenseNumber">
                      <FaIdBadge className="text-purple-500" />
                      License Number
                    </label>
                    <input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      value={professional.licenseNumber}
                      onChange={onChangeProfessional}
                      className="form-input"
                      placeholder="e.g., MD12345678"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="specialization">
                      <FaGraduationCap className="text-green-500" />
                      Specialization
                    </label>
                    <select
                      id="specialization"
                      name="specialization"
                      value={professional.specialization}
                      onChange={onChangeProfessional}
                      className="form-input"
                      required
                    >
                      <option value="">Select Specialization</option>
                      {specializations.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="clinicName">
                      <FaHospitalAlt className="text-indigo-500" />
                      Clinic/Hospital Name
                    </label>
                    <input
                      id="clinicName"
                      name="clinicName"
                      type="text"
                      value={professional.clinicName}
                      onChange={onChangeProfessional}
                      className="form-input"
                      placeholder="e.g., Heart Care Medical Center"
                      autoComplete="organization"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-dark-700" htmlFor="yearsExperience">
                      <FaClock className="text-orange-500" />
                      Years of Experience
                    </label>
                    <input
                      id="yearsExperience"
                      name="yearsExperience"
                      type="number"
                      value={professional.yearsExperience}
                      onChange={onChangeProfessional}
                      className="form-input"
                      placeholder="e.g., 15"
                      min="0"
                      max="60"
                      inputMode="numeric"
                      required
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

export default DoctorSignup;
