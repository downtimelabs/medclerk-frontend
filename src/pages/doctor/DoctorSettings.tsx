import { useState, useEffect } from 'react';
import { 
  Save, 
  User, 
  Briefcase, 
  MapPin, 
  Phone, 
  Mail,
  Building
} from 'lucide-react';
import { 
  getDoctorProfile, 
  updateDoctorPersonal, 
  updateDoctorProfessional 
} from '../../api/doctor';
import type { 
  CompleteDoctorProfile, 
  UpdateDoctorPersonalInfo, 
  UpdateDoctorProfessionalInfo 
} from '../../interfaces/doctor';

const DoctorSettings = () => {
  const [profile, setProfile] = useState<CompleteDoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingProfessional, setSavingProfessional] = useState(false);

  // Form States
  const [personalForm, setPersonalForm] = useState<UpdateDoctorPersonalInfo>({
    name: '',
    phoneNumber: '',
  });

  const [professionalForm, setProfessionalForm] = useState<UpdateDoctorProfessionalInfo>({
    specialization: '',
    yearsOfExperience: 0,
    clinicName: '',
    clinicAddress: { street: '' } // Initialize as needed or handle null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getDoctorProfile();
        setProfile(data);
        
        // Initialize forms
        setPersonalForm({
          name: data.name || '',
          phoneNumber: data.phoneNumber || '',
        });

        setProfessionalForm({
          specialization: data.profile.specialization || '',
          yearsOfExperience: data.profile.yearsOfExperience || 0,
          clinicName: data.profile.clinicName || '',
          clinicAddress: data.profile.clinicAddress || { street: '' }
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPersonal(true);
    try {
      const updatedProfile = await updateDoctorPersonal(personalForm);
      // Merge partial update
      if (profile) {
        setProfile({ ...profile, ...updatedProfile });
      }
      alert('Personal information updated successfully!');
    } catch (error) {
      console.error('Error updating personal info:', error);
      alert('Failed to update personal information.');
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleProfessionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfessional(true);
    try {
      const updatedProfileSection = await updateDoctorProfessional(professionalForm);
      if (profile) {
        setProfile({ ...profile, profile: updatedProfileSection });
      }
      alert('Professional information updated successfully!');
    } catch (error) {
      console.error('Error updating professional info:', error);
      alert('Failed to update professional information.');
    } finally {
      setSavingProfessional(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-800 border-t-[#0277BD] dark:border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Manage your professional profile and account settings.</p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Personal Information */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <User size={20} className="text-[#0277BD] dark:text-blue-400" />
              </div>
              Personal Information
            </h2>
          </div>
          <div className="p-8">
            <form onSubmit={handlePersonalSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Full Identity</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-[#0277BD] transition-colors" size={18} />
                    <input
                      type="text"
                      value={personalForm.name || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:focus:ring-blue-500/10 focus:border-[#0277BD] dark:focus:border-blue-500 dark:text-white dark:placeholder:text-slate-700 transition-all font-medium"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-500 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Contact Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-[#0277BD] transition-colors" size={18} />
                    <input
                      type="tel"
                      value={personalForm.phoneNumber || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, phoneNumber: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:focus:ring-blue-500/10 focus:border-[#0277BD] dark:focus:border-blue-500 dark:text-white dark:placeholder:text-slate-700 transition-all font-medium"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                {/* Bio removed from personal info in new interface? */}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={savingPersonal}
                  className="flex items-center justify-center gap-2 px-10 py-4 bg-[#0277BD] dark:bg-blue-600 hover:bg-[#01579B] dark:hover:bg-blue-500 text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 min-w-[200px]"
                >
                  {savingPersonal ? (
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       Updating...
                    </div>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Personal
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all pb-10">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <Briefcase size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              Professional Credentials
            </h2>
          </div>
          <div className="p-8">
            <form onSubmit={handleProfessionalSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Medical Specialization</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-[#0277BD] transition-colors" size={18} />
                    <input
                      type="text"
                      value={professionalForm.specialization || ''}
                      onChange={(e) => setProfessionalForm({ ...professionalForm, specialization: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:focus:ring-blue-500/10 focus:border-[#0277BD] dark:focus:border-blue-500 dark:text-white dark:placeholder:text-slate-700 transition-all font-medium"
                      placeholder="e.g. Cardiologist"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Years of Practice</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-[#0277BD] transition-colors" size={18} />
                    <input
                      type="number"
                      value={professionalForm.yearsOfExperience || ''}
                      onChange={(e) => setProfessionalForm({ ...professionalForm, yearsOfExperience: parseInt(e.target.value) || 0 })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:focus:ring-blue-500/10 focus:border-[#0277BD] dark:focus:border-blue-500 dark:text-white dark:placeholder:text-slate-700 transition-all font-medium"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Primary Clinic Name</label>
                  <div className="relative group">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-[#0277BD] transition-colors" size={18} />
                    <input
                      type="text"
                      value={professionalForm.clinicName || ''}
                      onChange={(e) => setProfessionalForm({ ...professionalForm, clinicName: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:focus:ring-blue-500/10 focus:border-[#0277BD] dark:focus:border-blue-500 dark:text-white dark:placeholder:text-slate-700 transition-all font-medium"
                      placeholder="e.g. City Heart Center"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Clinic Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-[#0277BD] transition-colors" size={18} />
                    <input
                      type="text"
                      value={professionalForm.clinicAddress?.street || ''}
                      onChange={(e) => setProfessionalForm({ ...professionalForm, clinicAddress: { ...professionalForm.clinicAddress, street: e.target.value } })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:focus:ring-blue-500/10 focus:border-[#0277BD] dark:focus:border-blue-500 dark:text-white dark:placeholder:text-slate-700 transition-all font-medium"
                      placeholder="e.g. 123 Medical Drive, NY"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={savingProfessional}
                  className="flex items-center justify-center gap-2 px-10 py-4 bg-[#0277BD] dark:bg-blue-600 hover:bg-[#01579B] dark:hover:bg-blue-500 text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 min-w-[200px]"
                >
                  {savingProfessional ? (
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       Updating...
                    </div>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Professional
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for icons
function Clock({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

export default DoctorSettings;
