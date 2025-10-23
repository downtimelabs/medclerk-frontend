import React from 'react';
import { FaUserMd, FaCalendarAlt, FaFileMedical, FaUsers, FaBell, FaComments, FaStethoscope, FaSearch } from 'react-icons/fa';
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

const SidebarItem = ({ active, icon, label, badge }) => (
  <div className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${active ? 'bg-primary-500 text-white shadow-sm' : 'text-dark-700 hover:bg-dark-50'}`}>
    <div className="flex items-center gap-3">
      <span className={`w-8 h-8 grid place-items-center rounded-md ${active ? 'bg-primary-600 text-white' : 'bg-dark-50 text-dark-700'}`}>{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-error text-white'}`}>{badge}</span>}
  </div>
);

const DoctorDashboard = ({ user, selectedLanguage, onLanguageSelect, onLogout }) => {
  const { t } = useI18n();

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
      { id: 'A-1001', date: '2025-09-12', name: 'Jane Cooper', doctor: user?.name || 'You', room: '302B', status: 'Pending' },
      { id: 'A-1002', date: '2025-09-12', name: 'Cody Fisher', doctor: user?.name || 'You', room: '210A', status: 'Checked' },
      { id: 'A-1003', date: '2025-09-11', name: 'Leslie Alexander', doctor: user?.name || 'You', room: '415', status: 'In Progress' },
      { id: 'A-1004', date: '2025-09-11', name: 'Guy Hawkins', doctor: user?.name || 'You', room: '118', status: 'Pending' },
      { id: 'A-1005', date: '2025-09-10', name: 'Kristin Watson', doctor: user?.name || 'You', room: '506', status: 'Checked' }
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

  return (
    <div className="min-h-screen bg-gradient-main flex text-dark-700">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-dark-100 min-h-screen p-4 flex flex-col">
        <div className="flex items-center gap-2 px-2 py-2 mb-2">
          <span className="text-xl text-dark-950 font-extrabold">{t('app_brand')}</span>
        </div>
        <div className="relative mb-3">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"><FaSearch /></div>
          <input className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-dark-200 text-dark-700 placeholder:text-dark-400 focus:outline-none focus:border-primary-500" placeholder="Search here..." />
        </div>
        <nav className="space-y-1 flex-1">
          <SidebarItem active icon={<FaStethoscope />} label="Overview" />
          <SidebarItem icon={<FaCalendarAlt />} label="Appointments" />
          <SidebarItem icon={<FaUsers />} label="Patients" />
          <SidebarItem icon={<FaFileMedical />} label="Reports" />
          <SidebarItem icon={<FaBell />} label="Prescriptions" />
        </nav>
        <div className="mt-auto">
          <button className="w-full btn btn-secondary" onClick={onLogout}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-dark-950">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
            <p className="text-sm text-dark-500">Track, manage and forecast your patient reports and data.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="appearance-none bg-white text-dark-700 border border-dark-200 rounded-lg px-3 py-2 pr-7 text-sm cursor-pointer focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500 focus:ring-opacity-15"
              value={selectedLanguage || 'en'}
              onChange={(e) => onLanguageSelect?.(e.target.value)}
            >
              <option value="en" className="bg-white text-dark-700">English</option>
              <option value="es" className="bg-white text-dark-700">Español</option>
              <option value="fr" className="bg-white text-dark-700">Français</option>
              <option value="de" className="bg-white text-dark-700">Deutsch</option>
              <option value="it" className="bg-white text-dark-700">Italiano</option>
              <option value="pt" className="bg-white text-dark-700">pt</option>
              <option value="ru" className="bg-white text-dark-700">ru</option>
              <option value="zh" className="bg-white text-dark-700">zh</option>
              <option value="ja" className="bg-white text-dark-700">ja</option>
              <option value="ko" className="bg-white text-dark-700">ko</option>
              <option value="ar" className="bg-white text-dark-700">ar</option>
              <option value="hi" className="bg-white text-dark-700">Hindi</option>
            </select>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Patients" value={mock.stats.totalPatients.toLocaleString()} delta={47} positive icon={<FaUsers />} chart={<MiniBars data={mock.stats.trends.patients} />} />
          <StatCard title="New Appointments" value={mock.stats.newAppointments} delta={-10} positive={false} icon={<FaCalendarAlt />} chart={<Sparkline data={mock.stats.trends.appointments} />} />
          <StatCard title="Pending Reports" value={mock.stats.pendingReports} delta={25} positive icon={<FaFileMedical />} chart={<MiniBars data={mock.stats.trends.reports} color="#ef4444" />} />
          <StatCard title="Alerts" value={mock.stats.alerts} delta={5} positive={false} icon={<FaBell />} chart={<Sparkline data={mock.stats.trends.alerts} stroke="#f59e0b" />} />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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

            <div className="bg-white border border-dark-100 rounded-xl p-4 shadow-sm">
              <div className="font-semibold text-dark-900 mb-3">Recent Patient Appointment</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-dark-500">
                      <th className="py-2">Serial</th>
                      <th className="py-2">Date</th>
                      <th className="py-2">Patient</th>
                      <th className="py-2">Assign To</th>
                      <th className="py-2">Room</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-100">
                    {mock.appointments.map((row) => (
                      <tr key={row.id} className="hover:bg-dark-50">
                        <td className="py-2">{row.id}</td>
                        <td className="py-2">{row.date}</td>
                        <td className="py-2">{row.name}</td>
                        <td className="py-2">{row.doctor}</td>
                        <td className="py-2">{row.room}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${row.status === 'Pending' ? 'bg-warning/20 text-warning' : row.status === 'Checked' ? 'bg-success/20 text-success' : 'bg-primary-50 text-primary-700'}`}>{row.status}</span>
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
      </main>
    </div>
  );
};

export default DoctorDashboard;


