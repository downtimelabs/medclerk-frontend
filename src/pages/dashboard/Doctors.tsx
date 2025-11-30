import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Stethoscope, Filter, Clock, ChevronRight, UserPlus, Users, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveDoctorsForPatient, getPatientPendingDoctorRequests, requestDoctorLink, cancelLinkRequest, revokeDoctorLink } from '../../api/linking';
import { discoverDoctors } from '../../api/patient';
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
  <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
        {doctorName.charAt(0)}
      </div>
      <div>
        <h4 className="font-bold text-slate-800 text-sm">{doctorName}</h4>
        <div className="text-xs text-slate-600">{specialization}</div>
        <div className="text-[10px] text-[#0277BD] font-medium mt-0.5">
            {new Date(request.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        className="h-8 text-xs px-3 border-red-200 hover:bg-red-50 text-red-500 hover:border-red-300"
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
  <Card onClick={onClick} className="p-4 hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-[#0277BD]">
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-2xl border-2 border-slate-100 group-hover:border-[#0277BD] transition-colors">
            {doctorName.charAt(0)}
        </div>
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 truncate">{doctorName}</h3>
        <p className="text-sm text-[#0277BD] font-medium truncate">{specialization}</p>
        <p className="text-xs text-slate-500 truncate">{clinicName}</p>
      </div>
      <Button variant="ghost" className="text-slate-400 hover:text-[#0277BD]">
        <ChevronRight size={20} />
      </Button>
    </div>
    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
      <div className="flex items-center gap-1">
        <Clock size={12} />
        Connected
      </div>
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium text-[10px] uppercase tracking-wide">
          Active
        </span>
        <button 
            onClick={onRevoke}
            className="text-red-400 hover:text-red-600 hover:underline"
        >
            Revoke
        </button>
      </div>
    </div>
  </Card>
  );
};

const DoctorResultCard = ({ doctor, onClick, onConnect }: { doctor: any, onClick: () => void, onConnect: (e: any) => void }) => (
  <Card onClick={onClick} className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
    <div className="p-5">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-3xl shadow-sm">
            {doctor.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#0277BD] transition-colors">{doctor.name}</h3>
              <div className="flex items-center gap-1 text-[#0277BD] text-sm font-medium mb-1">
                <Stethoscope size={14} />
                {doctor.profile?.specialization || 'Specialist'}
              </div>
            </div>
            <div className="flex flex-col items-end">
               <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-slate-900">4.8</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
            <MapPin size={12} />
            {doctor.profile?.clinicAddress?.street || doctor.profile?.clinicAddress?.city || 'Location N/A'}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
             <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full">
                {doctor.profile?.yearsOfExperience || 0} Years Exp
             </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
        <Button variant="outline" className="flex-1 h-10 text-sm hover:border-[#0277BD] hover:text-[#0277BD]">
          View Profile
        </Button>
        <Button 
            onClick={onConnect}
            className="flex-1 h-10 text-sm bg-[#0277BD] hover:bg-[#015f96] text-white border-none shadow-md shadow-blue-200"
        >
          <UserPlus size={16} className="mr-2" />
          Connect
        </Button>
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

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [active, pending, discoverable] = await Promise.all([
        getActiveDoctorsForPatient(),
        getPatientPendingDoctorRequests(),
        discoverDoctors()
      ]);
      setActiveDoctors(active);
      setPendingRequests(pending);
      setDiscoverableDoctors(discoverable);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useOnFocus(() => {
    fetchAllData();
  });

  const handleConnect = async (e: any, doctorId: string) => {
    e.stopPropagation();
    try {
      await requestDoctorLink({ doctorId });
      await fetchAllData();
    } catch (error) {
      console.error('Failed to send request:', error);
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
          <h1 className="text-2xl font-bold text-slate-900">Doctors</h1>
          <p className="text-slate-500">Manage your care team and find new specialists</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('my-doctors')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'my-doctors'
                  ? 'border-[#0277BD] text-[#0277BD]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={16} />
                My Care Team
              </div>
            </button>
            <button
              onClick={() => setActiveTab('find-doctors')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'find-doctors'
                  ? 'border-[#0277BD] text-[#0277BD]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
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
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Pending Requests</h3>
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
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Connected Doctors</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{activeDoctors.length} Total</span>
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
                        className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:border-[#0277BD] hover:text-[#0277BD] hover:bg-blue-50 transition-all cursor-pointer min-h-[160px]"
                        >
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-white">
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
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search by name, clinic, or condition..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative w-full md:w-48">
                       <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <input 
                        type="text"
                        placeholder="Location"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] transition-all"
                      />
                    </div>
                    <Button variant="outline" className="px-3 hover:text-[#0277BD] hover:border-[#0277BD]">
                      <Filter size={18} />
                    </Button>
                  </div>
                </div>

                {/* Popular Specializations Chips */}
                <div className="flex flex-wrap gap-2">
                  {popularSpecializations.map((spec, i) => (
                    <button 
                      key={i}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-[#0277BD] hover:text-[#0277BD] transition-colors"
                    >
                      {spec}
                    </button>
                  ))}
                </div>

                {/* Results */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDoctors.map(doctor => (
                    <DoctorResultCard 
                      key={doctor.id} 
                      doctor={doctor} 
                      onClick={() => setSelectedDoctor(doctor)}
                      onConnect={(e) => handleConnect(e, doctor.id)}
                    />
                  ))}
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
      />
    </div>
  );
};

export default Doctors;
