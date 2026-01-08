import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, FileText, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      
      // Get user from store to check role
      const user = useAuthStore.getState().user;
      
      // Redirect based on role
      if (user?.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex transition-colors duration-300">
      {/* Left Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative z-10">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-12 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-[#0277BD] p-1.5 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">MedClerk</span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Welcome back</h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Enter your credentials to access your secure medical dashboard.
            </p>
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30 font-bold">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Email" 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            />
            
            <div className="relative">
              <Input 
                label="Password" 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-between items-center mt-2">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer font-medium">
                <input type="checkbox" className="rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#0277BD] focus:ring-[#0277BD]" />
                Remember me
              </label>
              <a href="#" className="text-sm text-[#0277BD] hover:text-[#026aa8] font-medium">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full h-12 text-base mt-2 shadow-lg shadow-blue-500/20 rounded-xl font-bold active:scale-[0.98] transition-all" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              New to MedClerk?{' '}
              <span 
                onClick={() => navigate('/get-started')} 
                className="text-[#0277BD] dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                Create an account
              </span>
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-8 text-xs text-slate-400">
          &copy; 2025 MedClerk Inc. • HIPAA Compliant Security
        </div>
      </div>

      {/* Right Side: Dashboard Preview */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F0F9FA] dark:bg-slate-900 relative justify-center items-center overflow-hidden p-12 transition-colors duration-300">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 dark:from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-100/50 dark:from-teal-900/20 via-transparent to-transparent" />

        <motion.div 
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-lg"
          style={{ perspective: '1000px' }}
        >
          {/* Dashboard Mockup Card */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-800 p-6 relative z-10 transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#0277BD] dark:text-blue-400">
                  <Activity size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Health Overview</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Updated just now</div>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest font-extrabold">Blood Pressure</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">120/80</div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1 font-bold">
                  <ShieldCheck size={10} /> Normal
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest font-extrabold">Heart Rate</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">72 bpm</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-bold">Resting</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-3">
              <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">Recent Documents</div>
              {[
                { name: 'Lab Results - CBC', date: 'Today', type: 'lab' },
                { name: 'Cardiology Referral', date: 'Yesterday', type: 'doc' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.type === 'lab' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                      {item.type === 'lab' ? <Activity size={14} /> : <FileText size={14} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0277BD] dark:group-hover:text-blue-400 transition-colors">{item.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-500">{item.date}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 dark:text-slate-700 group-hover:text-[#0277BD] dark:group-hover:text-blue-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Floating Elements for depth */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 top-20 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 max-w-[160px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="text-[10px] font-extrabold text-slate-700 dark:text-slate-100 uppercase tracking-widest">AI Analysis</div>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              "Your vitals have stabilized compared to last month's report."
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
