import { useEffect, useState } from 'react';
import { 
  FileText, 
  MapPin,
  Plus,
  Loader2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { getPatientProfile, getPatientDocumentStats } from '../../api/patient';
import { getActiveDoctorsForPatient } from '../../api/linking';
import { useOnFocus } from '../../hooks/useRefresh';
import type { PatientProfile, DocumentStats } from '../../interfaces/patient';
import type { LinkedDoctor } from '../../interfaces/linking';

const Overview = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [documentStats, setDocumentStats] = useState<DocumentStats | null>(null);
  const [activeDoctors, setActiveDoctors] = useState<LinkedDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [profileData, docStatsData, doctorsData] = await Promise.all([
        getPatientProfile(),
        getPatientDocumentStats(),
        getActiveDoctorsForPatient()
      ]);
      setProfile(profileData);
      setDocumentStats(docStatsData);
      setActiveDoctors(doctorsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Refetch on focus to prevent stale data
  useOnFocus(() => {
    fetchAllData();
  });



  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0277BD]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-8">
      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome Back, <span className="text-[#0277BD]">
                {profile?.personal?.name ? profile.personal.name.charAt(0).toUpperCase() + profile.personal.name.slice(1).split(' ')[0] : 'Patient'}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              You have <span className="font-semibold text-slate-900 dark:text-white">{activeDoctors.length} active doctors</span> and <span className="font-semibold text-slate-900 dark:text-white">{documentStats?.totalDocuments || 0} documents</span>.
            </p>
          </div>
        </div>

        {/* Care Team Section - Horizontal Scroll */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Care Team</h2>
            <Button variant="ghost" className="text-sm text-[#0277BD] dark:text-blue-400 hover:text-[#015f96] dark:hover:text-blue-300 p-0 h-auto font-medium" onClick={() => navigate('/patient/doctors')}>
              View All
            </Button>
          </div>
          
          {activeDoctors.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {activeDoctors.map((doctor) => (
                <Card key={doctor.id} className="min-w-[280px] p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group border-slate-200 dark:border-slate-700">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-sm border-2 border-slate-100 dark:border-slate-600 group-hover:border-[#0277BD] transition-colors">
                      {doctor.name?.charAt(0) || 'D'}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                  </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{doctor.name}</h3>
                      <p className="text-xs text-[#0277BD] dark:text-blue-400 font-medium truncate">{doctor.specialization || 'General'}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <MapPin size={10} />
                        <span className="truncate">{doctor.clinicName || 'Clinic'}</span>
                      </div>
                    </div>
                </Card>
              ))}
              <Card className="min-w-[100px] flex flex-col items-center justify-center gap-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#0277BD] dark:hover:border-blue-400 cursor-pointer transition-all" onClick={() => navigate('/patient/doctors')}>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <Plus size={16} />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Add New</span>
              </Card>
            </div>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center text-center border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#0277BD] dark:text-blue-400 mb-3">
                <Plus size={24} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No Doctors Linked</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-xs">Connect with your doctors to share records and manage appointments.</p>
              <Button onClick={() => navigate('/patient/doctors')} className="bg-[#0277BD] hover:bg-[#015f96] text-white">
                Find Doctors
              </Button>
            </Card>
          )}
        </section>

        {/* Document Statistics - Unified Section */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Document Overview</h2>
          <Card className="p-6 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Document Types List */}
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">Document Types</h3>
                {documentStats?.documentsByType && Object.entries(documentStats.documentsByType).map(([type, count], idx) => {
                  // Alternate between blue and orange variations
                  const colors = [
                    { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
                    { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' },
                    { bg: 'bg-blue-100 dark:bg-blue-800/20', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-600' },
                    { bg: 'bg-orange-100 dark:bg-orange-800/20', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-600' },
                    { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400', dot: 'bg-cyan-500' }
                  ];
                  const color = colors[idx % colors.length];
                  
                  return (
                    <div key={type} className={`${color.bg} rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${color.dot}`}></div>
                        <div className="flex items-center gap-2">
                          <FileText size={18} className={color.text} />
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {type.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                      <span className={`text-2xl font-bold ${color.text}`}>{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Right: Stats Cards (Centered) */}
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Recent Uploads */}
                <div className="w-full bg-gradient-to-br from-[#0277BD] to-[#015f96] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10 text-center">
                    <p className="text-sm text-blue-100 uppercase tracking-wide font-medium mb-2">Recent Uploads</p>
                    <p className="text-4xl font-bold mb-1">{documentStats?.recentUploads || 0}</p>
                    <p className="text-xs text-blue-100 mt-2">This month</p>
                  </div>
                </div>

                {/* Total Size */}
                <div className="w-full bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10 text-center">
                    <p className="text-sm text-orange-100 uppercase tracking-wide font-medium mb-2">Storage Used</p>
                    <p className="text-4xl font-bold mb-1">
                      {((documentStats?.totalFileSize || 0) / (1024 * 1024)).toFixed(1)} MB
                    </p>
                    <p className="text-xs text-orange-100 mt-2">Total size</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

      </div>
    </div>
  );
};

export default Overview;
