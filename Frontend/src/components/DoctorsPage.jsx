import React, { useState } from 'react';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaUserMd, 
  FaStar, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaArrowLeft,
  FaStethoscope,
  FaHeart,
  FaBrain,
  FaBone,
  FaLungs,
  FaClock
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useTheme } from '../contexts/ThemeContext';

const DoctorsPage = ({ user, selectedLanguage, onLanguageSelect, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form, setForm] = useState({ date: '', time: '', doctor: '', room: '' });

  // Enhanced doctors data with specialties and details
  const doctorsData = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      rating: 4.9,
      experience: '15 years',
      location: 'Heart Care Center',
      phone: '+1-555-0123',
      email: 'sarah.johnson@heartcare.com',
      avatar: '👩‍⚕️',
      specializes: ['Heart Disease', 'Hypertension', 'High Cholesterol'],
      icon: FaHeart,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      description: 'Specialist in cardiovascular diseases with expertise in preventive cardiology and heart disease management.',
      education: 'MD from Harvard Medical School',
      languages: ['English', 'Spanish'],
      availability: 'Mon-Fri: 9AM-5PM',
      consultationFee: '$200'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Endocrinology',
      rating: 4.8,
      experience: '12 years',
      location: 'Diabetes & Hormone Clinic',
      phone: '+1-555-0124',
      email: 'michael.chen@diabetes.com',
      avatar: '👨‍⚕️',
      specializes: ['Diabetes', 'Thyroid Disorders', 'Metabolic Syndrome'],
      icon: FaStethoscope,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Expert in diabetes management and endocrine disorders with focus on personalized treatment plans.',
      education: 'MD from Johns Hopkins University',
      languages: ['English', 'Mandarin'],
      availability: 'Mon-Wed: 8AM-4PM',
      consultationFee: '$180'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pulmonology',
      rating: 4.7,
      experience: '10 years',
      location: 'Respiratory Health Institute',
      phone: '+1-555-0125',
      email: 'emily.rodriguez@respiratory.com',
      avatar: '👩‍⚕️',
      specializes: ['Asthma', 'COPD', 'Lung Diseases'],
      icon: FaLungs,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      description: 'Pulmonologist specializing in asthma, COPD, and comprehensive respiratory care.',
      education: 'MD from Stanford University',
      languages: ['English', 'Spanish'],
      availability: 'Tue-Thu: 10AM-6PM',
      consultationFee: '$160'
    },
    {
      id: 4,
      name: 'Dr. David Wilson',
      specialty: 'Rheumatology',
      rating: 4.6,
      experience: '18 years',
      location: 'Joint & Bone Care Center',
      phone: '+1-555-0126',
      email: 'david.wilson@jointcare.com',
      avatar: '👨‍⚕️',
      specializes: ['Arthritis', 'Joint Pain', 'Autoimmune Disorders'],
      icon: FaBone,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Rheumatologist with extensive experience in arthritis treatment and joint health management.',
      education: 'MD from Mayo Clinic College of Medicine',
      languages: ['English'],
      availability: 'Mon-Fri: 9AM-3PM',
      consultationFee: '$220'
    },
    {
      id: 5,
      name: 'Dr. Lisa Thompson',
      specialty: 'Psychiatry',
      rating: 4.8,
      experience: '14 years',
      location: 'Mental Health Center',
      phone: '+1-555-0127',
      email: 'lisa.thompson@mentalhealth.com',
      avatar: '👩‍⚕️',
      specializes: ['Depression', 'Anxiety', 'Mental Health'],
      icon: FaBrain,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Psychiatrist specializing in depression, anxiety disorders, and comprehensive mental health care.',
      education: 'MD from UCLA School of Medicine',
      languages: ['English', 'French'],
      availability: 'Mon-Fri: 11AM-7PM',
      consultationFee: '$190'
    },
    {
      id: 6,
      name: 'Dr. Robert Kumar',
      specialty: 'General Practice',
      rating: 4.5,
      experience: '20 years',
      location: 'Family Health Clinic',
      phone: '+1-555-0128',
      email: 'robert.kumar@familyhealth.com',
      avatar: '👨‍⚕️',
      specializes: ['General Health', 'Preventive Care', 'Health Checkups'],
      icon: FaUserMd,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'General practitioner providing comprehensive primary care and preventive health services.',
      education: 'MD from University of Michigan',
      languages: ['English', 'Hindi'],
      availability: 'Mon-Sat: 8AM-6PM',
      consultationFee: '$150'
    }
  ];

  // Smart doctor recommendations based on patient's health conditions
  const getRecommendedDoctors = () => {
    if (!user?.patientProfile?.chronicConditions) {
      return doctorsData.slice(0, 3); // Default recommendations
    }

    const conditions = user.patientProfile.chronicConditions;
    const recommended = [];
    const remaining = [];

    doctorsData.forEach(doctor => {
      const hasMatchingSpecialty = conditions.some(condition => 
        doctor.specializes.some(specialty => 
          specialty.toLowerCase().includes(condition.toLowerCase()) ||
          condition.toLowerCase().includes(specialty.toLowerCase())
        )
      );
      
      if (hasMatchingSpecialty) {
        recommended.push({ ...doctor, isRecommended: true });
      } else {
        remaining.push({ ...doctor, isRecommended: false });
      }
    });

    // Sort recommended by rating, then add remaining doctors
    recommended.sort((a, b) => b.rating - a.rating);
    remaining.sort((a, b) => b.rating - a.rating);
    
    return [...recommended, ...remaining];
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setForm({ ...form, doctor: doctor.name });
    setIsModalOpen(true);
  };

  const saveAppointment = (e) => {
    e.preventDefault();
    // Here you would typically save to localStorage or send to API
    const appointment = {
      id: `A-${Math.floor(1000 + Math.random()*9000)}`,
      date: form.date,
      time: form.time,
      doctor: form.doctor,
      room: form.room || 'TBD',
      status: 'Pending'
    };
    
    // Save to localStorage (similar to dashboard logic)
    const existingAppointments = JSON.parse(localStorage.getItem('patientAppointments') || '[]');
    localStorage.setItem('patientAppointments', JSON.stringify([appointment, ...existingAppointments]));
    
    alert('Appointment booked successfully!');
    setIsModalOpen(false);
    setForm({ date: '', time: '', doctor: '', room: '' });
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 text-gray-700 dark:text-gray-300">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200 px-6 py-4 shadow-xl sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
            <div className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {t('app_brand')}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              className="appearance-none bg-white/80 text-gray-700 border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm cursor-pointer focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500 focus:ring-opacity-15 transition-all"
              value={selectedLanguage || 'en'}
              onChange={(e) => onLanguageSelect?.(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="ru">Русский</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="ar">العربية</option>
              <option value="hi">हिंदी</option>
            </select>
            <button className="btn btn-secondary px-4 py-2 text-sm hover:shadow-lg transition-all" onClick={handleLogout}>
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-3xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <FaUserMd className="text-white text-2xl" />
                </div>
                Find Your Doctor
              </h1>
              <p className="text-gray-600 text-xl mb-4">Recommended specialists based on your health profile</p>
              {user?.patientProfile?.chronicConditions?.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-600 font-medium">Your conditions:</span>
                  <div className="flex flex-wrap gap-2">
                    {user.patientProfile.chronicConditions.map((condition, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full flex items-center justify-center">
                <span className="text-6xl">🩺</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Available Doctors', value: doctorsData.length, icon: FaUserMd, color: 'from-blue-500 to-blue-600' },
            { label: 'Specialties', value: '15+', icon: FaStethoscope, color: 'from-green-500 to-green-600' },
            { label: 'Avg Rating', value: '4.7', icon: FaStar, color: 'from-yellow-500 to-yellow-600' },
            { label: 'Response Time', value: '< 2hrs', icon: FaClock, color: 'from-purple-500 to-purple-600' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="text-white text-lg" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Recommended Doctors */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Recommended for You</h2>
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Smart Match</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {getRecommendedDoctors().map((doctor) => {
              const Icon = doctor.icon;
              return (
                <div 
                  key={doctor.id} 
                  className={`${doctor.bgColor} border border-gray-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden`}
                >
                  {doctor.isRecommended && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Recommended
                    </div>
                  )}
                  
                  {/* Doctor Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-r ${doctor.color} rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                      <span>{doctor.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{doctor.name}</h3>
                      <p className="text-gray-600 font-medium">{doctor.specialty}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={`text-sm ${i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{doctor.rating} ({doctor.experience})</span>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Icon className="text-gray-400" />
                      <span>{doctor.specializes.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaClock className="text-gray-400" />
                      <span>{doctor.availability}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {doctor.description}
                  </p>

                  <div className="bg-white/50 rounded-2xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Education:</span>
                        <p className="font-medium text-gray-800">{doctor.education}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Languages:</span>
                        <p className="font-medium text-gray-800">{doctor.languages.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Consultation:</span>
                        <p className="font-medium text-gray-800">{doctor.consultationFee}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Experience:</span>
                        <p className="font-medium text-gray-800">{doctor.experience}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium flex items-center justify-center gap-2"
                      onClick={() => handleBookAppointment(doctor)}
                    >
                      <FaCalendarAlt />
                      Book Appointment
                    </button>
                    <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <FaPhone className="text-gray-600" />
                    </button>
                    <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <FaEnvelope className="text-gray-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm grid place-items-center p-4 z-50">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Book Appointment</h3>
                <p className="text-gray-600 text-sm">with {selectedDoctor?.name}</p>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-600 p-2"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={saveAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input 
                  type="date" 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20" 
                  value={form.date} 
                  onChange={(e)=>setForm({...form, date:e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input 
                  type="time" 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20" 
                  value={form.time} 
                  onChange={(e)=>setForm({...form, time:e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" 
                  value={form.doctor} 
                  readOnly 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room (optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g., 302B" 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20" 
                  value={form.room} 
                  onChange={(e)=>setForm({...form, room:e.target.value})} 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
              >
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
