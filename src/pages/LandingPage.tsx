import { useState, useEffect } from 'react';
import { 
  FileText, 
  Activity, 
  ShieldCheck, 
  UploadCloud, 
  BrainCircuit, 
  Menu, 
  X,
  Stethoscope,
  ArrowRight,
  Bot
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';

// --- Sections ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-[#0277BD] p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">MedClerk</span>
          </div>
          

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
            <Button variant="accent" onClick={() => navigate('/get-started')}>Get Started</Button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2 shadow-2xl"
        >
          <div className="pt-4 flex flex-col gap-3">
            <Button variant="outline" className="w-full justify-center h-12 rounded-xl" onClick={() => navigate('/login')}>Log in</Button>
            <Button variant="accent" className="w-full justify-center h-12 rounded-xl" onClick={() => navigate('/get-started')}>Get Started</Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-[#E0F2F1] dark:from-teal-900/20 to-transparent opacity-60 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-full bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-transparent opacity-60 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Copy */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0277BD] dark:text-blue-400 text-xs font-extrabold uppercase tracking-widest mb-8 border border-blue-100/50 dark:border-blue-800/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0277BD] dark:bg-blue-500"></span>
              </span>
              Now with AI-Powered Intelligence
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8">
              Your Entire Medical History. <span className="text-[#0277BD] dark:text-blue-500 drop-shadow-sm">Instantly Searchable.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg font-medium">
              Take care of your health with advanced LLMs that organize, translate, and summarize your medical reports in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Button variant="accent" className="h-14 px-10 text-base font-bold shadow-xl shadow-blue-500/20" onClick={() => navigate('/get-started')}>
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="h-14 px-10 text-base font-bold dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => navigate('/get-started')}>
                I am a Doctor
              </Button>
            </div>
            <div className="mt-12 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-500">
                    JD
                  </div>
                ))}
              </div>
              <p className="font-bold tracking-tight uppercase text-[10px]">Trusted by 2,000+ patients</p>
            </div>
          </motion.div>

          {/* Right Column: Visual Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Abstract representation of the Chaos vs Order */}
            <div className="relative rounded-3xl bg-white dark:bg-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 p-2 z-10 transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 dark:from-blue-900/10 to-white/50 dark:to-slate-900/50 rounded-3xl -z-10" />
              
              {/* Header of Mockup */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">medclerk.app/dashboard</div>
              </div>

              {/* Body of Mockup */}
              <div className="p-8 grid gap-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
                    <div className="text-[#0277BD] dark:text-blue-400 font-extrabold text-[10px] uppercase tracking-widest mb-2">Health Records</div>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white">128</div>
                  </div>
                  <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded-2xl border border-teal-100/50 dark:border-teal-800/30">
                    <div className="text-teal-700 dark:text-teal-400 font-extrabold text-[10px] uppercase tracking-widest mb-2">Status</div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white">Normal</span>
                    </div>
                  </div>
                </div>

                {/* List Item - Simulating the screenshot provided */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Latest Updates</h3>
                  {[
                    { name: 'Blood Test - CBC', status: 'Verified', date: 'Today, 10:23 AM' },
                    { name: 'Dr. Sharma Presc.', status: 'Processing', date: 'Yesterday' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm group hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${i === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'} group-hover:scale-110 transition-transform`}>
                          {i === 0 ? <Activity size={18} /> : <FileText size={18} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{item.date}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-xl ${i === 0 ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400' : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Element Behind */}
            <div className="absolute -bottom-8 -right-8 w-full h-full bg-[#E0F2F1] dark:bg-teal-900/10 rounded-3xl -z-10 translate-x-4 translate-y-4" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Problem = () => {
  const points = [
    {
      icon: <FileText className="h-6 w-6 text-orange-500" />,
      title: "The Paper Burden",
      desc: "Patients carry heavy bags of history. One lost paper could mean a missed diagnosis or insurance rejection."
    },
    {
      icon: <Stethoscope className="h-6 w-6 text-blue-500" />,
      title: "Doctor's Blind Spot",
      desc: "Doctors spend 15 minutes reading paper instead of treating you. They often miss historical context."
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-purple-500" />,
      title: "Language Barriers",
      desc: "Medical jargon makes understanding your own health impossible. We translate it into plain language."
    }
  ];

  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-900/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">The "Patient Folder" is <span className="text-red-500">Broken.</span></h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            Physical records are slow, disorganized, and dangerous. MedClerk digitizes the chaos into actionable medical intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {points.map((p, i) => (
            <Card key={i} className="p-8 hover:shadow-2xl transition-all duration-300 border-t-4 border-t-transparent hover:border-t-[#0277BD] group bg-white dark:bg-slate-900 dark:border-slate-800 rounded-3xl">
              <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {p.icon}
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">{p.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section id="features" className="py-32 bg-white dark:bg-slate-950 transition-colors duration-300"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">From Chaos to Clarity.</h2>
            <div className="space-y-10">
              {[
                {
                  icon: <UploadCloud />,
                  title: "1. Snap & Upload",
                  desc: "Take a photo of any document—handwritten prescriptions, lab reports, or bills."
                },
                {
                  icon: <BrainCircuit />,
                  title: "2. AI Processing",
                  desc: "Our LLM instantly reads, labels, and files it using OCR. No more manual data entry."
                },
                {
                  icon: <Activity />,
                  title: "3. Instant Insight",
                  desc: "Your dashboard updates instantly. View trends for blood pressure, sugar, and more."
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[#0277BD] dark:text-blue-400 shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium text-base leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:scale-[1.02]">
             {/* Visualizing the "Health Vitals" screenshot */}
             <div className="flex items-center justify-between mb-8">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">Health Insights</h4>
                <span className="text-[10px] font-extrabold bg-blue-50 dark:bg-blue-900/30 text-[#0277BD] dark:text-blue-400 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-blue-100 dark:border-blue-800/30">Live Assistant</span>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl bg-red-50/50 dark:bg-red-950/10">
                  <div className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Heart Rate</div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">72 <span className="text-sm font-bold text-slate-400">BPM</span></div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-red-500 h-full w-[60%] animate-pulse"></div>
                  </div>
                </div>
                <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Blood Pressure</div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">120/80</div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-blue-500 h-full w-[80%]"></div>
                  </div>
                </div>
                <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl bg-purple-50/30 dark:bg-purple-950/10 col-span-2">
                  <div className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">AI Clinical Summary</div>
                  <p className="text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                    "Patient vitals remain optimal. Systolic pressure shows a 4% improvement compared to the last diagnostic report from Dr. Arul."
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureRAG = () => {
  const navigate = useNavigate();
  return (
    <section className="py-32 bg-[#0277BD] dark:bg-blue-700 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] mb-8 backdrop-blur-sm border border-white/20">
              Exclusive: MedClerk AI Specialist
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-8 tracking-tight">Chat with your Health History.</h2>
            <p className="text-blue-50 text-xl mb-10 leading-relaxed font-medium">
              Forgot your cholesterol levels from 2023? Just ask. 
              Our RAG intelligence scans your complete records to provide precise clinical answers.
            </p>
            <ul className="space-y-4 mb-8">
              {["Instantly find past prescriptions", "Track medication changes over time", "Summarize complex hospital discharge papers"].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="bg-green-400 rounded-full p-0.5">
                    <ShieldCheck className="h-4 w-4 text-[#0277BD]" />
                  </div>
                  <span className="font-medium text-blue-50">{item}</span>
                </li>
              ))}
            </ul>
            <Button 
              variant="white"
              className="font-extrabold h-14 px-10 text-blue-600 uppercase tracking-widest text-sm rounded-2xl shadow-2xl hover:scale-105 transition-all"
              onClick={() => navigate('/get-started')}
            >
              Start Chatting Now
            </Button>
          </div>

          {/* Chat Interface Mockup */}
          <div className="bg-white dark:bg-slate-900 text-slate-900 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden max-w-md mx-auto w-full border border-white/10 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="bg-slate-50 dark:bg-slate-950 p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-white shadow-lg">
                <Bot size={22} className="animate-pulse" />
              </div>
              <div>
                <div className="font-extrabold text-slate-950 dark:text-white text-base">MedAssistant AI</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Always Online</span>
                </div>
              </div>
            </div>
            <div className="p-6 h-[400px] flex flex-col gap-6 bg-slate-50/50 dark:bg-slate-950/20 overflow-y-auto">
              {/* User Message */}
              <div className="self-end bg-[#0277BD] text-white px-5 py-3.5 rounded-2xl rounded-tr-none text-sm font-medium max-w-[85%] shadow-lg">
                What medications am I currently taking?
              </div>
 
              {/* AI Response */}
              <div className="self-start bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 px-5 py-3.5 rounded-2xl rounded-tl-none text-sm max-w-[90%] shadow-sm text-slate-800 dark:text-slate-200">
                <p className="mb-3 leading-relaxed">Based on the prescription from <strong>Dr. Smith</strong> uploaded on <strong>Oct 15th</strong>, you are currently on:</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-bold">Aspirin 100mg</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-bold">Lisinopril 10mg</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-blue-500 dark:text-blue-400 font-extrabold uppercase tracking-widest">
                  <FileText size={12} /> Source Found: Rx_Oct15.pdf
                </div>
              </div>
            </div>
            {/* Input Area */}
            <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask about your records..." 
                  className="w-full pl-6 pr-12 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0277BD] transition-all dark:text-white"
                  disabled
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-[#0277BD] rounded-xl text-white shadow-lg">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6 text-white">
              <div className="bg-[#0277BD] p-1 rounded-lg">
                <Activity className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight">MedClerk</span>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering patients and clinicians with intelligent, unified medical intelligence. Built for privacy, tuned for accuracy.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-[0.2em] mb-6">Product</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Patient Portal</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Clinician Suite</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Security & Privacy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-[0.2em] mb-6">Legal</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-400 transition-colors">HIPAA Standards</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Patient Rights</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-[0.2em] mb-6">Presence</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 border border-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-900 cursor-pointer transition-all">
                <Activity size={18} className="text-slate-500" />
              </div>
              <div className="w-10 h-10 border border-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-900 cursor-pointer transition-all">
                <BrainCircuit size={18} className="text-slate-500" />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
            &copy; 2025 MedClerk AI. Made for the future of healthcare.
          </p>
          <div className="flex gap-8 text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
             <a href="#" className="hover:text-slate-400 transition-colors">Network Status</a>
             <a href="#" className="hover:text-slate-400 transition-colors">Data Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { authenticated, user } = useAuthStore();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (authenticated && user) {
      if (user.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else if (user.role === 'PATIENT') {
        navigate('/patient/dashboard');
      }
    }
  }, [authenticated, user, navigate]);

  return (
    <div className="font-sans antialiased text-slate-900 bg-white dark:bg-slate-950 min-h-screen selection:bg-[#0277BD] selection:text-white transition-colors duration-300">
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <FeatureRAG />
      <Footer />
    </div>
  );
};

export default LandingPage;
