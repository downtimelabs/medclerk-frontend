import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    console.log('Login attempt:', { email, password });
    navigate('/patient/dashboard'); // Placeholder navigation
  };

  return (
    <div className="min-h-screen bg-white flex">
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
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Welcome back</h1>
            <p className="text-slate-600">
              Enter your credentials to access your secure medical dashboard.
            </p>
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
            
            <div>
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              />
              <div className="flex justify-between items-center mt-2">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-[#0277BD] focus:ring-[#0277BD]" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-[#0277BD] hover:text-[#026aa8] font-medium">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base mt-2 shadow-lg shadow-blue-500/20">
              Sign In to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              New to MedClerk?{' '}
              <span 
                onClick={() => navigate('/get-started')} 
                className="text-[#0277BD] font-semibold hover:underline cursor-pointer"
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
      <div className="hidden lg:flex lg:w-1/2 bg-[#F0F9FA] relative justify-center items-center overflow-hidden p-12">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-100/50 via-transparent to-transparent" />

        <motion.div 
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-lg"
          style={{ perspective: '1000px' }}
        >
          {/* Dashboard Mockup Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-6 relative z-10 transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0277BD]">
                  <Activity size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Health Overview</div>
                  <div className="text-xs text-slate-500">Updated just now</div>
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
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500 mb-1">Blood Pressure</div>
                <div className="text-xl font-bold text-slate-900">120/80</div>
                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <ShieldCheck size={10} /> Normal
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500 mb-1">Heart Rate</div>
                <div className="text-xl font-bold text-slate-900">72 bpm</div>
                <div className="text-xs text-slate-400 mt-1">Resting</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Documents</div>
              {[
                { name: 'Lab Results - CBC', date: 'Today', type: 'lab' },
                { name: 'Cardiology Referral', date: 'Yesterday', type: 'doc' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.type === 'lab' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                      {item.type === 'lab' ? <Activity size={14} /> : <FileText size={14} />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 group-hover:text-[#0277BD] transition-colors">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.date}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-[#0277BD] transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Floating Elements for depth */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 top-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 z-20 max-w-[160px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="text-xs font-bold text-slate-700">AI Analysis</div>
            </div>
            <div className="text-[10px] text-slate-500 leading-relaxed">
              "Your vitals have stabilized compared to last month's report."
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
