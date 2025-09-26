import React, { useState, useEffect, useMemo } from 'react';
import { FaUser, FaSignOutAlt, FaCloudUploadAlt, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaHome, FaUserMd, FaFileMedical, FaCog, FaChartLine, FaBell, FaDownload, FaEye, FaPlus, FaRobot, FaPaperPlane, FaMicrophone, FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaStethoscope } from 'react-icons/fa';
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
        <div className="text-xl font-extrabold text-gray-800 dark:text-white mb-4">{t('app_brand')}</div>
        {/* Username card */}
        <div className="mb-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-blue-200 dark:border-blue-600 grid place-items-center text-blue-600 dark:text-blue-400">
              <FaUser />
            </div>
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate" title={user?.name || 'User'}>
            {user?.name || 'User'}
          </div>
        </div>
        <nav className="space-y-1 flex-1">
          {[
            { id: 'overview', name: 'Overview', icon: FaHome },
            { id: 'uploads', name: 'Uploads', icon: FaCloudUploadAlt, badge: uploadedFiles.length },
            { id: 'appointments', name: 'Appointments', icon: FaCalendarAlt, badge: appointments.length },
            { id: 'doctors', name: 'Doctors', icon: FaUserMd, isExternalLink: true },
            { id: 'reports', name: 'Reports', icon: FaFileMedical, badge: uploadedFiles.length },
            { id: 'settings', name: 'Settings', icon: FaCog }
          ].map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105' 
                    : 'hover:bg-blue-50 dark:hover:bg-gray-700 hover:shadow-sm hover:transform hover:scale-102'
                }`}
                onClick={() => item.isExternalLink ? navigate('/doctors') : setActiveSection(item.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-600 dark:to-gray-700 text-blue-600 dark:text-blue-400 shadow-sm hover:shadow-md'
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
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced navbar with notifications */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 mb-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  {t('app_brand')}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Notifications */}
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
          {/* Enhanced welcome section */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 border border-primary-200 dark:border-primary-700 rounded-3xl p-8 mb-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your medical reports and health information</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span>🏥 Last visit: Dec 15, 2024</span>
                  <span>📊 Health Score: 85/100</span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
                  <FaUser className="text-4xl text-primary-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Reports', value: '128', icon: FaFileMedical, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
              { label: 'This Month', value: '12', icon: FaCalendarAlt, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
              { label: 'AI Answers', value: '86', icon: FaChartLine, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
              { label: 'Alerts', value: '2', icon: FaBell, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className={`${stat.bgColor} dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      <Icon className="text-white text-xl group-hover:text-2xl transition-all duration-300" />
                    </div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {idx === 0 && '+5 this week'}
                    {idx === 1 && '+3 from last month'}
                    {idx === 2 && '94% accuracy'}
                    {idx === 3 && 'Requires attention'}
                  </div>
              </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaRobot className="text-white text-sm" />
              </div>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    disabled={action.id === 1 && isUploading}
                    className={`${action.color} shadow-md p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <Icon className="text-3xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 relative z-10" />
                    <div className="font-semibold text-sm relative z-10">
                      {action.id === 1 && isUploading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </div>
                      ) : action.name}
                    </div>
                  </button>
                );
              })}
              </div>
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
          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Center Column - AI Chat Bot & Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* AI Chat Bot */}
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                    <FaRobot className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      AI Health Assistant
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ask about your reports & health</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chat Messages */}
                  <div className="lg:col-span-2">
                    <div className="h-80 overflow-y-auto mb-4 space-y-3 bg-gray-50 rounded-2xl p-4">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs p-3 rounded-2xl ${
                            msg.type === 'user' 
                              ? 'bg-primary-500 text-white' 
                              : 'bg-white border border-gray-200 text-gray-800'
                          }`}>
                            <div className="text-sm">{msg.message}</div>
                            <div className={`text-xs mt-1 ${msg.type === 'user' ? 'text-primary-100' : 'text-gray-500'}`}>
                              {msg.time}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-2xl">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about your health or reports..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 text-sm"
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim() || isTyping}
                        className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FaPaperPlane className="text-sm" />
                      </button>
                    </form>
                  </div>

                  {/* Quick Questions */}
                  <div className="lg:col-span-1">
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Quick Questions</p>
                      <div className="space-y-2">
                        {quickQuestions.map((question, idx) => (
                          <button
                            key={idx}
                            onClick={() => setChatInput(question)}
                            className="w-full text-left text-xs p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <FaClock className="text-white text-sm" />
                  </div>
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    const colors = [
                      'from-blue-500 to-blue-600',
                      'from-green-500 to-green-600', 
                      'from-purple-500 to-purple-600'
                    ];
                    return (
                      <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-102 group">
                        <div className={`w-12 h-12 bg-gradient-to-br ${colors[activity.id - 1]} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <Icon className="text-white group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-800 dark:text-gray-200 font-medium">{activity.message}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-sm">{activity.time}</div>
                        </div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Uploaded Files Section */}
              {uploadedFiles.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Recent Files</h3>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All</button>
                  </div>
                  <div className="grid gap-4">
                    {uploadedFiles.slice(-3).map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <span className="text-2xl">
                              {file.type.includes('pdf') ? '📄' : '🖼️'}
                            </span>
                          </div>
                          <div>
                            <div className="text-gray-800 font-medium">{file.name}</div>
                            <div className="text-gray-500 text-sm">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <button 
                          className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors opacity-0 group-hover:opacity-100"
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
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Calendar & Appointments */}
            <div className="space-y-6">
              
              {/* Enhanced Calendar */}
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FaCalendarAlt className="text-white text-sm" />
                    </div>
                    Calendar
                  </h3>
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                      onClick={goPrevMonth}
                    >
                      <FaChevronLeft className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors" />
                    </button>
                    <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-300 font-bold text-sm shadow-sm">
                      {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </div>
                    <button 
                      className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                      onClick={goNextMonth}
                    >
                      <FaChevronRight className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-4">
                  {['S','M','T','W','T','F','S'].map((d) => (
                    <div key={d} className="text-xs font-bold text-gray-500 py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {monthDays.map((d) => (
                    <div 
                      key={d} 
                      className={`py-3 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                        appointmentDays.has(d) 
                          ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg' 
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Appointments */}
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <FaUserMd className="text-white text-sm" />
                    </div>
                    Appointments
                  </h3>
                  <button 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-2 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <FaPlus className="transition-transform duration-300 hover:rotate-90" />
                  </button>
                </div>
                <div className="space-y-3">
                  {appointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FaCalendarAlt className="text-3xl mb-3 mx-auto opacity-50" />
                      <p>No appointments scheduled</p>
                    </div>
                  ) : (
                    appointments.slice(0, 3).map((a) => (
                      <div key={a.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            a.status==='Confirmed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {a.status}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              className="p-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-xs"
                              onClick={() => onEdit(a)}
                            >
                              Edit
                            </button>
                            <button 
                              className="p-1 rounded-lg bg-red-500 text-white hover:bg-red-600 text-xs"
                              onClick={() => onCancel(a.id)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                        <div className="text-gray-800 font-medium">{a.doctor}</div>
                        <div className="text-gray-600 text-sm">{a.date} at {a.time}</div>
                        <div className="text-gray-500 text-xs">Room {a.room}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
            </>
          )}


          {/* Uploads Section */}
          {activeSection === 'uploads' && (
            <div className="space-y-6">
              {/* Section Header */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-100 border border-orange-200 rounded-3xl p-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center">
                        <FaCloudUploadAlt className="text-white text-xl" />
                      </div>
                      Medical Documents
                    </h2>
                    <p className="text-gray-600 text-lg">Upload and manage your medical reports and documents</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-yellow-300 rounded-full flex items-center justify-center">
                      <span className="text-4xl">📄</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Upload New Documents</h3>
                  <button 
                    onClick={handleUploadReport}
                    disabled={isUploading}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaPlus />
                    {isUploading ? 'Uploading...' : 'Upload Files'}
                  </button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer group"
                     onClick={handleUploadReport}>
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FaCloudUploadAlt className="text-2xl text-orange-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Drop files here or click to upload</h4>
                  <p className="text-gray-600">Supports PDF, JPG, PNG, DOC files up to 10MB</p>
                  <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
                    <span>📄 Lab Reports</span>
                    <span>🖼️ X-rays</span>
                    <span>📋 Prescriptions</span>
                    <span>📊 Test Results</span>
                  </div>
                </div>
              </div>

              {/* Uploaded Files */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Your Documents ({uploadedFiles.length})</h3>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50">
                      <FaEye />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50">
                      <FaDownload />
                    </button>
                  </div>
                </div>
                
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaFileMedical className="text-2xl text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">No documents uploaded yet</h4>
                    <p>Start by uploading your medical reports and documents</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <span className="text-2xl">
                              {file.type.includes('pdf') ? '📄' : 
                               file.type.includes('image') ? '🖼️' : 
                               file.type.includes('doc') ? '📝' : '📋'}
                            </span>
                          </div>
                          <div>
                            <div className="text-gray-800 font-semibold">{file.name}</div>
                            <div className="text-gray-500 text-sm">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                Processed
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                AI Analyzed
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                            <FaEye />
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
                          <button className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Files', value: uploadedFiles.length, icon: FaFileMedical, color: 'from-orange-500 to-orange-600' },
                  { label: 'This Month', value: uploadedFiles.filter(f => new Date(f.uploadDate).getMonth() === new Date().getMonth()).length, icon: FaCalendarAlt, color: 'from-blue-500 to-blue-600' },
                  { label: 'Storage Used', value: `${(uploadedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(1)}MB`, icon: FaCloudUploadAlt, color: 'from-green-500 to-green-600' },
                  { label: 'AI Processed', value: uploadedFiles.length, icon: FaRobot, color: 'from-purple-500 to-purple-600' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="text-white text-sm" />
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
                      <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                        <FaPhone />
                        Call Clinic
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

          {/* Footer - shown for all sections */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm bg-gray-50 px-4 py-2 rounded-full inline-block">
              Language: {selectedLanguage?.toUpperCase()} | Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
