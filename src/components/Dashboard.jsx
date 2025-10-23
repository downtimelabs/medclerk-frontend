import React, { useState, useEffect, useMemo } from 'react';
import { FaUser, FaSignOutAlt, FaCloudUploadAlt, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaHome, FaUserMd, FaFileMedical, FaCog, FaChartLine, FaBell, FaDownload, FaEye, FaPlus, FaRobot, FaPaperPlane, FaMicrophone, FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaStethoscope, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = ({ user, selectedLanguage, onLanguageSelect, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [appointments, setAppointments] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    bloodGroup: '',
    heightCm: '',
    weightKg: '',
    gender: ''
  });
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', message: 'Hello! I\'m your AI health assistant. I can help you understand your medical reports and answer health-related questions. How can I help you today?', time: new Date().toLocaleTimeString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const doctors = [
    'Dr. John Smith',
    'Dr. Emily Clark',
    'Dr. Richard Lee',
    'Dr. Priya Sharma'
  ];

  const pendingReports = 3;
  useEffect(() => {
    const stored = localStorage.getItem('patientAppointments');
    if (stored) setAppointments(JSON.parse(stored));
    else setAppointments([
      { id: 'P-2001', date: '2025-09-12', doctor: 'Dr. John Smith', time: '10:30 AM', room: '302B', status: 'Confirmed' },
      { id: 'P-2002', date: '2025-09-16', doctor: 'Dr. Emily Clark', time: '02:15 PM', room: '118', status: 'Pending' },
    ]);
  }, []);
  useEffect(() => {
    localStorage.setItem('patientAppointments', JSON.stringify(appointments));
  }, [appointments]);

  // Load uploaded files from localStorage
  useEffect(() => {
    const storedFiles = localStorage.getItem('uploadedFiles');
    if (storedFiles) {
      setUploadedFiles(JSON.parse(storedFiles));
    }
  }, []);

  // Save uploaded files to localStorage
  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  // Calendar state
  const [viewDate, setViewDate] = useState(new Date());
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 0).getDate();
  const monthDays = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);
  const appointmentDays = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth() + 1;
    return new Set(
      appointments
        .filter(a => {
          const [yy, mm] = a.date.split('-').map(n => parseInt(n, 10));
          return yy === y && mm === m;
        })
        .map(a => parseInt(a.date.split('-')[2], 10))
    );
  }, [appointments, viewDate]);

  const goPrevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ date: '', time: '', doctor: '', room: '' });
  const saveAppointment = (e) => {
    e.preventDefault();
    if (editingId) {
      setAppointments(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a));
    } else {
      const id = `P-${Math.floor(1000 + Math.random()*9000)}`;
      const next = { id, date: form.date, time: form.time, doctor: form.doctor, room: form.room || 'TBD', status: 'Pending' };
      setAppointments(prev => [next, ...prev]);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ date: '', time: '', doctor: '', room: '' });
  };

  const onEdit = (a) => {
    setForm({ date: a.date, time: a.time, doctor: a.doctor, room: a.room });
    setEditingId(a.id);
    setIsModalOpen(true);
  };

  const onCancel = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const handleUploadReport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
    input.multiple = true; // Allow multiple file selection
    input.onchange = async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        setIsUploading(true);
        
        try {
          // Process each file
          for (const file of files) {
            // Convert file to base64 for storage (in a real app, you'd upload to a server)
            const reader = new FileReader();
            reader.onload = () => {
              const fileData = {
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toISOString(),
                data: reader.result // base64 data
              };
              
              setUploadedFiles(prev => [...prev, fileData]);
            };
            reader.readAsDataURL(file);
          }
          
          // Simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          alert(`Successfully uploaded ${files.length} file(s)!`);
        } catch (error) {
          alert('Upload failed. Please try again.');
        } finally {
          setIsUploading(false);
        }
      }
    };
    input.click();
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dob: user?.dob || '',
      bloodGroup: user?.patientProfile?.bloodGroup || '',
      heightCm: user?.patientProfile?.heightCm || '',
      weightKg: user?.patientProfile?.weightKg || '',
      gender: user?.patientProfile?.gender || ''
    });
  };

  const handleSaveProfile = () => {
    // Update user data
    const updatedUser = {
      ...user,
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      dob: editFormData.dob,
      patientProfile: {
        ...user?.patientProfile,
        bloodGroup: editFormData.bloodGroup,
        heightCm: editFormData.heightCm,
        weightKg: editFormData.weightKg,
        gender: editFormData.gender
      }
    };
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update parent component (if needed)
    if (onProfileComplete) {
      onProfileComplete(updatedUser);
    }
    
    setIsEditingProfile(false);
    setShowProfileModal(false);
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditFormData({
      name: '',
      email: '',
      phone: '',
      dob: '',
      bloodGroup: '',
      heightCm: '',
      weightKg: '',
      gender: ''
    });
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: chatInput,
      time: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your recent blood test, your glucose levels are within normal range. However, I recommend maintaining a balanced diet and regular exercise.",
        "Your X-ray results show no abnormalities. The slight inflammation mentioned in your report is common and should resolve with the prescribed medication.",
        "I notice you have a new lab report. The cholesterol levels are slightly elevated. Consider reducing saturated fats in your diet and increasing omega-3 rich foods.",
        "Your blood pressure readings look good overall. The medication seems to be working effectively. Continue taking it as prescribed.",
        "I can help you understand any specific values in your reports. Feel free to ask about particular test results or symptoms you're experiencing.",
        "Your recent appointment notes indicate good progress in your recovery. Make sure to follow up with Dr. Smith as scheduled."
      ];
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString()
      };

      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    "What do my latest blood test results mean?",
    "Are there any concerning values in my reports?",
    "What should I do about my blood pressure?",
    "Can you explain my X-ray results?"
  ];

  const quickActions = [
    { id: 1, name: 'Upload New Report', icon: FaCloudUploadAlt, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200', action: handleUploadReport },
    { id: 2, name: 'Schedule Appointment', icon: FaCalendarAlt, color: 'bg-green-100 text-green-700 hover:bg-green-200', action: () => setIsModalOpen(true) },
    { id: 3, name: 'View All Reports', icon: FaEye, color: 'bg-purple-100 text-purple-700 hover:bg-purple-200', action: () => setActiveSection('reports') },
    { id: 4, name: 'Health Analytics', icon: FaChartLine, color: 'bg-orange-100 text-orange-700 hover:bg-orange-200', action: () => setActiveSection('analytics') }
  ];

  const recentActivity = [
    { id: 1, type: 'upload', message: 'Blood test results uploaded', time: '2 hours ago', icon: FaCloudUploadAlt },
    { id: 2, type: 'appointment', message: 'Appointment with Dr. Smith confirmed', time: '1 day ago', icon: FaCalendarAlt },
    { id: 3, type: 'report', message: 'X-ray analysis completed', time: '3 days ago', icon: FaFileMedical }
  ];

  const notifications = [
    { id: 1, message: 'Your appointment reminder for tomorrow', type: 'reminder', time: '1 hour ago' },
    { id: 2, message: 'New lab results available', type: 'results', time: '3 hours ago' },
    { id: 3, message: 'Prescription refill due', type: 'prescription', time: '1 day ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex text-gray-700 dark:text-gray-300">
      {/* Sidebar */}
      <aside className="w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen px-4 pt-4 pb-4 flex flex-col shadow-lg">
<<<<<<< HEAD:src/components/Dashboard.jsx
        <div className="flex items-center mb-8">
          <img 
            src="/logo1.jpg" 
            alt="MedClerk Logo" 
            className="h-16 w-26 object-contain cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => {
              const dashboardRoute = user?.role === 'doctor' ? '/doctor' : '/dashboard';
              window.location.href = dashboardRoute;
            }}
            title="Go to Dashboard"
          />
=======
        <div className="flex items-center mb-4">
          <img src="/logo1.jpg" alt="MedClerk Logo" className="h-16 w-26 object-contain" />
        </div>
        {/* Username card */}
        <div className="mb-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-blue-200 dark:border-blue-600 grid place-items-center text-blue-600 dark:text-blue-400">
              <FaUser />
            </div>
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate" title={user?.name || 'User'}>
            {user?.name || 'User'}
          </div>
>>>>>>> a829cb605530d43de74cb6dc976d1d49486c13ee:Frontend/src/components/Dashboard.jsx
        </div>
        
        {/* Navigation - Remove settings from here */}
        <nav className="space-y-1 flex-1">
          {[
            { id: 'overview', name: 'Overview', icon: FaHome },
            { id: 'uploads', name: 'Uploads', icon: FaCloudUploadAlt, badge: uploadedFiles.length, route: '/uploads' },
            { id: 'appointments', name: 'Appointments', icon: FaCalendarAlt, badge: appointments.length, route: '/appointments' },
            { id: 'doctors', name: 'Doctors', icon: FaUserMd, isExternalLink: true },
            { id: 'reports', name: 'Reports', icon: FaFileMedical, badge: uploadedFiles.length, route: '/reports' },
<<<<<<< HEAD:src/components/Dashboard.jsx
            { id: 'settings', name: 'Settings', icon: FaCog }
=======
            { id: 'settings', name: 'Settings', icon: FaCog, route: '/settings' }
>>>>>>> a829cb605530d43de74cb6dc976d1d49486c13ee:Frontend/src/components/Dashboard.jsx
          ].map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${
                  isActive 
                    ? 'bg-primary-500 text-white' 
                    : 'hover:bg-blue-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => {
                  if (item.route) {
                    navigate(item.route);
<<<<<<< HEAD:src/components/Dashboard.jsx
=======
                  } else if (item.isExternalLink) {
                    navigate('/doctors');
>>>>>>> a829cb605530d43de74cb6dc976d1d49486c13ee:Frontend/src/components/Dashboard.jsx
                  } else {
                    setActiveSection(item.id);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-600 dark:to-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  } flex items-center justify-center`}>
                    <Icon className={`transition-all duration-300 ${isActive ? 'text-lg' : 'text-base hover:text-lg'}`} />
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : item.id === 'uploads' ? 'bg-orange-500 text-white' : 'bg-primary-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
      </div>
            );
          })}
        </nav>
        <button className="btn btn-secondary mt-auto" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
      </aside>

      {/* Main content */}
      <div className="flex-1">
<<<<<<< HEAD:src/components/Dashboard.jsx
        {/* Navbar */}
=======
        {/* Enhanced navbar with notifications */}
>>>>>>> a829cb605530d43de74cb6dc976d1d49486c13ee:Frontend/src/components/Dashboard.jsx
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Profile Button & Dropdown */}
                <div className="relative">
                  <button 
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setShowProfile(!showProfile)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <FaUser className="text-white text-lg" />
                    </div>
                    <span className="text-sm font-medium hidden md:block">{user?.name}</span>
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <FaUser className="text-white text-xl" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{user?.name}</div>
                            <div className="text-sm text-gray-500">{user?.email}</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button 
                          onClick={() => {
                            setShowProfile(false);
                            setShowProfileModal(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                        >
                          <FaUser className="text-gray-500" />
                          View Profile
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                        >
                          <FaSignOutAlt className="text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notifications Button */}
                <div className="relative">
                  <button 
                    className="p-2 rounded-lg hover:bg-gray-50 transition-colors relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <FaBell className="text-gray-600" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map(notif => (
                          <div key={notif.id} className="p-3 border-b border-gray-50 hover:bg-gray-25 transition-colors">
                            <div className="text-sm text-gray-800">{notif.message}</div>
                            <div className="text-xs text-gray-500 mt-1">{notif.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
               
              </div>
            </div>
        </div>
        
<<<<<<< HEAD:src/components/Dashboard.jsx
        {/* Content area */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
          {/* Welcome section */}
=======
        {/* Content area with padding */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
          {/* Enhanced welcome section */}
>>>>>>> a829cb605530d43de74cb6dc976d1d49486c13ee:Frontend/src/components/Dashboard.jsx
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 mb-8 shadow-sm relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
                    Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
                  </h1>
                  <span className="text-3xl">👋</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-base mb-6">Manage your medical reports and health information</p>
                
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Last visit:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Dec 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Health Score:</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">85/100</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <FaUser className="text-4xl text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'TOTAL REPORTS', value: '4', icon: FaFileMedical, iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400', change: '+5 this week', changeColor: 'text-blue-600', arrow: '↗' },
              { label: 'THIS MONTH', value: '0', icon: FaCalendarAlt, iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400', change: '+3 from last month', changeColor: 'text-green-600', arrow: '↗' },
              { label: 'AI ANSWERS', value: '3', icon: FaChartLine, iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400', change: '94% accuracy', changeColor: 'text-purple-600', arrow: '↗' },
              { label: 'ALERTS', value: '1', icon: FaBell, iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400', change: 'Requires attention', changeColor: 'text-red-600', arrow: '⚠' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                      <Icon className={`${stat.iconColor} text-lg`} />
    
                    </div>
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">{stat.label}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">{stat.value}</div>
                  <div className={`text-xs font-medium ${stat.changeColor} flex items-center gap-1`}>
                    <span className="text-sm">{stat.arrow}</span>
                    {stat.change}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Appointment Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm grid place-items-center p-4 z-50">
              <div className="bg-white border border-gray-100 rounded-xl p-5 w-full max-w-md shadow-lg">
              <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-gray-800">Book an appointment</div>
                  <button className="btn btn-link" onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
                <form onSubmit={saveAppointment} className="grid gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" className="form-input" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input type="time" className="form-input" value={form.time} onChange={(e)=>setForm({...form, time:e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                    <select className="form-input" value={form.doctor} onChange={(e)=>setForm({...form, doctor:e.target.value})} required>
                      <option value="" disabled>Select doctor</option>
                      {doctors.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room (optional)</label>
                    <input type="text" placeholder="e.g., 302B" className="form-input" value={form.room} onChange={(e)=>setForm({...form, room:e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">{editingId ? 'Update appointment' : 'Save appointment'}</button>
                </form>
              </div>
            </div>
          )}

          {/* Conditional Section Rendering */}
          {activeSection === 'overview' && (
            <>
            </>
          )}

<<<<<<< HEAD:src/components/Dashboard.jsx
          {/* Uploads Section */}
          {activeSection === 'uploads' && (
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Upload Reports</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Upload and manage your medical reports</p>
                </div>
                <button
                  onClick={handleUploadReport}
                  disabled={isUploading}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="spinner"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaCloudUploadAlt />
                      Upload New Report
                    </>
                  )}
                </button>
              </div>

              {/* Upload Area */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCloudUploadAlt className="text-4xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Upload Your Medical Reports</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                    Drag and drop your medical files here, or click the button above to browse and select files. 
                    Supported formats: PDF, JPG, PNG, DOC, DOCX
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Secure & Private
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      AI Analysis
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Easy Organization
                    </span>
                  </div>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Uploaded Reports ({uploadedFiles.length})</h3>
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <FaFileMedical className="text-blue-600 dark:text-blue-400 text-xl" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{file.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              // Create download link
                              const link = document.createElement('a');
                              link.href = file.data;
                              link.download = file.name;
                              link.click();
                            }}
                            className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Download"
                          >
                            <FaDownload />
                          </button>
                          <button
                            onClick={() => {
                              // Open file in new tab
                              const newWindow = window.open();
                              newWindow.document.write(`
                                <html>
                                  <head><title>${file.name}</title></head>
                                  <body style="margin:0; padding:20px;">
                                    <iframe src="${file.data}" width="100%" height="100%" style="border:none;"></iframe>
                                  </body>
                                </html>
                              `);
                            }}
                            className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => {
                              setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
                              localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles.filter(f => f.id !== file.id)));
                            }}
                            className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {uploadedFiles.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaFileMedical className="text-2xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Reports Uploaded Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Upload your first medical report to get started with AI analysis</p>
                  <button
                    onClick={handleUploadReport}
                    className="btn btn-primary"
                  >
                    <FaCloudUploadAlt />
                    Upload Your First Report
                  </button>
                </div>
              )}
            </div>
          )}
=======
>>>>>>> a829cb605530d43de74cb6dc976d1d49486c13ee:Frontend/src/components/Dashboard.jsx

          {/* Appointments Section */}
          {activeSection === 'appointments' && (
            <div className="space-y-6">
              {/* Section Header */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-3xl p-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <FaCalendarAlt className="text-white text-xl" />
                      </div>
                      Appointments
                    </h2>
                    <p className="text-gray-600 text-lg">Manage your medical appointments and schedules</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full flex items-center justify-center">
                      <span className="text-4xl">📅</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2">
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Calendar</h3>
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
                          onClick={goPrevMonth}
                        >
                          <FaChevronLeft className="text-gray-600" />
                        </button>
                        <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-bold text-lg">
                          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </div>
                        <button 
                          className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
                          onClick={goNextMonth}
                        >
                          <FaChevronRight className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center mb-4">
                      {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map((d) => (
                        <div key={d} className="text-sm font-bold text-gray-500 py-3">{d.slice(0,3)}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center">
                      {monthDays.map((d) => (
                        <div 
                          key={d} 
                          className={`py-4 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                            appointmentDays.has(d) 
                              ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg transform scale-105' 
                              : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm hover:scale-105'
                          }`}
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Appointments List */}
                <div className="space-y-4">
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800">Upcoming</h3>
                      <button 
                        className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 transition-colors"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {appointments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FaCalendarAlt className="text-3xl mb-3 mx-auto opacity-50" />
                          <p>No appointments scheduled</p>
                          <button 
                            className="mt-3 text-green-600 hover:text-green-700 font-medium"
                            onClick={() => setIsModalOpen(true)}
                          >
                            Schedule your first appointment
                          </button>
                        </div>
                      ) : (
                        appointments.map((a) => (
                          <div key={a.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-3">
                              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                a.status==='Confirmed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {a.status}
                              </span>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  className="p-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-xs px-2"
                                  onClick={() => onEdit(a)}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="p-1 rounded-lg bg-red-500 text-white hover:bg-red-600 text-xs px-2"
                                  onClick={() => onCancel(a.id)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                            <div className="text-gray-800 font-bold text-lg">{a.doctor}</div>
                            <div className="text-gray-600 font-medium">{a.date} at {a.time}</div>
                            <div className="text-gray-500 text-sm">Room {a.room}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button 
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <FaPlus />
                        New Appointment
                      </button>
                      <button 
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                        onClick={handleUploadReport}
                      >
                        <FaCloudUploadAlt />
                        Upload Report
                      </button>
                      <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                        <FaBell />
                        Reminders
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Section */}
          {activeSection === 'reports' && (
            <div className="space-y-6">
              {/* Section Header */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 border border-purple-200 rounded-3xl p-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <FaFileMedical className="text-white text-xl" />
                      </div>
                      Medical Reports
                    </h2>
                    <p className="text-gray-600 text-lg">View and analyze your medical reports with AI insights</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-indigo-300 rounded-full flex items-center justify-center">
                      <span className="text-4xl">📊</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis Summary */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">AI Health Summary</h3>
                  <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    <FaRobot />
                    <span>AI Powered</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <h4 className="font-bold text-gray-800">Normal Values</h4>
                    </div>
                    <p className="text-gray-600 text-sm">Most recent blood work shows normal glucose and cholesterol levels.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">!</span>
                      </div>
                      <h4 className="font-bold text-gray-800">Watch</h4>
                    </div>
                    <p className="text-gray-600 text-sm">Blood pressure slightly elevated. Consider lifestyle changes.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                        <FaChartLine className="text-white text-sm" />
                      </div>
                      <h4 className="font-bold text-gray-800">Trends</h4>
                    </div>
                    <p className="text-gray-600 text-sm">Overall health metrics showing positive improvement trend.</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="font-bold text-gray-800 mb-2">AI Recommendations</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Continue current medication regimen for blood pressure
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Schedule follow-up cholesterol check in 3 months
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Consider adding cardiovascular exercise routine
                    </li>
                  </ul>
                </div>
              </div>

              {/* Reports List */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Report History</h3>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50">
                      Filter
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50">
                      Export
                    </button>
                  </div>
                </div>
                
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaFileMedical className="text-2xl text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">No reports available</h4>
                    <p>Upload your medical reports to see AI analysis and insights</p>
                    <button 
                      className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-xl hover:bg-purple-600 transition-colors"
                      onClick={() => setActiveSection('uploads')}
                    >
                      Upload Reports
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                              <span className="text-2xl">
                                {file.type.includes('pdf') ? '📄' : 
                                 file.type.includes('image') ? '🖼️' : 
                                 file.type.includes('doc') ? '📝' : '📋'}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-800">{file.name}</h4>
                              <p className="text-gray-500 text-sm">
                                Uploaded on {new Date(file.uploadDate).toLocaleDateString()} • {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  Analyzed
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  Normal Range
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">
                              <FaEye />
                            </button>
                            <button className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                              <FaRobot />
                            </button>
                            <button 
                              className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = file.data;
                                link.download = file.name;
                                link.click();
                              }}
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">AI Analysis Summary</h5>
                          <p className="text-gray-600 text-sm mb-3">
                            Blood glucose: 95 mg/dL (Normal) • Cholesterol: 180 mg/dL (Good) • Blood pressure: 125/82 mmHg (Slightly elevated)
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-green-600">✓ 8 values normal</span>
                            <span className="text-yellow-600">⚠ 1 value elevated</span>
                            <span className="text-gray-600">📈 Trend: Improving</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              {/* Section Header */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-100 border border-gray-200 rounded-3xl p-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
                        <FaCog className="text-white text-xl" />
                      </div>
                      Settings
                    </h2>
                    <p className="text-gray-600 text-lg">Manage your account and application preferences</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-slate-300 rounded-full flex items-center justify-center">
                      <span className="text-4xl">⚙️</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                    <FaUser className="text-gray-600 dark:text-gray-400" />
                    Profile Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20" 
                        value={user?.name || ''} 
                        readOnly 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20" 
                        value={user?.email || ''} 
                        readOnly 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" 
                        value={user?.role || 'Patient'} 
                        readOnly 
                      />
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all">
                      Update Profile
                    </button>
                  </div>
                </div>

                {/* Medical Profile */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaFileMedical className="text-gray-600" />
                    Medical Profile
                  </h3>
                  
                  {user?.patientProfile ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" 
                            value={user.patientProfile.bloodGroup || 'Not set'} 
                            readOnly 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" 
                            value={user.patientProfile.heightCm ? `${user.patientProfile.heightCm} cm` : 'Not set'} 
                            readOnly 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
                        <div className="flex flex-wrap gap-2">
                          {user.patientProfile.chronicConditions?.length > 0 ? (
                            user.patientProfile.chronicConditions.map((condition, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                {condition}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">None specified</span>
                          )}
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all">
                        Update Medical Profile
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FaFileMedical className="text-3xl mb-3 mx-auto opacity-50" />
                      <p>No medical profile found</p>
                      <button className="mt-3 text-green-600 hover:text-green-700 font-medium">
                        Create Medical Profile
                      </button>
                    </div>
                  )}
                </div>

                {/* App Preferences */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaCog className="text-gray-600" />
                    Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
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
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">SMS Reminders</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={isDarkMode}
                          onChange={(e) => {
                            console.log('Dark mode toggle clicked:', e.target.checked);
                            toggleDarkMode();
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Account Actions</h3>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                      <FaDownload />
                      Export Data
                    </button>
                    <button className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all">
                      Change Password
                    </button>
                    <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all">
                      Delete Account
                    </button>
                    <button 
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Modal */}
          {showProfileModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm grid place-items-center p-4 z-50">
              <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-800">Profile Details</h3>
                  <div className="flex items-center gap-3">
                    {!isEditingProfile && (
                      <button 
                        onClick={handleEditProfile}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                    <button 
                      className="text-gray-400 hover:text-gray-600 p-2"
                      onClick={() => {
                        setShowProfileModal(false);
                        setIsEditingProfile(false);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow">
                  <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Full Name</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">{user?.name || 'Not set'}</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Email</label>
                        {isEditingProfile ? (
                          <input
                            type="email"
                            value={editFormData.email}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">{user?.email || 'Not set'}</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Phone</label>
                        {isEditingProfile ? (
                          <input
                            type="tel"
                            value={editFormData.phone}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">{user?.phone || 'Not set'}</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Date of Birth</label>
                        {isEditingProfile ? (
                          <input
                            type="date"
                            value={editFormData.dob}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, dob: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">{user?.dob || 'Not set'}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Medical Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Blood Group</label>
                        {isEditingProfile ? (
                          <select
                            value={editFormData.bloodGroup}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
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
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">{user?.patientProfile?.bloodGroup || 'Not set'}</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Height (cm)</label>
                        {isEditingProfile ? (
                          <input
                            type="number"
                            value={editFormData.heightCm}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, heightCm: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                            placeholder="Enter height in cm"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">{user?.patientProfile?.heightCm ? `${user.patientProfile.heightCm} cm` : 'Not set'}</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Weight (kg)</label>
                        {isEditingProfile ? (
                          <input
                            type="number"
                            value={editFormData.weightKg}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, weightKg: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                            placeholder="Enter weight in kg"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">{user?.patientProfile?.weightKg ? `${user.patientProfile.weightKg} kg` : 'Not set'}</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Gender</label>
                        {isEditingProfile ? (
                          <select
                            value={editFormData.gender}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, gender: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">{user?.patientProfile?.gender || 'Not set'}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Additional Medical Information */}
                    {(() => {
                      const allergies = user?.patientProfile?.allergies;
                      const chronicConditions = user?.patientProfile?.chronicConditions;
                      
                      // Handle both array and string formats
                      const allergiesList = Array.isArray(allergies) ? allergies : 
                                         (typeof allergies === 'string' && allergies.trim()) ? [allergies] : [];
                      const conditionsList = Array.isArray(chronicConditions) ? chronicConditions : 
                                           (typeof chronicConditions === 'string' && chronicConditions.trim()) ? [chronicConditions] : [];
                      
                      return (allergiesList.length > 0 || conditionsList.length > 0) && (
                        <div className="mt-6 space-y-4">
                          {allergiesList.length > 0 && (
                            <div>
                              <h5 className="text-md font-semibold text-gray-700 mb-2">Allergies</h5>
                              <div className="flex flex-wrap gap-2">
                                {allergiesList.map((allergy, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                    {allergy}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {conditionsList.length > 0 && (
                            <div>
                              <h5 className="text-md font-semibold text-gray-700 mb-2">Chronic Conditions</h5>
                              <div className="flex flex-wrap gap-2">
                                {conditionsList.map((condition, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                    {condition}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    
                    {/* Emergency Contact */}
                    {user?.patientProfile?.emergencyContact && (
                      <div className="mt-6">
                        <h5 className="text-md font-semibold text-gray-700 mb-2">Emergency Contact</h5>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-500">Name</div>
                              <div className="font-medium text-gray-900">{user.patientProfile.emergencyContact.name || 'Not set'}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Phone</div>
                              <div className="font-medium text-gray-900">{user.patientProfile.emergencyContact.phone || 'Not set'}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Relationship</div>
                              <div className="font-medium text-gray-900">{user.patientProfile.emergencyContact.relationship || 'Not set'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  </div>
                  
                  {/* Edit Mode Buttons */}
                  {isEditingProfile && (
                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                      <button
                        onClick={handleCancelEdit}
                        className="px-6 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer - single instance */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm bg-gray-50 px-4 py-2 rounded-full inline-block">
              Language: {selectedLanguage?.toUpperCase()} | Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
