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
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" />
    </svg>
  );
};

const MiniBars = ({ data, color = '#0ea5e9' }) => {
  const width = 120;
  const height = 36;
  const max = Math.max(...data, 1);
  const barWidth = width / data.length - 2;
  return (
    <svg width={width} height={height}>
      {data.map((v, i) => {
        const h = (v / max) * (height - 4);
        return <rect key={i} x={i * (barWidth + 2)} y={height - h - 2} width={barWidth} height={h} rx="2" fill={color} />;
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
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      <path d={area} fill={fill} stroke="none" />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
};

const LargeBars = ({ data, color = '#0ea5e9', height = 96 }) => {
  const w = 100;
  const h = 30;
  const max = Math.max(...data, 1);
  const barW = w / data.length - 1;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      {data.map((v, i) => {
        const bh = (v / max) * (h - 1);
        const x = i * (barW + 1);
        const y = h - bh;
        return <rect key={i} x={x} y={y} width={barW} height={bh} rx="0.6" fill={color} />;
      })}
    </svg>
  );
};

const StatCard = ({ title, value, delta, positive, icon, chart }) => (
  <div className="bg-white border border-dark-100 rounded-xl p-4 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <div className="text-sm text-dark-500 font-medium">{title}</div>
      <div className="text-primary-500 text-lg">{icon}</div>
    </div>
    <div className="flex items-end gap-2">
      <div className="text-2xl font-bold text-dark-950">{value}</div>
      {delta !== undefined && (
        <div className={`text-xs font-semibold ${positive ? 'text-green-600' : 'text-error'}`}>{delta}%</div>
      )}
    </div>
    {chart && <div className="mt-2">{chart}</div>}
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
          <SidebarItem icon={<FaUserMd />} label="Doctors" />
          <SidebarItem icon={<FaUsers />} label="Patients" />
          <SidebarItem icon={<FaFileMedical />} label="Reports" />
          <SidebarItem icon={<FaComments />} label="Messages" badge={5} />
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
            <div className="bg-white border border-dark-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-dark-900">Visitors Statistics</div>
                <select className="bg-white border border-dark-200 rounded-md text-sm px-2 py-1">
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                </select>
              </div>
              <LargeLineChart data={mock.visitors.last30} stroke="#6366f1" fill="rgba(99,102,241,0.12)" height={192} />
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
            <div className="bg-white border border-dark-100 rounded-xl p-4 shadow-sm">
              <div className="font-semibold text-dark-900 mb-2">Blood Cancer Patient</div>
              <LargeLineChart data={mock.cancerTrend} stroke="#ef4444" fill="rgba(239,68,68,0.12)" height={110} />
            </div>
            <div className="bg-white border border-primary-500/40 rounded-xl p-4 shadow-sm">
              <div className="font-semibold text-dark-900 mb-2">Kidney Damage Patient</div>
              <LargeBars data={mock.kidneyTrend} color="#6366f1" height={110} />
              <div className="text-right text-primary-600 font-bold text-xl mt-2">{mock.kidneyDamageAdmitted}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;


