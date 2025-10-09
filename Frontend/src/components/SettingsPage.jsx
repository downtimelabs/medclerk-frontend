import React, { useState, useEffect } from 'react';
import { FaCog, FaUser, FaFileMedical, FaBell, FaLock, FaPalette, FaSignOutAlt, FaHome, FaUserMd, FaCloudUploadAlt, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SettingsPage = ({ user, selectedLanguage, onLanguageSelect, onLogout }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('settings');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, message: 'Your appointment reminder for tomorrow', type: 'reminder', time: '1 hour ago' },
    { id: 2, message: 'New lab results available', type: 'results', time: '3 hours ago' },
    { id: 3, message: 'Prescription refill due', type: 'prescription', time: '1 day ago' }
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    const storedFiles = localStorage.getItem('uploadedFiles');
    if (storedFiles) setUploadedFiles(JSON.parse(storedFiles));
    
    const stored = localStorage.getItem('patientAppointments');
    if (stored) setAppointments(JSON.parse(stored));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex text-gray-700 dark:text-gray-300">
      {/* Sidebar */}
      <aside className="w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen px-4 pt-4 pb-4 flex flex-col shadow-lg">
        <div className="flex items-center mb-4">
          <img src="/logo1.jpg" alt="MedClerk Logo" className="h-16 w-26 object-contain" />
        </div>
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
            { id: 'overview', name: 'Overview', icon: FaHome, route: '/dashboard' },
            { id: 'uploads', name: 'Uploads', icon: FaCloudUploadAlt, route: '/uploads', badge: uploadedFiles.length },
            { id: 'appointments', name: 'Appointments', icon: FaCalendarAlt, route: '/appointments', badge: appointments.length },
            { id: 'doctors', name: 'Doctors', icon: FaUserMd, route: '/doctors' },
            { id: 'reports', name: 'Reports', icon: FaFileMedical, route: '/reports', badge: uploadedFiles.length },
            { id: 'settings', name: 'Settings', icon: FaCog, route: '/settings' }
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
                onClick={() => navigate(item.route)}
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
      <div className="flex-1">
        {/* Navbar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="flex items-center gap-4">
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
                <option value="hi">हिंदी</option>
              </select>
              
              <button className="btn btn-secondary px-4 py-2 text-sm hover:shadow-lg transition-all" onClick={handleLogout}>
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
              {/* Section Header */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800/50 dark:to-slate-800/50 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
                        <FaCog className="text-white text-xl" />
                      </div>
                      Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your account and application preferences</p>
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20" 
                        value={user?.name || ''} 
                        readOnly 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20" 
                        value={user?.email || ''} 
                        readOnly 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-xl" 
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
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                    <FaFileMedical className="text-gray-600 dark:text-gray-400" />
                    Medical Profile
                  </h3>
                  
                  {user?.patientProfile ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Blood Group</label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-xl" 
                            value={user.patientProfile.bloodGroup || 'Not set'} 
                            readOnly 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Height</label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-xl" 
                            value={user.patientProfile.heightCm ? `${user.patientProfile.heightCm} cm` : 'Not set'} 
                            readOnly 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chronic Conditions</label>
                        <div className="flex flex-wrap gap-2">
                          {user.patientProfile.chronicConditions?.length > 0 ? (
                            user.patientProfile.chronicConditions.map((condition, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                                {condition}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-sm">None specified</span>
                          )}
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all">
                        Update Medical Profile
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FaFileMedical className="text-3xl mb-3 mx-auto opacity-50" />
                      <p>No medical profile found</p>
                      <button className="mt-3 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-500 font-medium">
                        Create Medical Profile
                      </button>
                    </div>
                  )}
                </div>

                {/* App Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                    <FaPalette className="text-gray-600 dark:text-gray-400" />
                    Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                      <select
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                        value={selectedLanguage || 'en'}
                        onChange={(e) => onLanguageSelect?.(e.target.value)}
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="hi">हिंदी</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                      <select
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Format</label>
                      <select
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all">
                      Save Preferences
                    </button>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                    <FaBell className="text-gray-600 dark:text-gray-400" />
                    Notifications
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">Email Notifications</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">Appointment Reminders</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Get reminded before appointments</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">Report Updates</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Notify when reports are ready</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 lg:col-span-2">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                    <FaLock className="text-gray-600 dark:text-gray-400" />
                    Security
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex flex-col items-center gap-2">
                      <FaLock className="text-2xl" />
                      <span className="font-medium">Change Password</span>
                    </button>
                    <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex flex-col items-center gap-2">
                      <FaBell className="text-2xl" />
                      <span className="font-medium">Two-Factor Auth</span>
                    </button>
                    <button className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all flex flex-col items-center gap-2">
                      <FaUser className="text-2xl" />
                      <span className="font-medium">Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
