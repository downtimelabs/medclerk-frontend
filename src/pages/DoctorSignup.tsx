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

  const skipStep2 = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: RegisterDoctorRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'DOCTOR',
        doctorProfile: {
          licenseNumber: formData.licenseNumber,
          specialization: formData.specialization,
        }
      };

      await registerDoctorApi(payload);
      navigate('/login');
    } catch (err: any) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
      {/* Left Side: Dynamic Visualization (Doctor Focus) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F0F9FA] dark:bg-slate-900 relative justify-center items-center overflow-hidden p-12 order-2 lg:order-1 transition-colors duration-300">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-100/50 dark:from-teal-900/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/50 dark:from-blue-900/20 via-transparent to-transparent" />

        <div className="relative w-full max-w-lg" style={{ perspective: '1000px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-800 p-6 relative z-20"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-[#004D40] dark:text-teal-400">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">New Doctor Profile</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verification Pending...</div>
                </div>
              </div>
              <div className="flex gap-1">
                <div className={`w-2.5 h-2.5 rounded-full transition-all ${step >= 1 ? 'bg-[#004D40] dark:bg-teal-500 shadow-lg shadow-teal-500/20' : 'bg-slate-200 dark:bg-slate-800'}`} />
                <div className={`w-2.5 h-2.5 rounded-full transition-all ${step >= 2 ? 'bg-[#004D40] dark:bg-teal-500 shadow-lg shadow-teal-500/20' : 'bg-slate-200 dark:bg-slate-800'}`} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-100 dark:bg-orange-950/20 p-1.5 rounded-lg">
                    <ShieldCheck size={14} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">License Verification</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 font-medium leading-relaxed">We verify all medical licenses to ensure a trusted network.</p>
              </div>
              
              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800">
                 <div className="flex items-center gap-3 mb-2">
                  <div className="bg-teal-100 dark:bg-teal-950/20 p-1.5 rounded-lg">
                    <Activity size={14} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Practice Management</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 font-medium leading-relaxed">Streamline your clinic with AI-powered patient summaries.</p>
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
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              {step === 1 ? "Join as a Doctor" : "Clinic Details"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              {step === 1 
                ? "Expand your practice and streamline patient care." 
                : "Tell us about your practice. You can add this later."}
            </p>
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30 font-bold">
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
                <div className="space-y-2">
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
                  {formData.password && (
                    <div className="space-y-1 text-xs">
                      <div className={`flex items-center gap-1.5 ${formData.password.length >= 8 ? 'text-green-600' : 'text-slate-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${formData.password.length >= 8 ? 'bg-green-600' : 'bg-slate-400'}`} />
                        At least 8 characters
                      </div>
                      <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-slate-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-600' : 'bg-slate-400'}`} />
                        One uppercase letter
                      </div>
                      <div className={`flex items-center gap-1.5 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-slate-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-green-600' : 'bg-slate-400'}`} />
                        One lowercase letter
                      </div>
                      <div className={`flex items-center gap-1.5 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-slate-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${/\d/.test(formData.password) ? 'bg-green-600' : 'bg-slate-400'}`} />
                        One number
                      </div>
                      <div className={`flex items-center gap-1.5 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-slate-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'bg-green-600' : 'bg-slate-400'}`} />
                        One special character
                      </div>
                    </div>
                  )}
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
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wider">Clinic Address</h3>
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

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Already have an account?{' '}
              <span 
                onClick={() => navigate('/login')} 
                className="text-[#004D40] dark:text-teal-400 font-bold hover:underline cursor-pointer"
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
