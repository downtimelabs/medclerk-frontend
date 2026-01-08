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
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome Back, <span className="text-[#0277BD]">
              {profile?.personal?.name ? profile.personal.name.charAt(0).toUpperCase() + profile.personal.name.slice(1).split(' ')[0] : 'Patient'}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening with your health account today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/patient/documents')} variant="outline" className="hidden sm:flex">
            <FileText size={16} className="mr-2" />
            My Documents
          </Button>
          <Button onClick={() => navigate('/patient/doctors')} className="bg-[#0277BD] hover:bg-[#015f96] text-white shadow-lg shadow-blue-200/50">
            <Plus size={16} className="mr-2" />
            Find Doctor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column (Main Content) - Span 2 */}
        <div className="xl:col-span-2 space-y-6">

          {/* Care Team Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Active Care Team
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full">{activeDoctors.length}</span>
              </h2>
              <Button variant="ghost" className="text-sm text-[#0277BD] hover:text-[#015f96] p-0 h-auto font-medium" onClick={() => navigate('/patient/doctors')}>
                View All
              </Button>
            </div>

            {activeDoctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeDoctors.map((doctor) => (
                  <Card key={doctor.id} className="p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-lg border border-slate-100 dark:border-slate-700 group-hover:border-[#0277BD] transition-colors">
                        {doctor.name?.charAt(0) || 'D'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{doctor.name}</h3>
                      <p className="text-xs text-[#0277BD] dark:text-blue-400 font-medium truncate">{doctor.specialization || 'General'}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <MapPin size={10} />
                        <span className="truncate">{doctor.clinicName || 'Clinic'}</span>
                      </div>
                    </div>
                  </Card>
                ))}
                <Card className="flex flex-col items-center justify-center gap-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#0277BD] dark:hover:border-blue-400 cursor-pointer transition-all min-h-[88px]" onClick={() => navigate('/patient/doctors')}>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                    <Plus size={16} />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Add New Doctor</span>
                </Card>
              </div>
            ) : (
              <Card className="p-8 flex flex-col items-center justify-center text-center border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40">
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

          {/* Document Distribution Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Documents</h2>
              <Button variant="ghost" className="text-sm text-[#0277BD] hover:text-[#015f96] p-0 h-auto font-medium" onClick={() => navigate('/patient/documents')}>
                View All
              </Button>
            </div>
            <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Storage Overview</h3>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>{documentStats?.totalDocuments || 0} Files</span>
                  <span>{((documentStats?.totalFileSize || 0) / (1024 * 1024)).toFixed(1)} MB Used</span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {documentStats?.documentsByType && Object.entries(documentStats.documentsByType).map(([type, count], idx) => {
                  const styles = [
                    { border: 'border-blue-100 dark:border-blue-900/30', bg: 'hover:bg-blue-50/80 dark:hover:bg-blue-900/20', icon: 'text-blue-600 dark:text-blue-400', fill: 'bg-blue-100 dark:bg-blue-900/30' },
                    { border: 'border-indigo-100 dark:border-indigo-900/30', bg: 'hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20', icon: 'text-indigo-600 dark:text-indigo-400', fill: 'bg-indigo-100 dark:bg-indigo-900/30' },
                    { border: 'border-teal-100 dark:border-teal-900/30', bg: 'hover:bg-teal-50/80 dark:hover:bg-teal-900/20', icon: 'text-teal-600 dark:text-teal-400', fill: 'bg-teal-100 dark:bg-teal-900/30' },
                    { border: 'border-slate-100 dark:border-slate-700/30', bg: 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30', icon: 'text-slate-600 dark:text-slate-400', fill: 'bg-slate-100 dark:bg-slate-700/30' },
                  ];
                  const style = styles[idx % styles.length];

                  return (
                    <div key={type} className={`group flex items-center justify-between p-3 rounded-xl border ${style.border} bg-white dark:bg-slate-800 dark:border-slate-700 ${style.bg} dark:hover:bg-slate-700 transition-all duration-200 cursor-default`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${style.fill} flex items-center justify-center`}>
                          <FileText size={18} className={style.icon} />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize block">
                            {type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Document</span>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-slate-900 dark:text-white pr-2">{count}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>
        </div>

        {/* Right Column (Sidebar) - Span 1 */}
        <div className="space-y-6">

          {/* My Health Widget - Vertical & Compact */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Vitals</h2>
              <Button variant="ghost" className="text-sm text-[#0277BD] hover:text-[#015f96] p-0 h-auto font-medium" onClick={() => navigate('/patient/settings')}>
                Edit
              </Button>
            </div>
            <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-premium dark:shadow-premium-dark transition-all duration-300">
              <div className="p-5 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Blood Group</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-xl">
                    {profile?.medical?.bloodGroup || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Height & Weight</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{profile?.medical?.heightCm ? `${profile.medical.heightCm} cm` : '-'}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{profile?.medical?.weightKg ? `${profile.medical.weightKg} kg` : '-'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Known Conditions</span>
                  <div className="flex flex-wrap gap-2">
                    {(profile?.medical?.chronicConditions?.length || 0) > 0 ? (
                      profile?.medical?.chronicConditions.map((condition, i) => (
                        <span key={i} className="px-2.5 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-semibold rounded-lg border border-teal-100 dark:border-teal-900/30">
                          {condition}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400 dark:text-slate-500 italic">None listed</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Allergies</span>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {profile?.medical?.allergies || 'No known allergies'}
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Quick Stats Grid - Vertical Stack */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Activity</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                <div className="mb-2 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Plus size={16} />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{documentStats?.recentUploads || 0}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">New Uploads</div>
              </Card>
              <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-orange-300 dark:hover:border-orange-700 transition-colors group">
                <div className="mb-2 w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <FileText size={16} />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {((documentStats?.totalFileSize || 0) / (1024 * 1024)).toFixed(0)}<span className="text-xs font-normal text-slate-400 ml-0.5">MB</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Storage Used</div>
              </Card>
            </div>
          </section>

          {/* Promo / Tip Card */}
          <Card className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
            <h4 className="font-bold text-lg mb-2">Did you know?</h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              You can share your health records securely with any connected doctor instantly.
            </p>
            <Button
              className="w-full bg-white text-slate-900 hover:bg-slate-100 border-none h-8 text-xs"
              onClick={() => navigate('/patient/documents')}
            >
              Upload Records
            </Button>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default Overview;
