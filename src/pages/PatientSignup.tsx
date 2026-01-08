import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Check, ChevronRight, ShieldCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { registerPatientApi } from '../api/auth';
import type { RegisterPatientRequest } from '../types/registerPatient';
import { Loader2 } from 'lucide-react';


const PatientSignup = () => {
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
    // Step 2: Optional
    dob: '',
    gender: '',
    bloodGroup: '',
    height: '',
    weight: '',
    allergies: '',
    chronicConditions: ''
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
      // Calculate age from DOB
      let age: number | null = null;
      if (formData.dob) {
        const birthDate = new Date(formData.dob);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      const payload: RegisterPatientRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'PATIENT',
        patientProfile: {
          dob: formData.dob ? new Date(formData.dob) : undefined,
          bloodGroup: formData.bloodGroup || null,
          heightCm: formData.height ? parseFloat(formData.height) : null,
          weightKg: formData.weight ? parseFloat(formData.weight) : null,
          chronicConditions: formData.chronicConditions
            ? formData.chronicConditions.split(',').map(c => c.trim()).filter(c => c)
            : [],
        }
      };

      await registerPatientApi(payload);
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
      const payload: RegisterPatientRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'PATIENT',
        patientProfile: {
          dob: undefined,
          bloodGroup: null,
          heightCm: null,
          weightKg: null,
          chronicConditions: [],
        }
      };

      await registerPatientApi(payload);
      navigate('/login');
    } catch (err: any) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side: Dynamic Visualization (Patient Focus) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F0F9FA] relative justify-center items-center overflow-hidden p-12 order-2 lg:order-1">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-100/50 via-transparent to-transparent" />

        <div className="relative w-full max-w-lg" style={{ perspective: '1000px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-6 relative z-20"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0277BD]">
                  <User size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">New Patient Profile</div>
                  <div className="text-xs text-slate-500">Setup in progress...</div>
                </div>
              </div>
              <div className="flex gap-1">
                <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-[#0277BD]' : 'bg-slate-200'}`} />
                <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-[#0277BD]' : 'bg-slate-200'}`} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-1.5 rounded-lg">
                    <ShieldCheck size={14} className="text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Secure Encryption</span>
                </div>
                <p className="text-xs text-slate-500">Your personal health data is encrypted at rest and in transit.</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-1.5 rounded-lg">
                    <Activity size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">AI Health Insights</span>
                </div>
                <p className="text-xs text-slate-500">Complete your profile to get personalized health recommendations.</p>
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
              {step === 1 ? "Create your account" : "Complete your profile"}
            </h1>
            <p className="text-slate-600">
              {step === 1
                ? "Join thousands of patients managing their health smarter."
                : "Help us personalize your experience. You can skip this for now."}
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
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <div>
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
                  {formData.password && (
                    <div className="mt-2 space-y-1 text-xs">
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

                <Button type="submit" className="w-full h-12 text-base mt-4">
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
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                  <Select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    options={[
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' },
                      { value: 'OTHER', label: 'Other' },
                    ]}
                  />
                  <Select
                    label="Blood Group"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Height (cm)"
                    name="height"
                    type="number"
                    placeholder="175"
                    value={formData.height}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Weight (kg)"
                    name="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                </div>

                <Input
                  label="Allergies"
                  name="allergies"
                  placeholder="Peanuts, Penicillin..."
                  value={formData.allergies}
                  onChange={handleInputChange}
                />

                <Input
                  label="Chronic Conditions"
                  name="chronicConditions"
                  placeholder="Diabetes, Hypertension..."
                  value={formData.chronicConditions}
                  onChange={handleInputChange}
                />

                <div className="flex flex-col gap-3 mt-6">
                  <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
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
                className="text-[#0277BD] font-semibold hover:underline cursor-pointer"
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

export default PatientSignup;
