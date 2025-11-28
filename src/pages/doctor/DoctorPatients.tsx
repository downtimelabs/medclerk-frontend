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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Patients</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your patient list and requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 w-full sm:w-64"
            />
          </div>
          <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === 'active' 
                ? 'text-[#0277BD] dark:text-blue-400' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Active Patients
            <span className="ml-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full text-xs">
              {activeCount}
            </span>
            {activeTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0277BD] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === 'pending' 
                ? 'text-[#0277BD] dark:text-blue-400' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Pending Requests
            <span className="ml-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full text-xs">
              {pendingCount}
            </span>
            {activeTab === 'pending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0277BD] rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0277BD]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {activeTab === 'active' ? 'Contact' : 'Requested On'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {activeTab === 'active' ? (
                  activePatients.length > 0 ? (
                    activePatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#0277BD] dark:text-blue-400 font-bold">
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
                          <button 
                            onClick={() => handleRevoke(patient.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Revoke Access"
                          >
                            <UserX size={18} />
                          </button>
                          <button 
                            onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                            className="text-[#0277BD] hover:text-blue-700 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
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
                      <tr key={request.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">
                              {request.patient?.name.charAt(0) || '?'}
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">{request.patient?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleApprove(request.id)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => handleReject(request.id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <X size={18} />
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
