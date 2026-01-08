import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Check, 
  X,
  UserX,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getDoctorPatients, 
  searchDoctorPatients,
  getPendingPatientRequests,
  approvePatientRequest,
  rejectPatientRequest,
  revokePatientLink
} from '../../api/doctor';
import type { 
  PatientInfo, 
  LinkRequest 
} from '../../interfaces/doctor';

const DoctorPatients = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  const [activePatients, setActivePatients] = useState<PatientInfo[]>([]);
  const [pendingRequests, setPendingRequests] = useState<LinkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCount, setActiveCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'active') {
        if (searchTerm) {
          const data = await searchDoctorPatients({ q: searchTerm });
          setActivePatients(data.patients);
          setActiveCount(data.total);
        } else {
          const data = await getDoctorPatients({ status: 'ACTIVE' });
          setActivePatients(data.patients);
          setActiveCount(data.total);
        }
        // Also fetch pending count for the tab badge
        const pendingData = await getPendingPatientRequests();
        setPendingCount(pendingData.total);
      } else {
        const data = await getPendingPatientRequests();
        setPendingRequests(data.requests);
        setPendingCount(data.total);
        // Also fetch active count for the tab badge
        const activeData = await getDoctorPatients({ status: 'ACTIVE' });
        setActiveCount(activeData.total);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab, searchTerm]);

  const handleApprove = async (id: string) => {
    try {
      await approvePatientRequest(id);
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Error approving patient:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this request?')) return;
    try {
      await rejectPatientRequest(id);
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Error rejecting patient:', error);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to remove this patient? They will no longer be linked to you.')) return;
    try {
      await revokePatientLink(id);
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Error revoking patient:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight">Patients</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Manage your patient directory and access requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-[#0277BD] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:text-slate-100 dark:placeholder:text-slate-600 w-full sm:w-72 transition-all font-medium"
            />
          </div>
          <button className="p-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-[#0277BD] dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-4 text-sm font-bold transition-all relative tracking-[0.1em] uppercase ${
              activeTab === 'active' 
                ? 'text-[#0277BD] dark:text-blue-400' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Active Patients
            <span className={`ml-3 px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all ${
              activeTab === 'active' 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-[#0277BD] dark:text-blue-400' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              {activeCount}
            </span>
            {activeTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0277BD] dark:bg-blue-500 rounded-t-full shadow-[0_-2px_8px_rgba(2,119,189,0.4)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-4 text-sm font-bold transition-all relative tracking-[0.1em] uppercase ${
              activeTab === 'pending' 
                ? 'text-[#0277BD] dark:text-blue-400' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Pending Requests
            <span className={`ml-3 px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all shadow-sm ${
              activeTab === 'pending' 
                ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              {pendingCount}
            </span>
            {activeTab === 'pending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0277BD] dark:bg-blue-500 rounded-t-full shadow-[0_-2px_8px_rgba(2,119,189,0.4)]" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden shadow-blue-500/5 transition-all">
        {loading ? (
          <div className="p-20 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 dark:border-slate-800 border-t-[#0277BD] dark:border-t-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 dark:bg-slate-950/50">
                <tr>
                  <th className="px-8 py-5 text-left text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Patient Profile</th>
                  <th className="px-8 py-5 text-left text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    {activeTab === 'active' ? 'Contact Information' : 'Request Received'}
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Verification</th>
                  <th className="px-8 py-5 text-right text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeTab === 'active' ? (
                  activePatients.length > 0 ? (
                    activePatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#0277BD] dark:text-blue-400 font-extrabold text-base shadow-sm group-hover:scale-110 transition-transform duration-300">
                              {patient.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-950 dark:text-white text-base group-hover:text-[#0277BD] dark:group-hover:text-blue-400 transition-colors">{patient.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                          {patient.email}
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                            Verified
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                              className="p-3 text-[#0277BD] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-[#0277BD] dark:hover:bg-blue-500 hover:text-white rounded-2xl transition-all active:scale-90 shadow-sm"
                              title="View Details"
                            >
                              <Eye size={20} />
                            </button>
                            <button 
                              onClick={() => handleRevoke(patient.id)}
                              className="p-3 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 hover:text-white rounded-2xl transition-all active:scale-90 shadow-sm"
                              title="Revoke Access"
                            >
                              <UserX size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                        No active patients found matching your search.
                      </td>
                    </tr>
                  )
                ) : (
                  pendingRequests.length > 0 ? (
                    pendingRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-extrabold text-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                              {request.patient?.name.charAt(0) || '?'}
                            </div>
                            <span className="font-bold text-slate-950 dark:text-white text-base group-hover:text-orange-500 transition-colors">{request.patient?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-500 dark:text-slate-400 font-bold">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30">
                            Action Pending
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => handleApprove(request.id)}
                              className="p-3 text-white bg-green-600 hover:bg-green-700 rounded-2xl transition-all active:scale-90 shadow-lg shadow-green-500/20"
                              title="Approve"
                            >
                              <Check size={20} strokeWidth={3} />
                            </button>
                            <button 
                              onClick={() => handleReject(request.id)}
                              className="p-3 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white rounded-2xl transition-all active:scale-90 shadow-sm"
                              title="Reject"
                            >
                              <X size={20} strokeWidth={3} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                        No pending requests found.
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;
