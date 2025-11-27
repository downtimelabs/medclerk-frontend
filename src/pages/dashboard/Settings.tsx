import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Activity, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { usePatientStore } from '../../store/patientStore';
import { useOnFocus } from '../../hooks/useRefresh';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'medical'>('profile');
  
  const { profile, loading, fetchProfile, updatePatientProfile } = usePatientStore();

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    phoneNumber: '',
    country: '',
    state: '',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });

  // Medical Form State
  const [medicalData, setMedicalData] = useState({
    dob: '',
    bloodGroup: '',
    heightCm: '',
    weightKg: '',
    allergies: '',
    chronicConditions: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactEmail: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useOnFocus(() => {
    fetchProfile();
  });

  // Sync store data to local state
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        phoneNumber: profile.phoneNumber || '',
        country: profile.address?.country || '',
        state: profile.address?.state || '',
        avatarUrl: profile.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      });

      setMedicalData({
        dob: profile.patientProfile?.dateOfBirth ? new Date(profile.patientProfile.dateOfBirth).toISOString().split('T')[0] : '',
        bloodGroup: profile.patientProfile?.bloodGroup || '',
        heightCm: profile.patientProfile?.height?.toString() || '',
        weightKg: profile.patientProfile?.weight?.toString() || '',
        allergies: profile.patientProfile?.allergies?.join(', ') || '',
        chronicConditions: profile.patientProfile?.chronicConditions?.join(', ') || '',
        emergencyContactName: profile.patientProfile?.emergencyContact?.name || '',
        emergencyContactPhone: profile.patientProfile?.emergencyContact?.phoneNumber || '',
        emergencyContactEmail: profile.patientProfile?.emergencyContact?.email || '' // Assuming email exists in backend or we map it
      });
    }
  }, [profile]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedicalData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would update the user profile endpoint
    // For now, we'll just log it as the updatePatientProfile is for medical info mostly in the current store structure
    // or we can assume updatePatientProfile handles basic info too if backend supports it.
    // Based on previous context, updatePatientProfile updates PatientHealthProfile.
    // We might need a separate endpoint for basic user info (name, phone) if they are in AuthUser table.
    // For this integration, I'll assume we can only update medical info via updatePatientProfile for now, 
    // or we'd need to extend the API.
    console.log('Saving Profile:', profileData);
    alert("Profile update not fully implemented in backend yet.");
  };

  const handleSaveMedical = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      dateOfBirth: medicalData.dob ? new Date(medicalData.dob).toISOString() : undefined,
      bloodGroup: medicalData.bloodGroup,
      height: medicalData.heightCm ? parseFloat(medicalData.heightCm) : undefined,
      weight: medicalData.weightKg ? parseFloat(medicalData.weightKg) : undefined,
      allergies: medicalData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: medicalData.chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: {
        name: medicalData.emergencyContactName,
        phoneNumber: medicalData.emergencyContactPhone,
        relation: 'Family' // Defaulting for now
      }
    };

    await updatePatientProfile(payload);
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0277BD]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your account and medical preferences</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-[#0277BD] text-[#0277BD]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={16} />
                Profile Information
              </div>
            </button>
            <button
              onClick={() => setActiveTab('medical')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'medical'
                  ? 'border-[#0277BD] text-[#0277BD]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity size={16} />
                Medical Information
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' ? (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl space-y-6"
              onSubmit={handleSaveProfile}
            >
              <div className="flex items-center gap-6 mb-8">
                <img
                  src={profileData.avatarUrl}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-100"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-slate-900">{profileData.name}</h3>
                  <p className="text-sm text-slate-500">Patient Account</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                  maxLength={255}
                />
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleProfileChange}
                  maxLength={20}
                />
                <Input
                  label="Country"
                  name="country"
                  value={profileData.country}
                  onChange={handleProfileChange}
                  maxLength={100}
                />
                <Input
                  label="State"
                  name="state"
                  value={profileData.state}
                  onChange={handleProfileChange}
                  maxLength={100}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl space-y-8"
              onSubmit={handleSaveMedical}
            >
              {/* Personal Stats */}
              <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Physical Attributes</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Input
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={medicalData.dob}
                    onChange={handleMedicalChange}
                  />
                  <Select
                    label="Blood Group"
                    name="bloodGroup"
                    value={medicalData.bloodGroup}
                    onChange={handleMedicalChange}
                    options={[
                      { value: 'A+', label: 'A+' },
                      { value: 'A-', label: 'A-' },
                      { value: 'B+', label: 'B+' },
                      { value: 'B-', label: 'B-' },
                      { value: 'AB+', label: 'AB+' },
                      { value: 'AB-', label: 'AB-' },
                      { value: 'O+', label: 'O+' },
                      { value: 'O-', label: 'O-' },
                    ]}
                  />
                  <Input
                    label="Height (cm)"
                    name="heightCm"
                    type="number"
                    value={medicalData.heightCm}
                    onChange={handleMedicalChange}
                    max={300}
                  />
                  <Input
                    label="Weight (kg)"
                    name="weightKg"
                    type="number"
                    value={medicalData.weightKg}
                    onChange={handleMedicalChange}
                    max={500}
                  />
                </div>
              </section>

              {/* Conditions */}
              <section className="pt-4 border-t border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Medical History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Allergies
                    </label>
                    <textarea
                      name="allergies"
                      value={medicalData.allergies}
                      onChange={handleMedicalChange}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] focus:border-transparent min-h-[100px]"
                      placeholder="List any allergies..."
                      maxLength={1000}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Chronic Conditions
                    </label>
                    <textarea
                      name="chronicConditions"
                      value={medicalData.chronicConditions}
                      onChange={handleMedicalChange}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] focus:border-transparent min-h-[100px]"
                      placeholder="List chronic conditions (comma separated)..."
                    />
                    <p className="text-xs text-slate-500 mt-1">Separate multiple conditions with commas</p>
                  </div>
                </div>
              </section>

              {/* Emergency Contact */}
              <section className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Emergency Contact</h3>
                  <div className="group relative">
                    <AlertCircle size={16} className="text-slate-400 cursor-help" />
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 p-2 bg-slate-800 text-white text-xs rounded hidden group-hover:block z-10">
                      This person will be contacted in case of medical emergencies.
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Contact Name"
                    name="emergencyContactName"
                    value={medicalData.emergencyContactName}
                    onChange={handleMedicalChange}
                    maxLength={255}
                  />
                  <Input
                    label="Contact Phone"
                    name="emergencyContactPhone"
                    value={medicalData.emergencyContactPhone}
                    onChange={handleMedicalChange}
                    maxLength={20}
                  />
                  <Input
                    label="Contact Email"
                    name="emergencyContactEmail"
                    type="email"
                    value={medicalData.emergencyContactEmail}
                    onChange={handleMedicalChange}
                  />
                </div>
              </section>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Medical Info'}
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
