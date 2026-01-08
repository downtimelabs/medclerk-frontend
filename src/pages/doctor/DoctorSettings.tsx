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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0277BD]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your profile and account settings</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Personal Information */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <User size={20} className="text-[#0277BD]" />
              Personal Information
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handlePersonalSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={personalForm.name || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:text-white"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="tel"
                      value={personalForm.phoneNumber || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, phoneNumber: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:text-white"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                {/* Bio removed from personal info in new interface? */}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingPersonal}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0277BD] hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingPersonal ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Briefcase size={20} className="text-[#0277BD]" />
              Professional Information
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleProfessionalSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Specialization</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={professionalForm.specialization || ''}
                      onChange={(e) => setProfessionalForm({ ...professionalForm, specialization: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:text-white"
                      placeholder="e.g. Cardiologist"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Experience (Years)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="number"
                      value={professionalForm.yearsOfExperience || ''}
                      onChange={(e) => setProfessionalForm({ ...professionalForm, yearsOfExperience: parseInt(e.target.value) || 0 })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:text-white"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Clinic Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={professionalForm.clinicName || ''}
                      onChange={(e) => setProfessionalForm({ ...professionalForm, clinicName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:text-white"
                      placeholder="e.g. City Heart Center"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Clinic Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={professionalForm.clinicAddress?.street || ''}
                      onChange={(e) => setProfessionalForm({ ...professionalForm, clinicAddress: { ...professionalForm.clinicAddress, street: e.target.value } })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:text-white"
                      placeholder="e.g. 123 Medical Drive, NY"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfessional}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0277BD] hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingProfessional ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
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
