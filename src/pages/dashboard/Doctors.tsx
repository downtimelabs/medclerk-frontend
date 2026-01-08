import { useState, useEffect } from 'react';
import { Search, MapPin, Stethoscope, Filter, Clock, ChevronRight, UserPlus, Users, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveDoctorsForPatient, getPatientPendingDoctorRequests, requestDoctorLink, cancelLinkRequest, revokeDoctorLink } from '../../api/linking';
import { searchDoctors } from '../../api/discovery';
import { useOnFocus } from '../../hooks/useRefresh';
import DoctorProfileModal from '../../components/dashboard/DoctorProfileModal';
import type { LinkedDoctor, PatientDoctorRequest } from '../../interfaces/linking';

// --- Components ---

const PendingRequestItem = ({ request, onCancel }: { request: any, onCancel: () => void }) => {
  // Debug log
  // console.log('Pending Request Item:', request);
  const doctorName = request.doctor?.name || request.doctorName || request.name || 'Unknown Doctor';
  const specialization = request.doctor?.specialization || request.doctorProfile?.specialization || 'Specialist';

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-lg">
          {doctorName.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{doctorName}</h4>
          <div className="text-xs text-slate-600 dark:text-slate-400">{specialization}</div>
          <div className="text-[10px] text-[#0277BD] dark:text-blue-400 font-medium mt-0.5">
            {new Date(request.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="h-8 text-xs px-3 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 hover:border-red-300 dark:hover:border-red-800"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

const LinkedDoctorCard = ({ doctor, onClick, onRevoke }: { doctor: any, onClick: () => void, onRevoke: (e: any) => void }) => {
  // Debug log
  // console.log('Linked Doctor Card:', doctor);
  const doctorName = doctor.name || doctor.doctor?.name || doctor.doctorName || 'Unknown Doctor';
  const specialization = doctor.specialization || doctor.doctor?.specialization || doctor.doctorProfile?.specialization || 'Specialist';
  const clinicName = doctor.clinicName || doctor.doctor?.clinicName || doctor.doctorProfile?.clinicName || 'Clinic';

  return (
    <Card onClick={onClick} className="p-4 hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-[#0277BD] bg-white dark:bg-slate-900/50 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-2xl border-2 border-slate-100 dark:border-slate-700 group-hover:border-[#0277BD] transition-colors">
            {doctorName.charAt(0)}
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white truncate">{doctorName}</h3>
          <p className="text-sm text-[#0277BD] dark:text-blue-400 font-medium truncate">{specialization}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{clinicName}</p>
        </div>
        <Button variant="ghost" className="text-slate-400 hover:text-[#0277BD] dark:hover:text-blue-400">
          <ChevronRight size={20} />
        </Button>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          Connected
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full font-medium text-[10px] uppercase tracking-wide">
            Active
          </span>
          <button
            onClick={onRevoke}
            className="text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:underline"
          >
            Revoke
          </button>
        </div>
      </div>
    </Card>
  );
};

const DoctorResultCard = ({ doctor, onClick, onConnect, isConnecting, isPending }: { doctor: any, onClick: () => void, onConnect: (e: any) => void, isConnecting: boolean, isPending: boolean }) => (
  <Card onClick={onClick} className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white dark:bg-slate-900/50 dark:border-slate-800">
    <div className="p-5">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          {doctor.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-[#0277BD] transition-colors">{doctor.name}</h3>
              <div className="flex items-center gap-1 text-[#0277BD] dark:text-blue-400 text-sm font-medium mb-1">
                <Stethoscope size={14} />
                {doctor.profile?.specialization || 'Specialist'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1">
            <MapPin size={12} />
            {doctor.profile?.clinicAddress?.street || doctor.profile?.clinicAddress?.city || 'Location N/A'}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium rounded-full">
              {doctor.profile?.yearsOfExperience || 0} Years Exp
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          className="flex-1 h-11 text-sm hover:border-[#0277BD] hover:text-[#0277BD] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Profile
        </Button>
        {isPending ? (
          <Button
            disabled
            className="flex-1 h-11 text-sm bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-500 border-none cursor-not-allowed"
          >
            <Clock size={16} className="mr-2" />
            Pending
          </Button>
        ) : (
          <Button
            onClick={onConnect}
            disabled={isConnecting}
            className="flex-1 h-11 text-sm bg-[#0277BD] hover:bg-[#015f96] text-white border-none shadow-premium dark:shadow-premium-dark disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : (
              <UserPlus size={16} className="mr-2" />
            )}
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        )}
      </div>
    </div>
  </Card>
);

const Doctors = () => {
  const [activeTab, setActiveTab] = useState<'my-doctors' | 'find-doctors'>('my-doctors');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [activeDoctors, setActiveDoctors] = useState<LinkedDoctor[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PatientDoctorRequest[]>([]);
  const [discoverableDoctors, setDiscoverableDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [active, pending, discoverable] = await Promise.all([
        getActiveDoctorsForPatient(),
        getPatientPendingDoctorRequests(),
        searchDoctors({})
      ]);
      setActiveDoctors(active);
      setPendingRequests(pending);
      setDiscoverableDoctors(discoverable.doctors);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Poll for updates every 5 minutes
    const interval = setInterval(() => {
      // Silent update (don't set loading to true)
      getActiveDoctorsForPatient().then(setActiveDoctors);
      getPatientPendingDoctorRequests().then(setPendingRequests);
      searchDoctors({}).then(res => setDiscoverableDoctors(res.doctors));
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  useOnFocus(() => {
    fetchAllData();
  });

  const handleConnect = async (e: any, doctorId: string) => {
    e.stopPropagation();
    try {
      setConnectingId(doctorId);
      await requestDoctorLink({ doctorId });
      await fetchAllData();
    } catch (error: any) {
      console.error('Failed to send request:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      setConnectingId(null);
    }
  };

  const handleCancelRequest = async (linkId: string) => {
    if (confirm('Are you sure you want to cancel this request?')) {
      try {
        await cancelLinkRequest(linkId);
        await fetchAllData();
      } catch (error) {
        console.error('Failed to cancel request:', error);
      }
    }
  };

  const handleRevokeLink = async (e: any, linkId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this doctor from your care team?')) {
      try {
        await revokeDoctorLink(linkId);
        await fetchAllData();
      } catch (error) {
        console.error('Failed to revoke link:', error);
      }
    }
  };

  const popularSpecializations = [
    "Cardiologist", "Dermatologist", "Pediatrician", "General Physician", "Neurologist", "Orthopedic"
  ];

  // Filter discoverable doctors
  const filteredDoctors = discoverableDoctors.filter(doc =>
    doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.profile?.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Doctors</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your care team and find new specialists</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-premium dark:shadow-premium-dark border border-slate-200 dark:border-slate-800 overflow-hidden backdrop-blur-sm">
        <div className="border-b border-slate-200 dark:border-slate-800">
          <nav className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('my-doctors')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'my-doctors'
                ? 'border-[#0277BD] text-[#0277BD]'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
            >
              <div className="flex items-center gap-2">
                <Users size={16} />
                My Care Team
              </div>
            </button>
            <button
              onClick={() => setActiveTab('find-doctors')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'find-doctors'
                ? 'border-[#0277BD] text-[#0277BD]'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
            >
              <div className="flex items-center gap-2">
                <Search size={16} />
                Find Doctors
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'my-doctors' ? (
              <motion.div
                key="my-doctors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-4 px-1">Pending Requests</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {pendingRequests.map(req => (
                        <PendingRequestItem
                          key={req.id}
                          request={req}
                          onCancel={() => handleCancelRequest(req.id)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Linked Doctors */}
                <section>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Connected Doctors</h3>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">{activeDoctors.length} Total</span>
                  </div>

                  {loading && activeDoctors.length === 0 ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="animate-spin text-[#0277BD]" />
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {activeDoctors.map(doctor => (
                        <LinkedDoctorCard
                          key={doctor.id}
                          doctor={doctor}
                          onClick={() => setSelectedDoctor(doctor)}
                          onRevoke={(e) => handleRevokeLink(e, doctor.linkId)}
                        />
                      ))}

                      {/* Add New Placeholder */}
                      <div
                        onClick={() => setActiveTab('find-doctors')}
                        className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-[#0277BD] dark:hover:border-blue-600 hover:text-[#0277BD] dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer min-h-[160px]"
                      >
                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                          <UserPlus size={24} />
                        </div>
                        <span className="font-medium">Connect New Doctor</span>
                      </div>
                    </div>
                  )}
                </section>
              </motion.div>
            ) : (
              <motion.div
                key="find-doctors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Search & Filter Bar */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search by name, clinic, or condition..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative w-full md:w-48">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <input
                        type="text"
                        placeholder="Location"
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all"
                      />
                    </div>
                    <Button variant="outline" className="px-3 hover:text-[#0277BD] hover:border-[#0277BD] dark:border-slate-800 dark:text-slate-400 dark:hover:text-blue-400">
                      <Filter size={18} />
                    </Button>
                  </div>
                </div>

                {/* Popular Specializations Chips */}
                <div className="flex flex-wrap gap-2">
                  {popularSpecializations.map((spec, i) => (
                    <button
                      key={i}
                      className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-[#0277BD] dark:hover:border-blue-600 hover:text-[#0277BD] dark:hover:text-blue-400 transition-colors"
                    >
                      {spec}
                    </button>
                  ))}
                </div>

                {/* Results */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDoctors.map(doctor => {
                    const isPending = pendingRequests.some(req => req.doctorId === doctor.id);
                    return (
                      <DoctorResultCard
                        key={doctor.id}
                        doctor={doctor}
                        onClick={() => setSelectedDoctor(doctor)}
                        onConnect={(e) => handleConnect(e, doctor.id)}
                        isConnecting={connectingId === doctor.id}
                        isPending={isPending}
                      />
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DoctorProfileModal
        doctor={selectedDoctor}
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        isConnected={activeDoctors.some(doc => doc.id === selectedDoctor?.id)}
      />
    </div>
  );
};

export default Doctors;
