import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaCalendarAlt, FaFileMedical, FaUsers, FaBell, FaComments, FaStethoscope, FaSearch, FaUserCircle, FaUser, FaCog, FaSignOutAlt, FaChevronDown, FaFilter, FaClock, FaTimes } from 'react-icons/fa';
import { useI18n } from '../i18n';

const Sparkline = ({ data, stroke = '#6366f1' }) => {
  const width = 120;
  const height = 36;
  if (!data || data.length === 0) return <svg width={width} height={height} />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => [i * step, height - ((v - min) / range) * (height - 4) - 2]);
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `M0,${height} ${d} L${width},${height} Z`;
  
  // Create gradient ID based on stroke color
  const gradientId = `sparkline-gradient-${stroke.replace('#', '')}`;
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.3" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path 
        d={d} 
        fill="none" 
        stroke={stroke} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="drop-shadow-sm"
      />
      {/* Add data points */}
      {points.map((point, i) => (
        <circle 
          key={i} 
          cx={point[0]} 
          cy={point[1]} 
          r="1.5" 
          fill={stroke} 
          className="opacity-60"
        />
      ))}
    </svg>
  );
};

const MiniBars = ({ data, color = '#0ea5e9' }) => {
  const width = 120;
  const height = 36;
  const max = Math.max(...data, 1);
  const barWidth = width / data.length - 2;
  
  // Create gradient ID based on color
  const gradientId = `minibars-gradient-${color.replace('#', '')}`;
  
  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {data.map((v, i) => {
        const h = (v / max) * (height - 4);
        return (
          <rect 
            key={i} 
            x={i * (barWidth + 2)} 
            y={height - h - 2} 
            width={barWidth} 
            height={h} 
            rx="3" 
            fill={`url(#${gradientId})`}
            className="drop-shadow-sm hover:drop-shadow-md transition-all duration-200"
            style={{
              animationDelay: `${i * 50}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          />
        );
      })}
    </svg>
  );
};

const LargeLineChart = ({ data, stroke = '#6366f1', fill = 'rgba(99,102,241,0.12)', height = 180 }) => {
  const w = 100; // percentage width via viewBox
  const h = 30;  // normalized height
  if (!data || data.length === 0) return <div className="h-48" />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => [i * step, h - ((v - min) / range) * h]);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `M0,${h} ${path} L${w},${h} Z`;
  
  // Create gradient ID based on stroke color
  const gradientId = `linechart-gradient-${stroke.replace('#', '')}`;
  const areaGradientId = `linechart-area-${stroke.replace('#', '')}`;
  
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      <defs>
        <linearGradient id={areaGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.2" />
          <stop offset="50%" stopColor={stroke} stopOpacity="0.1" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.8" />
          <stop offset="50%" stopColor={stroke} stopOpacity="1" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${areaGradientId})`} stroke="none" />
      <path 
        d={path} 
        fill="none" 
        stroke={`url(#${gradientId})`} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="drop-shadow-sm"
        style={{
          strokeDasharray: '1000',
          strokeDashoffset: '1000',
          animation: 'drawLine 2s ease-in-out forwards'
        }}
      />
      {/* Add data points */}
      {points.map((point, i) => (
        <circle 
          key={i} 
          cx={point[0]} 
          cy={point[1]} 
          r="1.2" 
          fill={stroke}
          className="drop-shadow-sm"
          style={{
            animationDelay: `${i * 100}ms`,
            animation: 'fadeInScale 0.5s ease-out forwards'
          }}
        />
      ))}
    </svg>
  );
};

const LargeBars = ({ data, color = '#0ea5e9', height = 96 }) => {
  const w = 100;
  const h = 30;
  const max = Math.max(...data, 1);
  const barW = w / data.length - 1;
  
  // Create gradient ID based on color
  const gradientId = `largebars-gradient-${color.replace('#', '')}`;
  
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="50%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {data.map((v, i) => {
        const bh = (v / max) * (h - 1);
        const x = i * (barW + 1);
        const y = h - bh;
        return (
          <rect 
            key={i} 
            x={x} 
            y={y} 
            width={barW} 
            height={bh} 
            rx="1.2" 
            fill={`url(#${gradientId})`}
            className="drop-shadow-sm hover:drop-shadow-md transition-all duration-200"
            style={{
              animationDelay: `${i * 100}ms`,
              animation: 'growUp 0.8s ease-out forwards'
            }}
          />
        );
      })}
    </svg>
  );
};

