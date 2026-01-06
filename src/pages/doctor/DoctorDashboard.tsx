import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Clock,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { 
  getDoctorStats, 
  getDoctorPatients, 
  getPendingPatientRequests,
  getDoctorProfile
} from '../../api/doctor';
import type { 
  DoctorStats, 
  PatientInfo, 
  LinkRequest,
  CompleteDoctorProfile
} from '../../interfaces/doctor';

const DoctorDashboard = () => {
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [activePatients, setActivePatients] = useState<PatientInfo[]>([]);
  const [pendingRequests, setPendingRequests] = useState<LinkRequest[]>([]);
  const [profile, setProfile] = useState<CompleteDoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activeData, pendingData, profileData] = await Promise.all([
          getDoctorStats(),
          getDoctorPatients({ status: 'ACTIVE', limit: 5 }),
          getPendingPatientRequests(),
          getDoctorProfile()
        ]);
        setStats(statsData);
        setActivePatients(activeData.patients); 
        setPendingRequests(pendingData.requests.slice(0, 5));
        setPendingCount(pendingData.total);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-800 border-t-[#0277BD] dark:border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight">
          Good Morning, <span className="text-[#0277BD] dark:text-blue-400">{profile?.name || 'Doctor'}</span>!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
          Here's a summary of your medical practice today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl group">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl group-hover:scale-110 transition-transform">
              <Users className="text-[#0277BD] dark:text-blue-400" size={28} />
            </div>
            <span className="flex items-center text-[10px] font-extrabold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-3 py-1.5 rounded-xl uppercase tracking-wider">
              +2.5%
            </span>
          </div>
          <h3 className="text-4xl font-extrabold text-slate-950 dark:text-white mb-2 tracking-tight">
            {stats?.patients.active || 0}
          </h3>
          <p className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Active Patients</p>
        </Card>

        <Card className="p-8 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl group">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-2xl group-hover:scale-110 transition-transform">
              <UserPlus className="text-orange-500 dark:text-orange-400" size={28} />
            </div>
            <span className="flex items-center text-[10px] font-extrabold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-3 py-1.5 rounded-xl uppercase tracking-wider">
              Action Required
            </span>
          </div>
          <h3 className="text-4xl font-extrabold text-slate-950 dark:text-white mb-2 tracking-tight">
            {pendingCount}
          </h3>
          <p className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Pending Requests</p>
        </Card>

        <Card className="p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl group">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl group-hover:scale-110 transition-transform">
              <FileText className="text-purple-500 dark:text-purple-400" size={28} />
            </div>
            <span className="flex items-center text-[10px] font-extrabold text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
          <h3 className="text-4xl font-extrabold text-slate-950 dark:text-white mb-2 tracking-tight">
            --
          </h3>
          <p className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Documents Accessible</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Patients List */}
        <div className="lg:col-span-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white tracking-tight">Recent Patients</h2>
            <button className="text-sm font-extrabold text-[#0277BD] hover:underline dark:text-blue-400 flex items-center gap-1.5 transition-all uppercase tracking-wider">
              View Directory <ChevronRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 dark:bg-slate-950/50">
                <tr>
                  <th className="px-8 py-5 text-left text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Patient</th>
                  <th className="px-8 py-5 text-left text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Contact Information</th>
                  <th className="px-8 py-5 text-left text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-right text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activePatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#0277BD] dark:text-blue-400 font-extrabold text-sm shadow-sm group-hover:scale-110 transition-transform">
                          {patient.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-[#0277BD] dark:group-hover:text-blue-400 transition-colors">{patient.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {patient.email}
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                        Verified
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-400 hover:text-[#0277BD] dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {activePatients.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                      No active patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white tracking-tight">Linking Requests</h2>
            <span className="bg-orange-100 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-xl border border-orange-200 dark:border-orange-900/50">
              {pendingCount} Pending
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {pendingRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-extrabold text-lg shadow-sm group-hover:scale-110 transition-transform">
                      {request.patient?.name.charAt(0) || '?'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-950 dark:text-white text-base tracking-tight">{request.patient?.name || 'Unknown Patient'}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">
                        <Clock size={12} />
                        <span>Requested {new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 bg-[#0277BD] dark:bg-blue-600 hover:bg-[#01579B] dark:hover:bg-blue-500 text-white text-[10px] font-extrabold uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                    Accept Access
                  </button>
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest py-3.5 rounded-xl transition-all active:scale-95">
                    Decline
                  </button>
                </div>
              </div>
            ))}
            {pendingRequests.length === 0 && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No pending requests.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
