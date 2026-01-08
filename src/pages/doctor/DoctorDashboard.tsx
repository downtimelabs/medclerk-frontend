import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Clock,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0277BD]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Good Morning, {profile?.name || 'Doctor'}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Here's what's happening with your patients today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Users className="text-[#0277BD] dark:text-blue-400" size={24} />
            </div>
            <span className="flex items-center text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
              +2.5%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
            {stats?.patients.active || 0}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Active Patients</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <UserPlus className="text-orange-500 dark:text-orange-400" size={24} />
            </div>
            <span className="flex items-center text-xs font-medium text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
              Action Needed
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
            {pendingCount}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pending Requests</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <FileText className="text-purple-500 dark:text-purple-400" size={24} />
            </div>
            <span className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
              Coming Soon
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
            --
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Documents Accessible</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Patients List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Patients</h2>
            <button className="text-sm font-medium text-[#0277BD] hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {activePatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#0277BD] dark:text-blue-400 font-bold text-xs">
                          {patient.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{patient.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {patient.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
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
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Pending Requests</h2>
            <span className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold px-2 py-1 rounded-lg">
              {pendingCount} New
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {pendingRequests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">
                      {request.patient?.name.charAt(0) || '?'}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">{request.patient?.name || 'Unknown Patient'}</h4>
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock size={12} />
                        <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-[#0277BD] hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg transition-colors">
                    Approve
                  </button>
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium py-2 rounded-lg transition-colors">
                    Reject
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