const GridLineChart = ({ data, color = '#ef4444', height = 200, timeLabels = true, yAxisLabels = [0, 3, 6, 9, 12], xAxisLabels = ['02:00', '06:00', '10:00', '14:00', '18:00', '22:00'], referenceLine = 4 }) => {
  const width = 100;
  const chartHeight = 30;
  const padding = { top: 2, right: 2, bottom: 4, left: 4 };
  
  if (!data || data.length === 0) return <div className="h-48" />;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  // Calculate chart dimensions
  const chartWidth = width - padding.left - padding.right;
  const chartHeightInner = chartHeight - padding.top - padding.bottom;
  
  // Create points for the line
  const step = chartWidth / (data.length - 1);
  const points = data.map((value, i) => [
    padding.left + i * step,
    padding.top + chartHeightInner - ((value - min) / range) * chartHeightInner
  ]);
  
  // Create path for the line
  const path = points.map((point, i) => `${i === 0 ? 'M' : 'L'}${point[0]},${point[1]}`).join(' ');
  
  // Create area path
  const areaPath = `M${padding.left},${padding.top + chartHeightInner} ${path} L${padding.left + chartWidth},${padding.top + chartHeightInner} Z`;
  
  // Create gradient IDs
  const gradientId = `gridchart-gradient-${color.replace('#', '')}`;
  const areaGradientId = `gridchart-area-${color.replace('#', '')}`;
  
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${chartHeight}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
        <defs>
          <linearGradient id={areaGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        <g stroke="#e5e7eb" strokeWidth="0.3" strokeDasharray="1,1" opacity="0.6">
          {/* Horizontal grid lines */}
          {yAxisLabels.map((value, i) => {
            const y = padding.top + chartHeightInner - ((value - min) / range) * chartHeightInner;
            return (
              <line 
                key={`h-${i}`} 
                x1={padding.left} 
                y1={y} 
                x2={padding.left + chartWidth} 
                y2={y} 
              />
            );
          })}
          
          {/* Vertical grid lines */}
          {xAxisLabels.map((_, i) => {
            const x = padding.left + (i * chartWidth / (xAxisLabels.length - 1));
            return (
              <line 
                key={`v-${i}`} 
                x1={x} 
                y1={padding.top} 
                x2={x} 
                y2={padding.top + chartHeightInner} 
              />
            );
          })}
        </g>
        
        {/* Reference line */}
        <line 
          x1={padding.left} 
          y1={padding.top + chartHeightInner - ((referenceLine - min) / range) * chartHeightInner} 
          x2={padding.left + chartWidth} 
          y2={padding.top + chartHeightInner - ((referenceLine - min) / range) * chartHeightInner} 
          stroke="#9ca3af" 
          strokeWidth="0.5" 
          strokeDasharray="2,2" 
          opacity="0.8"
        />
        
        {/* Area fill */}
        <path d={areaPath} fill={`url(#${areaGradientId})`} />
        
        {/* Main line */}
        <path 
          d={path} 
          fill="none" 
          stroke={`url(#${gradientId})`} 
          strokeWidth="0.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="drop-shadow-sm"
          style={{
            strokeDasharray: '1000',
            strokeDashoffset: '1000',
            animation: 'drawLine 2.5s ease-in-out forwards'
          }}
        />
        
        {/* Data points */}
        {points.map((point, i) => (
          <circle 
            key={i} 
            cx={point[0]} 
            cy={point[1]} 
            r="0.5" 
            fill={color}
            className="drop-shadow-sm"
            style={{
              animationDelay: `${i * 100}ms`,
              animation: 'fadeInScale 0.5s ease-out forwards'
            }}
          />
        ))}
      </svg>
      
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 font-medium" style={{ width: '20px' }}>
        {yAxisLabels.map((value, i) => (
          <span key={i} className="text-right">{value}</span>
        ))}
      </div>
      
      {/* X-axis labels */}
      {timeLabels && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 font-medium px-5">
          {xAxisLabels.map((time, i) => (
            <span key={i}>{time}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, delta, positive, icon, chart }) => (
  <div className="bg-white border border-dark-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center justify-between mb-3">
      <div className="text-sm text-dark-500 font-medium">{title}</div>
      <div className="text-primary-500 text-xl p-2 bg-primary-50 rounded-lg">{icon}</div>
    </div>
    <div className="flex items-end gap-3 mb-3">
      <div className="text-3xl font-bold text-dark-950">{value}</div>
      {delta !== undefined && (
        <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
          positive 
            ? 'text-green-700 bg-green-50' 
            : 'text-red-700 bg-red-50'
        }`}>
          {positive ? '+' : ''}{delta}%
        </div>
      )}
    </div>
    {chart && <div className="mt-3 opacity-80 hover:opacity-100 transition-opacity duration-200">{chart}</div>}
  </div>
);

const SidebarItem = ({ active, icon, label, badge, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${active ? 'bg-primary-500 text-white shadow-sm' : 'text-dark-700 hover:bg-dark-50'}`}
  >
    <div className="flex items-center gap-3">
      <span className={`w-8 h-8 grid place-items-center rounded-md ${active ? 'bg-primary-600 text-white' : 'bg-dark-50 text-dark-700'}`}>{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-error text-white'}`}>{badge}</span>}
  </div>
);

const DoctorDashboard = ({ user, onLogout }) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Appointment filters state
  const [filterDate, setFilterDate] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [profileData, setProfileData] = useState(() => {
    // Prioritize actual user data from authentication
    if (user) {
      return {
        name: user.name || 'Dr. Unknown',
        email: user.email || 'doctor@hospital.com',
        phone: user.phone || user.phoneNumber || '+1 (555) 123-4567',
        specialty: user.doctorProfile?.specialization || user.specialty || 'General Practitioner',
        license: user.doctorProfile?.licenseNumber || user.license || 'Not provided',
        experience: user.doctorProfile?.yearsOfExperience ? `${user.doctorProfile.yearsOfExperience} years` : user.experience || 'Not specified',
        hospital: user.doctorProfile?.clinicName || user.hospital || 'Not specified',
        education: user.education || 'Not specified',
        bio: user.bio || 'Professional healthcare provider dedicated to patient care.'
      };
    }
    
    // Fallback to localStorage only if no user data
    const savedProfile = localStorage.getItem('doctorProfile');
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    
    // Final fallback to default values
    return {
      name: 'Dr. Unknown',
      email: 'doctor@hospital.com',
      phone: '+1 (555) 123-4567',
      specialty: 'General Practitioner',
      license: 'Not provided',
      experience: 'Not specified',
      hospital: 'Not specified',
      education: 'Not specified',
      bio: 'Professional healthcare provider dedicated to patient care.'
    };
  });

  // Sync profile data when user prop changes
  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || 'Dr. Unknown',
        email: user.email || 'doctor@hospital.com',
        phone: user.phone || user.phoneNumber || '+1 (555) 123-4567',
        specialty: user.doctorProfile?.specialization || user.specialty || 'General Practitioner',
        license: user.doctorProfile?.licenseNumber || user.license || 'Not provided',
        experience: user.doctorProfile?.yearsOfExperience ? `${user.doctorProfile.yearsOfExperience} years` : user.experience || 'Not specified',
        hospital: user.doctorProfile?.clinicName || user.hospital || 'Not specified',
        education: user.education || 'Not specified',
        bio: user.bio || 'Professional healthcare provider dedicated to patient care.'
      });
    }
  }, [user]);

  // Add CSS animations for charts
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes drawLine {
        to {
          stroke-dashoffset: 0;
        }
      }
      
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes growUp {
        from {
          transform: scaleY(0);
          transform-origin: bottom;
        }
        to {
          transform: scaleY(1);
          transform-origin: bottom;
        }
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .animate-slideIn {
        animation: slideIn 0.4s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const mock = {
    stats: {
      totalPatients: 2420,
      newAppointments: 226,
      pendingReports: 193,
      alerts: 6,
      trends: {
        patients: [2,4,6,4,8,10,12,9,11,14],
        appointments: [8,6,7,9,6,8,10,7,9],
        reports: [3,5,4,6,5,7,6,8,7,9],
        alerts: [1,2,1,3,2,4,3,2,3]
      }
    },
    appointments: [
      { id: 'A-1001', date: '2025-10-25', time: '09:00', name: 'Jane Cooper', age: 32, doctor: profileData?.name || 'You', room: '302B', status: 'Pending', type: 'Checkup' },
      { id: 'A-1002', date: '2025-10-25', time: '10:30', name: 'Cody Fisher', age: 45, doctor: profileData?.name || 'You', room: '210A', status: 'Checked', type: 'Follow-up' },
      { id: 'A-1003', date: '2025-10-25', time: '11:00', name: 'Leslie Alexander', age: 28, doctor: profileData?.name || 'You', room: '415', status: 'In Progress', type: 'Consultation' },
      { id: 'A-1004', date: '2025-10-25', time: '14:00', name: 'Guy Hawkins', age: 52, doctor: profileData?.name || 'You', room: '118', status: 'Pending', type: 'Checkup' },
      { id: 'A-1005', date: '2025-10-24', time: '15:30', name: 'Kristin Watson', age: 38, doctor: profileData?.name || 'You', room: '506', status: 'Checked', type: 'Follow-up' },
      { id: 'A-1006', date: '2025-10-24', time: '16:00', name: 'Robert Fox', age: 61, doctor: profileData?.name || 'You', room: '203', status: 'Completed', type: 'Checkup' },
      { id: 'A-1007', date: '2025-10-26', time: '09:30', name: 'Brooklyn Simmons', age: 29, doctor: profileData?.name || 'You', room: '108', status: 'Pending', type: 'Consultation' },
      { id: 'A-1008', date: '2025-10-26', time: '11:30', name: 'Jacob Jones', age: 41, doctor: profileData?.name || 'You', room: '315', status: 'Pending', type: 'Follow-up' },
      { id: 'A-1009', date: '2025-10-23', time: '10:00', name: 'Eleanor Pena', age: 35, doctor: profileData?.name || 'You', room: '402', status: 'Completed', type: 'Checkup' },
      { id: 'A-1010', date: '2025-10-23', time: '13:00', name: 'Jenny Wilson', age: 47, doctor: profileData?.name || 'You', room: '210', status: 'Completed', type: 'Consultation' }
    ],
    kidneyDamageAdmitted: 3672,
    // 24-hour patient activity data (similar to your reference)
    patientActivity: [2.5, 2.8, 2.2, 2.1, 2.3, 2.7, 2.9, 3.1, 3.4, 4.2, 5.8, 7.2, 8.5, 8.1, 7.3, 6.8, 5.9, 4.7, 3.8, 3.5, 3.2, 3.0, 2.9, 2.7],
    // Blood pressure monitoring data
    bloodPressure: [3.2, 3.1, 2.9, 2.8, 3.0, 3.3, 3.6, 4.1, 4.8, 5.5, 6.2, 7.1, 7.8, 7.2, 6.5, 5.8, 5.1, 4.3, 3.7, 3.4, 3.2, 3.0, 2.9, 2.8],
    // Heart rate data
    heartRate: [2.1, 2.3, 2.0, 1.9, 2.2, 2.5, 2.8, 3.2, 3.9, 4.7, 5.8, 6.9, 7.5, 6.8, 5.9, 5.1, 4.2, 3.5, 2.9, 2.6, 2.4, 2.2, 2.1, 2.0],
    visitors: {
      last30: [12,14,10,16,18,22,20,26,24,28,26,30,28,32,34,36,30,28,26,24,20,18,22,24,26,28,30,32,34,36]
    },
    cancerTrend: [8,10,9,12,11,13,12,15,14,16,14,18],
    kidneyTrend: [6,8,10,9,12,14,13,16,15,18,17,20]
  };

  // Filter appointments based on selected filters
  const filteredAppointments = useMemo(() => {
    return mock.appointments.filter(appointment => {
      const matchesDate = !filterDate || appointment.date === filterDate;
      const matchesTime = !filterTime || appointment.time.startsWith(filterTime);
      const matchesStatus = !filterStatus || appointment.status === filterStatus;
      return matchesDate && matchesTime && matchesStatus;
    });
  }, [filterDate, filterTime, filterStatus]);

  // Clear all filters
  const clearFilters = () => {
    setFilterDate('');
    setFilterTime('');
    setFilterStatus('');
  };

  const hasActiveFilters = filterDate || filterTime || filterStatus;

  return (
    <div className="min-h-screen bg-gradient-main flex text-dark-700">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-dark-100 min-h-screen p-4 flex flex-col">
        <div className="px-2 py-3 mb-4">
          <a 
            href="/"
            onClick={async (e) => {
              e.preventDefault();
              // First clear local storage and authentication
              localStorage.removeItem('isAuthenticated');
              localStorage.removeItem('user');
              localStorage.removeItem('selectedRole');
              localStorage.removeItem('doctorProfile');
              // Then call the logout handler
              if (onLogout) onLogout();
              // Force a full page reload with a small delay to ensure state is cleared
              setTimeout(() => {
                window.location.href = '/';
              }, 100);
            }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img 
              src="/logo1.jpg" 
              alt="MedClerk Logo" 
              className="h-14 w-auto object-contain"
            />
          </a>
        </div>
        <div className="relative mb-3">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"><FaSearch /></div>
          <input className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-dark-200 text-dark-700 placeholder:text-dark-400 focus:outline-none focus:border-primary-500" placeholder="Search here..." />
        </div>
        <nav className="space-y-1 flex-1">
          <SidebarItem 
            active={activeSection === 'overview'} 
            icon={<FaStethoscope />} 
            label="Overview" 
            onClick={() => setActiveSection('overview')}
          />
          <SidebarItem 
            active={activeSection === 'appointments'} 
            icon={<FaCalendarAlt />} 
            label="Appointments" 
            onClick={() => setActiveSection('appointments')}
          />
          <SidebarItem 
            active={activeSection === 'patients'} 
            icon={<FaUsers />} 
            label="Patients" 
            onClick={() => setActiveSection('patients')}
          />
          <SidebarItem 
            active={activeSection === 'reports'} 
            icon={<FaFileMedical />} 
            label="Reports" 
            onClick={() => setActiveSection('reports')}
          />
          <SidebarItem 
            active={activeSection === 'prescriptions'} 
            icon={<FaBell />} 
            label="Prescriptions" 
            onClick={() => setActiveSection('prescriptions')}
          />
        </nav>
        <div className="mt-auto">
          <button className="w-full btn btn-secondary" onClick={onLogout}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Top bar */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-r border-blue-100 px-6 py-5 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back{profileData?.name ? `, ${profileData.name.split(' ')[0]}` : ''}
              </h1>
              <p className="text-sm text-gray-600 mt-1">Track, manage and forecast your patient reports and data.</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur border border-blue-200 rounded-xl px-4 py-2.5 hover:bg-white hover:shadow-md transition-all"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-sm">
                    <FaUserCircle className="text-lg" />
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-sm font-semibold text-gray-800">{profileData?.name || 'Doctor'}</div>
                    <div className="text-xs text-gray-500">{profileData?.email || 'doctor@hospital.com'}</div>
                  </div>
                  <FaChevronDown className={`text-xs text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>
              
              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-dark-200 rounded-xl shadow-xl z-50">
                  <div className="p-4 border-b border-dark-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white">
                        <FaUserCircle className="text-2xl" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-dark-900 truncate">{profileData?.name || 'Dr. Unknown'}</div>
                        <div className="text-xs text-dark-500 truncate">{profileData?.email || 'doctor@hospital.com'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowProfileModal(true);
                        setIsEditMode(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <FaUser className="text-sm" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-dark-900">View Profile</div>
                        <div className="text-xs text-dark-500">See and edit your details</div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="p-2 border-t border-dark-100">
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600 group-hover:bg-red-100">
                        <FaSignOutAlt className="text-sm" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-red-600">Sign Out</div>
                        <div className="text-xs text-red-500">Logout from your account</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Conditional Content Based on Active Section */}
        {activeSection === 'overview' && (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-6 pt-6">
          <StatCard title="Total Patients" value={mock.stats.totalPatients.toLocaleString()} delta={47} positive icon={<FaUsers />} chart={<MiniBars data={mock.stats.trends.patients} />} />
          <StatCard title="New Appointments" value={mock.stats.newAppointments} delta={-10} positive={false} icon={<FaCalendarAlt />} chart={<Sparkline data={mock.stats.trends.appointments} />} />
          <StatCard title="Pending Reports" value={mock.stats.pendingReports} delta={25} positive icon={<FaFileMedical />} chart={<MiniBars data={mock.stats.trends.reports} color="#ef4444" />} />
          <StatCard title="Alerts" value={mock.stats.alerts} delta={5} positive={false} icon={<FaBell />} chart={<Sparkline data={mock.stats.trends.alerts} stroke="#f59e0b" />} />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 px-6 pb-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white border border-dark-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-dark-900 text-lg">24-Hour Patient Visit Activity</div>
                <select className="bg-white border border-dark-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20">
                  <option>Today</option>
                  <option>Yesterday</option>
                  <option>This Week</option>
                </select>
              </div>
              <div className="relative">
                <GridLineChart data={mock.patientActivity} color="#ef4444" height={200} />
                <div className="absolute top-2 right-2 bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                  Peak: 8.5 at 12:30
                </div>
              </div>
            </div>

            <div className="bg-white border border-dark-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-dark-900 text-lg">Recent Appointments</h2>
                  <p className="text-sm text-dark-500 mt-1">Today's schedule overview</p>
                </div>
                <button
                  onClick={() => setActiveSection('appointments')}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  View All
                  <FaCalendarAlt />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-dark-500 border-b-2 border-dark-200">
                      <th className="py-3 px-2">ID</th>
                      <th className="py-3 px-2">Date</th>
                      <th className="py-3 px-2">Time</th>
                      <th className="py-3 px-2">Patient</th>
                      <th className="py-3 px-2">Room</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-100">
                    {mock.appointments.slice(0, 5).map((row) => (
                      <tr key={row.id} className="hover:bg-dark-50 transition-colors">
                        <td className="py-3 px-2 font-medium text-blue-600">{row.id}</td>
                        <td className="py-3 px-2">{row.date}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1">
                            <FaClock className="text-blue-500 text-xs" />
                            {row.time}
                          </div>
                        </td>
                        <td className="py-3 px-2 font-medium">{row.name}</td>
                        <td className="py-3 px-2">{row.room}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            row.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                            row.status === 'Checked' ? 'bg-green-100 text-green-700' : 
                            row.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white border border-dark-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-dark-900 text-lg">Cancer Patient</div>
                <div className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                  Critical
                </div>
              </div>
              <div className="relative">
                <GridLineChart 
                  data={mock.bloodPressure} 
                  color="#ef4444" 
                  height={150}
                  yAxisLabels={[0, 2, 4, 6, 8, 10]}
                  xAxisLabels={['06:00', '10:00', '14:00', '18:00', '22:00']}
                  referenceLine={3}
                />
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-red-600">
                  Avg: 4.8
                </div>
              </div>
            </div>
            <div className="bg-white border border-primary-500/40 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-dark-900 text-lg">Kidney Damage Patient</div>
                <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  Stable
                </div>
              </div>
              <div className="relative">
                <GridLineChart 
                  data={mock.heartRate} 
                  color="#3b82f6" 
                  height={150}
                  yAxisLabels={[0, 2, 4, 6, 8, 10]}
                  xAxisLabels={['06:00', '10:00', '14:00', '18:00', '22:00']}
                  referenceLine={3}
                />
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-blue-600">
                  Avg: 4.1
                </div>
              </div>
              <div className="text-right text-blue-600 font-bold text-2xl mt-3 bg-blue-50 px-3 py-2 rounded-lg">
                3,672
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Appointments Section */}
        {activeSection === 'appointments' && (
          <div className="px-6 py-6">
            <div className="bg-white border border-dark-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-dark-900 text-xl flex items-center gap-2">
                    <FaCalendarAlt className="text-primary-500" />
                    Patient Appointments
                  </h2>
                  <p className="text-sm text-dark-500 mt-1">
                    Showing {filteredAppointments.length} of {mock.appointments.length} appointments
                  </p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <FaTimes />
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Filters Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-5 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <FaFilter className="text-blue-600" />
                  <span className="font-semibold text-dark-900">Filter Appointments</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      <FaCalendarAlt className="inline mr-2 text-blue-600" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>

                  {/* Time Filter */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      <FaClock className="inline mr-2 text-blue-600" />
                      Time
                    </label>
                    <select
                      value={filterTime}
                      onChange={(e) => setFilterTime(e.target.value)}
                      className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="">All Times</option>
                      <option value="09">Morning (9:00 AM)</option>
                      <option value="10">Morning (10:00 AM)</option>
                      <option value="11">Morning (11:00 AM)</option>
                      <option value="13">Afternoon (1:00 PM)</option>
                      <option value="14">Afternoon (2:00 PM)</option>
                      <option value="15">Afternoon (3:00 PM)</option>
                      <option value="16">Afternoon (4:00 PM)</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      <FaStethoscope className="inline mr-2 text-blue-600" />
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Checked">Checked</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Appointments List */}
              <div className="overflow-x-auto">
                {filteredAppointments.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-dark-500 border-b-2 border-dark-200">
                        <th className="py-3 px-2 font-semibold">ID</th>
                        <th className="py-3 px-2 font-semibold">Date</th>
                        <th className="py-3 px-2 font-semibold">Time</th>
                        <th className="py-3 px-2 font-semibold">Patient</th>
                        <th className="py-3 px-2 font-semibold">Age</th>
                        <th className="py-3 px-2 font-semibold">Type</th>
                        <th className="py-3 px-2 font-semibold">Room</th>
                        <th className="py-3 px-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-100">
                      {filteredAppointments.map((row) => (
                        <tr key={row.id} className="hover:bg-blue-50 transition-colors cursor-pointer">
                          <td className="py-3 px-2 font-medium text-blue-600">{row.id}</td>
                          <td className="py-3 px-2">{row.date}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1">
                              <FaClock className="text-blue-500 text-xs" />
                              {row.time}
                            </div>
                          </td>
                          <td className="py-3 px-2 font-medium">{row.name}</td>
                          <td className="py-3 px-2">{row.age}</td>
                          <td className="py-3 px-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                              {row.type}
                            </span>
                          </td>
                          <td className="py-3 px-2">{row.room}</td>
                          <td className="py-3 px-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              row.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                              row.status === 'Checked' ? 'bg-green-100 text-green-700' : 
                              row.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <FaCalendarAlt className="text-5xl text-gray-300 mx-auto mb-4" />
                    <p className="text-dark-500 text-lg font-medium">No appointments found</p>
                    <p className="text-dark-400 text-sm mt-1">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other sections */}
        {activeSection === 'patients' && (
          <div className="px-6 py-6">
            <div className="bg-white border border-dark-100 rounded-xl p-12 shadow-sm text-center">
              <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-dark-900 mb-2">Patients Section</h2>
              <p className="text-dark-500">This section is under development</p>
            </div>
          </div>
        )}

        {activeSection === 'reports' && (
          <div className="px-6 py-6">
            <div className="bg-white border border-dark-100 rounded-xl p-12 shadow-sm text-center">
              <FaFileMedical className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-dark-900 mb-2">Reports Section</h2>
              <p className="text-dark-500">This section is under development</p>
            </div>
          </div>
        )}

        {activeSection === 'prescriptions' && (
          <div className="px-6 py-6">
            <div className="bg-white border border-dark-100 rounded-xl p-12 shadow-sm text-center">
              <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-dark-900 mb-2">Prescriptions Section</h2>
              <p className="text-dark-500">This section is under development</p>
            </div>
          </div>
        )}
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-3xl p-6 text-white relative">
              <button 
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                onClick={() => {
                  setShowProfileModal(false);
                  setIsEditMode(false);
                }}
              >
                ✕
              </button>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl">
                  <FaUserCircle />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{isEditMode ? 'Edit Profile' : 'My Profile'}</h2>
                  <p className="text-white/90">{isEditMode ? 'Update your information' : 'View your profile details'}</p>
                </div>
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <FaCog />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {!isEditMode ? (
                // View Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">Full Name</label>
                      <div className="text-lg font-semibold text-gray-800">{profileData.name}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">Email Address</label>
                      <div className="text-lg font-semibold text-gray-800">{profileData.email}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">Phone Number</label>
                      <div className="text-lg font-semibold text-gray-800">{profileData.phone}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">Specialty</label>
                      <div className="text-lg font-semibold text-gray-800">{profileData.specialty}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">License Number</label>
                      <div className="text-lg font-semibold text-gray-800">{profileData.license}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">Experience</label>
                      <div className="text-lg font-semibold text-gray-800">{profileData.experience}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">Hospital</label>
                      <div className="text-lg font-semibold text-gray-800">{profileData.hospital}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">Education</label>
                      <div className="text-lg font-semibold text-gray-800">{profileData.education}</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-1 block">Bio</label>
                    <div className="text-gray-800 leading-relaxed">{profileData.bio}</div>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Save to localStorage
                  localStorage.setItem('doctorProfile', JSON.stringify(profileData));
                  setIsEditMode(false);
                  // Show success message
                  setShowSuccessMessage(true);
                  setTimeout(() => setShowSuccessMessage(false), 3000);
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Specialty</label>
                      <input
                        type="text"
                        value={profileData.specialty}
                        onChange={(e) => setProfileData({...profileData, specialty: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">License Number</label>
                      <input
                        type="text"
                        value={profileData.license}
                        onChange={(e) => setProfileData({...profileData, license: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Experience</label>
                      <input
                        type="text"
                        value={profileData.experience}
                        onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Hospital</label>
                      <input
                        type="text"
                        value={profileData.hospital}
                        onChange={(e) => setProfileData({...profileData, hospital: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Education</label>
                      <input
                        type="text"
                        value={profileData.education}
                        onChange={(e) => setProfileData({...profileData, education: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                    />
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Toast */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-6 z-50 animate-slideIn">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg">Success!</p>
              <p className="text-sm opacity-90">Profile updated successfully</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;


