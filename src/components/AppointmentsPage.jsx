import React, { useState, useEffect, useMemo } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaPlus, FaUser, FaSignOutAlt, FaHome, FaUserMd, FaFileMedical, FaCog, FaCloudUploadAlt, FaBell, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AppointmentsPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [activeSection, setActiveSection] = useState('appointments');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ date: '', time: '', doctor: '', room: '' });

  const doctors = [
    'Dr. John Smith',
    'Dr. Emily Clark',
    'Dr. Richard Lee',
    'Dr. Priya Sharma'
  ];

  const notifications = [
    { id: 1, message: 'Your appointment reminder for tomorrow', type: 'reminder', time: '1 hour ago' },
    { id: 2, message: 'New lab results available', type: 'results', time: '3 hours ago' },
    { id: 3, message: 'Prescription refill due', type: 'prescription', time: '1 day ago' }
  ];

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

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const [uploadedFiles, setUploadedFiles] = useState([]);
  useEffect(() => {
    const storedFiles = localStorage.getItem('uploadedFiles');
    if (storedFiles) {
      setUploadedFiles(JSON.parse(storedFiles));
    }
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
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-3xl p-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <FaCalendarAlt className="text-white text-xl" />
                      </div>
                      Appointments
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your medical appointments and schedules</p>
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
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Calendar</h3>
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={goPrevMonth}
                        >
                          <FaChevronLeft className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 text-green-700 dark:text-green-400 font-bold text-lg">
                          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </div>
                        <button 
                          className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={goNextMonth}
                        >
                          <FaChevronRight className="text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center mb-4">
                      {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map((d) => (
                        <div key={d} className="text-sm font-bold text-gray-500 dark:text-gray-400 py-3">{d.slice(0,3)}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center">
                      {monthDays.map((d) => (
                        <div 
                          key={d} 
                          className={`py-4 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                            appointmentDays.has(d) 
                              ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg transform scale-105' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm hover:scale-105'
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
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Upcoming</h3>
                      <button 
                        className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 transition-colors"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {appointments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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
                          <div key={a.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-3">
                              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                a.status==='Confirmed' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
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
                            <div className="text-gray-800 dark:text-gray-200 font-bold text-lg">{a.doctor}</div>
                            <div className="text-gray-600 dark:text-gray-400 font-medium">{a.date} at {a.time}</div>
                            <div className="text-gray-500 dark:text-gray-500 text-sm">Room {a.room}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h3>
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
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm grid place-items-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">Book an appointment</div>
              <button className="btn btn-link" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
            <form onSubmit={saveAppointment} className="grid gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input type="date" className="form-input" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                <input type="time" className="form-input" value={form.time} onChange={(e)=>setForm({...form, time:e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor</label>
                <select className="form-input" value={form.doctor} onChange={(e)=>setForm({...form, doctor:e.target.value})} required>
                  <option value="" disabled>Select doctor</option>
                  {doctors.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room (optional)</label>
                <input type="text" placeholder="e.g., 302B" className="form-input" value={form.room} onChange={(e)=>setForm({...form, room:e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary w-full">{editingId ? 'Update appointment' : 'Save appointment'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
