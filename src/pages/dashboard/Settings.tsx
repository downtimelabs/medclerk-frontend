import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Activity, AlertCircle, Loader2, Bell, Shield, Lock, Trash2, Eye, EyeOff, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { getPatientProfile, updatePatientPersonal, updatePatientMedical } from '../../api/patient';
import { useOnFocus } from '../../hooks/useRefresh';
import type { PatientProfile } from '../../interfaces/patient';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'medical' | 'notifications' | 'security'>('profile');
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
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

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
    updates: true
  });

  // Security Settings State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
    profileVisibility: 'private'
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const fetchAndSetProfile = async () => {
    try {
      setLoading(true);
      const data = await getPatientProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetProfile();
  }, []);

  useOnFocus(() => {
    fetchAndSetProfile();
  });

  // Sync profile data to local state
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.personal.name || '',
        phoneNumber: profile.personal.phoneNumber || '',
        country: profile.personal.country || '',
        state: profile.personal.state || '',
        avatarUrl: profile.personal.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      });

      setMedicalData({
        dob: profile.medical.dob ? new Date(profile.medical.dob).toISOString().split('T')[0] : '',
        bloodGroup: profile.medical.bloodGroup || '',
        heightCm: profile.medical.heightCm?.toString() || '',
        weightKg: profile.medical.weightKg?.toString() || '',
        allergies: profile.medical.allergies || '',
        chronicConditions: profile.medical.chronicConditions?.join(', ') || '',
        emergencyContactName: profile.medical.emergencyContact?.name || '',
        emergencyContactPhone: profile.medical.emergencyContact?.phone || '',
        emergencyContactEmail: profile.medical.emergencyContact?.email || ''
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
    try {
      setLoading(true);
      await updatePatientPersonal({
        name: profileData.name,
        phoneNumber: profileData.phoneNumber,
        country: profileData.country,
        state: profileData.state,
        avatarUrl: profileData.avatarUrl
      });
      await fetchAndSetProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMedical = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const payload = {
        dob: medicalData.dob ? new Date(medicalData.dob).toISOString() : undefined,
        bloodGroup: medicalData.bloodGroup as any,
        heightCm: medicalData.heightCm ? parseFloat(medicalData.heightCm) : undefined,
        weightKg: medicalData.weightKg ? parseFloat(medicalData.weightKg) : undefined,
        allergies: medicalData.allergies,
        chronicConditions: medicalData.chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
        emergencyContact: {
          name: medicalData.emergencyContactName,
          phone: medicalData.emergencyContactPhone,
          email: medicalData.emergencyContactEmail
        }
      };

      await updatePatientMedical(payload);
      await fetchAndSetProfile();
    } catch (error) {
      console.error('Failed to update medical info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    
    setSecurityData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    // TODO: Implement password update API
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API delay
    setLoading(false);
    setSecurityData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    alert('Password updated successfully!');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock API delay
      setLoading(false);
      alert('Account deletion request has been submitted.');
    }
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
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'notifications'
                  ? 'border-[#0277BD] text-[#0277BD]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell size={16} />
                Notifications
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'security'
                  ? 'border-[#0277BD] text-[#0277BD]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield size={16} />
                Security & Privacy
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Mini Profile Overview */}
              <div className="bg-gradient-to-br from-[#0277BD]/5 to-transparent rounded-2xl p-8 border border-[#0277BD]/10 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full p-1 bg-white shadow-lg">
                    <img
                      src={profileData.avatarUrl}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-2">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{profileData.name}</h2>
                    <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                       <Mail size={14} />
                       {profile?.personal?.email || 'No email provided'}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                    {(profileData.state || profileData.country) && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-slate-600 shadow-sm border border-slate-200">
                        <MapPin size={12} />
                        {[profileData.state, profileData.country].filter(Boolean).join(', ')}
                      </span>
                    )}
                    {profileData.phoneNumber && (
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-slate-600 shadow-sm border border-slate-200">
                        <Phone size={12} />
                        {profileData.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Profile Section */}
              <div className="max-w-2xl">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Edit Profile</h3>
                  <p className="text-sm text-slate-500">Update your personal details below.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
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
                    <div className="md:col-span-2">
                       <Input 
                          label="Avatar URL"
                          name="avatarUrl"
                          value={profileData.avatarUrl}
                          onChange={handleProfileChange}
                          placeholder="https://..."
                       />
                       <p className="text-xs text-slate-500 mt-1">Provide a valid image URL for your profile picture.</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'medical' && (
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
          
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl space-y-8"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email Notifications', desc: 'Receive daily summaries and important updates via email.' },
                      { key: 'push', label: 'Push Notifications', desc: 'Get real-time alerts on your device.' },
                      { key: 'sms', label: 'SMS Notifications', desc: 'Receive critical alerts via text message.' },
                      { key: 'marketing', label: 'Marketing Emails', desc: 'Receive offers and promotional content.' },
                      { key: 'updates', label: 'Product Updates', desc: 'Stay informed about new features and improvements.' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex-1">
                          <label htmlFor={item.key} className="text-sm font-medium text-slate-900 block mb-1">
                            {item.label}
                          </label>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                        <div className="ml-4 flex items-center h-5">
                          <input
                            id={item.key}
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={() => handleNotificationChange(item.key as keyof typeof notifications)}
                            className="w-4 h-4 text-[#0277BD] border-slate-300 rounded focus:ring-[#0277BD]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={() => alert('Preferences saved!')}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl space-y-8"
            >
              {/* Change Password */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-[#0277BD]" />
                  <h3 className="text-lg font-medium text-slate-900">Change Password</h3>
                </div>
                
                <form onSubmit={handleUpdatePassword} className="space-y-4 p-6 border border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="relative">
                    <Input
                      label="Current Password"
                      name="currentPassword"
                      type={showPassword.current ? "text" : "password"}
                      value={securityData.currentPassword}
                      onChange={handleSecurityChange}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                    >
                      {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <Input
                      label="New Password"
                      name="newPassword"
                      type={showPassword.new ? "text" : "password"}
                      value={securityData.newPassword}
                      onChange={handleSecurityChange}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                    >
                      {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="Confirm New Password"
                      name="confirmPassword"
                      type={showPassword.confirm ? "text" : "password"}
                      value={securityData.confirmPassword}
                      onChange={handleSecurityChange}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                    >
                      {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={loading || !securityData.currentPassword || !securityData.newPassword}>
                      Update Password
                    </Button>
                  </div>
                </form>
              </section>

              {/* Privacy & Security */}
              <section className="space-y-6 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-[#0277BD]" />
                  <h3 className="text-lg font-medium text-slate-900">Privacy & Security</h3>
                </div>
                
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                    </div>
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        name="twoFactor"
                        checked={securityData.twoFactor}
                        onChange={handleSecurityChange}
                        className="w-4 h-4 text-[#0277BD] border-slate-300 rounded focus:ring-[#0277BD]"
                      />
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Profile Visibility</h4>
                    <p className="text-sm text-slate-500 mb-4">Control who can see your profile information.</p>
                    <Select
                      name="profileVisibility"
                      value={securityData.profileVisibility}
                      onChange={handleSecurityChange}
                      options={[
                        { value: 'public', label: 'Public - Everyone can see' },
                        { value: 'contacts', label: 'Contacts Only' },
                        { value: 'private', label: 'Private - Only me' },
                      ]}
                    />
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="space-y-6 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                </div>
                
                <div className="p-6 border border-red-200 rounded-xl bg-red-50">
                  <h4 className="text-md font-bold text-red-900 mb-2">Delete Account</h4>
                  <p className="text-sm text-red-700 mb-6">
                    Once you delete your account, there is no going back. Please be certain.
                    All your data including medical records and personal information will be permanently deleted.
                  </p>
                  <Button 
                    variant="danger" 
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white border-transparent"
                  >
                    Delete Account
                  </Button>
                </div>
              </section>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
