import React, { useState, useEffect } from 'react';
import { FaFileMedical, FaRobot, FaChartLine, FaDownload, FaEye, FaUser, FaSignOutAlt, FaHome, FaUserMd, FaCog, FaCloudUploadAlt, FaCalendarAlt, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ReportsPage = ({ user, selectedLanguage, onLanguageSelect, onLogout }) => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeSection, setActiveSection] = useState('reports');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, message: 'Your appointment reminder for tomorrow', type: 'reminder', time: '1 hour ago' },
    { id: 2, message: 'New lab results available', type: 'results', time: '3 hours ago' },
    { id: 3, message: 'Prescription refill due', type: 'prescription', time: '1 day ago' }
  ];

  useEffect(() => {
    const storedFiles = localStorage.getItem('uploadedFiles');
    if (storedFiles) {
      setUploadedFiles(JSON.parse(storedFiles));
    }
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
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
              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700 rounded-3xl p-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <FaFileMedical className="text-white text-xl" />
                      </div>
                      Medical Reports
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">View and analyze your medical reports with AI insights</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-indigo-300 rounded-full flex items-center justify-center">
                      <span className="text-4xl">📊</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">AI Health Summary</h3>
                  <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                    <FaRobot />
                    <span>AI Powered</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">Normal Values</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Most recent blood work shows normal glucose and cholesterol levels.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">!</span>
                      </div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">Watch</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Blood pressure slightly elevated. Consider lifestyle changes.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                        <FaChartLine className="text-white text-sm" />
                      </div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">Trends</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Overall health metrics showing positive improvement trend.</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">AI Recommendations</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Report History</h3>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                      Filter
                    </button>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                      Export
                    </button>
                  </div>
                </div>
                
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaFileMedical className="text-2xl text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">No reports available</h4>
                    <p>Upload your medical reports to see AI analysis and insights</p>
                    <button 
                      className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-xl hover:bg-purple-600 transition-colors"
                      onClick={() => navigate('/uploads')}
                    >
                      Upload Reports
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border border-gray-200 dark:border-gray-600 rounded-2xl p-6 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center">
                              <span className="text-2xl">
                                {file.type.includes('pdf') ? '📄' : 
                                 file.type.includes('image') ? '🖼️' : 
                                 file.type.includes('doc') ? '📝' : '📋'}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">{file.name}</h4>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Uploaded on {new Date(file.uploadDate).toLocaleDateString()} • {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                                  Analyzed
                                </span>
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
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
                        
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">AI Analysis Summary</h5>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            Blood glucose: 95 mg/dL (Normal) • Cholesterol: 180 mg/dL (Good) • Blood pressure: 125/82 mmHg (Slightly elevated)
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-green-600 dark:text-green-400">✓ 8 values normal</span>
                            <span className="text-yellow-600 dark:text-yellow-400">⚠ 1 value elevated</span>
                            <span className="text-gray-600 dark:text-gray-400">📈 Trend: Improving</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
