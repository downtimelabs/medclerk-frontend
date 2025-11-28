import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Check, ChevronRight, Stethoscope, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { registerDoctorApi } from '../api/auth';
import type { RegisterDoctorRequest } from '../interfaces/auth';

const DoctorSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Compulsory
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    specialization: '',
    // Step 2: Optional
    clinicName: '',
    yearsOfExperience: '',
    street: '',
    city: '',
    state: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: RegisterDoctorRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'DOCTOR',
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: 'USA', // Defaulting for now
          postalCode: '00000', // Defaulting
        },
        doctorProfile: {
          licenseNumber: formData.licenseNumber,
          specialization: formData.specialization,
          clinicName: formData.clinicName,
          yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
          clinicAddress: {
            street: formData.street, // Using same address for clinic for simplicity if not separate
            city: formData.city,
            state: formData.state,
            country: 'USA',
            postalCode: '00000'
          }
        }
      };

      await registerDoctorApi(payload);
      // On success, redirect to login
      navigate('/login');
    } catch (err: any) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const skipStep2 = () => {
    console.log('Skipped Step 2. Doctor Signup Data:', formData);
    // TODO: API Call with partial data
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side: Dynamic Visualization (Doctor Focus) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F0F9FA] relative justify-center items-center overflow-hidden p-12 order-2 lg:order-1">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-100/50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent" />

        <div className="relative w-full max-w-lg" style={{ perspective: '1000px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-6 relative z-20"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#004D40]">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">New Doctor Profile</div>
                  <div className="text-xs text-slate-500">Verification Pending...</div>
                </div>
              </div>
              <div className="flex gap-1">
                <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-[#004D40]' : 'bg-slate-200'}`} />
                <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-[#004D40]' : 'bg-slate-200'}`} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-100 p-1.5 rounded-lg">
                    <ShieldCheck size={14} className="text-orange-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">License Verification</span>
                </div>
                <p className="text-xs text-slate-500">We verify all medical licenses to ensure a trusted network.</p>
              </div>
              
              <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                 <div className="flex items-center gap-3 mb-2">
                  <div className="bg-teal-100 p-1.5 rounded-lg">
                    <Activity size={14} className="text-teal-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Practice Management</span>
                </div>
                <p className="text-xs text-slate-500">Streamline your clinic with AI-powered patient summaries.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative order-1 lg:order-2">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-[#0277BD] p-1.5 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">MedClerk</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {step === 1 ? "Join as a Doctor" : "Clinic Details"}
            </h1>
            <p className="text-slate-600">
              {step === 1 
                ? "Expand your practice and streamline patient care." 
                : "Tell us about your practice. You can add this later."}
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleStep1Submit}
                className="space-y-5"
              >
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="Dr. Jane Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="doctor@clinic.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                  />
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="License Number"
                    name="licenseNumber"
                    placeholder="MED123456"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <Select
                    label="Specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                    options={[
                      { value: 'General Physician', label: 'General Physician' },
                      { value: 'Cardiologist', label: 'Cardiologist' },
                      { value: 'Dermatologist', label: 'Dermatologist' },
                      { value: 'Pediatrician', label: 'Pediatrician' },
                      { value: 'Neurologist', label: 'Neurologist' },
                      { value: 'Orthopedic', label: 'Orthopedic' },
                      { value: 'Other', label: 'Other' },
                    ]}
                  />
                </div>
                
                <Button type="submit" className="w-full h-12 text-base mt-4 bg-[#004D40] hover:bg-[#00382e]">
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleFinalSubmit}
                className="space-y-5"
              >
                <Input
                  label="Clinic Name"
                  name="clinicName"
                  placeholder="City Health Clinic"
                  value={formData.clinicName}
                  onChange={handleInputChange}
                />

                <Input
                  label="Years of Experience"
                  name="yearsOfExperience"
                  type="number"
                  placeholder="5"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                />

                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-medium text-slate-900 border-b border-slate-100 pb-2">Clinic Address</h3>
                  <Input
                    label="Street Address"
                    name="street"
                    placeholder="123 Medical Lane"
                    value={formData.street}
                    onChange={handleInputChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      name="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="State"
                      name="state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <Button type="submit" className="w-full h-12 text-base bg-[#004D40] hover:bg-[#00382e]" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Complete Signup
                        <Check className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="ghost" onClick={skipStep2} className="w-full">
                    Skip for now
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <span 
                onClick={() => navigate('/login')} 
                className="text-[#004D40] font-semibold hover:underline cursor-pointer"
              >
                Log in
              </span>
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-8 text-xs text-slate-400">
          &copy; 2025 MedClerk Inc. • HIPAA Compliant
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup;
