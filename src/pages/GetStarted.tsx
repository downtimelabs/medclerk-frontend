import { User, Stethoscope, ArrowRight, ShieldCheck, Activity, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side: Dynamic Visualization */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F0F9FA] relative justify-center items-center overflow-hidden p-12 order-2 lg:order-1">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-100/50 via-transparent to-transparent" />

        <div className="relative w-full max-w-lg" style={{ perspective: '1000px' }}>
          {/* Doctor View Card (Back) */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: -20, rotateY: -10 }}
            animate={{ opacity: 1, x: 40, y: -20, rotateY: -10 }}
            transition={{ duration: 0.8 }}
            className="absolute top-0 right-0 w-3/4 bg-white rounded-2xl shadow-xl border border-slate-200/60 p-5 z-10 opacity-60 scale-95"
          >
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#004D40]">
                <Stethoscope size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Dr. Sarah Smith</div>
                <div className="text-[10px] text-slate-500">Cardiology</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <Calendar size={12} className="text-slate-400" />
                <div className="text-xs text-slate-700">3 Appointments Today</div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <Clock size={12} className="text-slate-400" />
                <div className="text-xs text-slate-700">Next: 10:30 AM</div>
              </div>
            </div>
          </motion.div>

          {/* Patient View Card (Front) */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20, rotateY: 5 }}
            animate={{ opacity: 1, x: -20, y: 20, rotateY: 5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-6 relative z-20 transform transition-transform duration-500 hover:rotate-y-0"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0277BD]">
                  <Activity size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">My Health</div>
                  <div className="text-xs text-slate-500">Daily Vitals</div>
                </div>
              </div>
              <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">
                STABLE
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Heart Rate</span>
                  <span>72 bpm</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-[#0277BD] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Sleep</span>
                  <span>7h 30m</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-[#004D40] rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Badge */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 bottom-10 bg-white p-3 rounded-xl shadow-lg border border-slate-100 z-30 flex items-center gap-3"
          >
            <div className="bg-orange-100 p-1.5 rounded-lg">
              <ShieldCheck size={16} className="text-orange-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Secure & Private</div>
              <div className="text-[10px] text-slate-500">HIPAA Compliant</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Selection (Now on Right for Desktop) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative order-1 lg:order-2">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full"
        >
          <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-[#0277BD] p-1.5 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">MedClerk</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Get Started</h2>
            <p className="text-slate-600">Select your role to continue to your dashboard.</p>
          </div>

          <div className="space-y-6">
            {/* Patient Card */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/signup/patient')}>
              <Card className="p-6 cursor-pointer border-2 border-transparent hover:border-[#FF9800] transition-all group relative overflow-hidden shadow-sm hover:shadow-md bg-slate-50 hover:bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-[#0277BD] transition-colors">
                    <User className="h-6 w-6 text-[#0277BD] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">I am a Patient</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Access your records, track vitals, and get AI insights.
                    </p>
                    <div className="flex items-center text-sm font-medium text-[#0277BD] group-hover:text-[#FF9800] transition-colors">
                      Continue <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Doctor Card */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/signup/doctor')}>
              <Card className="p-6 cursor-pointer border-2 border-transparent hover:border-[#004D40] transition-all group relative overflow-hidden shadow-sm hover:shadow-md bg-slate-50 hover:bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-[#004D40] transition-colors">
                    <Stethoscope className="h-6 w-6 text-[#004D40] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">I am a Doctor</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Manage patients, view summaries, and streamline care.
                    </p>
                    <div className="flex items-center text-sm font-medium text-[#004D40] group-hover:text-[#FF9800] transition-colors">
                      Continue <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              Already have an account? <span onClick={() => navigate('/login')} className="text-[#0277BD] font-semibold hover:underline cursor-pointer">Log in</span>
            </p>
          </div>
        </motion.div>
        
        <div className="absolute bottom-8 text-xs text-slate-400">
          &copy; 2025 MedClerk Inc. • HIPAA Compliant
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
