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
  ArrowRight
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
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-[#0277BD] p-1.5 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">MedClerk</span>
          </div>
          

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
            <Button variant="accent" onClick={() => navigate('/get-started')}>Get Started</Button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
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
          className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 shadow-lg"
        >
          <div className="pt-4 flex flex-col gap-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/login')}>Log in</Button>
            <Button variant="accent" className="w-full justify-start" onClick={() => navigate('/get-started')}>Get Started</Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-[#E0F2F1] to-transparent opacity-60 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Copy */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0277BD] text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0277BD]"></span>
              </span>
              Now with AI-Powered Vitals Tracking
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Your Entire Medical History. <span className="text-[#0277BD]">Instantly Searchable.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              Stop carrying giant folders. We use advanced LLMs to organize, translate, and summarize your prescriptions and reports so you and your doctor get the full picture in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="accent" className="h-12 px-8 text-base" onClick={() => navigate('/get-started')}>
                Organize My Records
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-12 px-8 text-base" onClick={() => navigate('/get-started')}>
                I am a Doctor
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
                ))}
              </div>
              <p>Trusted by 2,000+ patients</p>
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
            <div className="relative rounded-2xl bg-white shadow-2xl border border-slate-100 p-2 z-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 to-white/50 rounded-2xl -z-10" />
              
              {/* Header of Mockup */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="text-xs text-slate-400 font-mono">dashboard.medclerk.app</div>
              </div>

              {/* Body of Mockup */}
              <div className="p-6 grid gap-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-[#0277BD] font-semibold text-sm mb-1">Total Reports</div>
                    <div className="text-2xl font-bold text-slate-900">128</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="text-green-700 font-semibold text-sm mb-1">Last Vitals</div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-600" />
                      <span className="text-lg font-bold text-slate-900">Normal</span>
                    </div>
                  </div>
                </div>

                {/* List Item - Simulating the screenshot provided */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700">Recent Processing</h3>
                  {[
                    { name: 'Blood Test - CBC', status: 'Completed', date: 'Today, 10:23 AM' },
                    { name: 'Dr. Sharma Prescription', status: 'Processing', date: 'Yesterday' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${i === 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                          {i === 0 ? <Activity size={16} /> : <FileText size={16} />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.date}</div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${i === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Element Behind */}
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-[#E0F2F1] rounded-2xl -z-10" />
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">The "Patient Folder" is Broken.</h2>
          <p className="text-slate-600">
            There is a ton of information that goes under-processed and underutilized in a patient's physical folder.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {points.map((p, i) => (
            <Card key={i} className="p-6 hover:shadow-md transition-shadow border-t-4 border-t-transparent hover:border-t-[#0277BD]">
              <div className="bg-slate-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{p.title}</h3>
              <p className="text-slate-600 leading-relaxed">{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section id="features" className="py-20 bg-[#F0F9FA]"> {/* Very light teal background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">From Chaos to Clarity in 3 Steps</h2>
            <div className="space-y-8">
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
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#0277BD] shadow-sm">
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                    <p className="text-slate-600 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
             {/* Visualizing the "Health Vitals" screenshot */}
             <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-slate-800">Health Vitals</h4>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Updated Just Now</span>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-slate-100 rounded-xl bg-red-50/50">
                  <div className="text-xs text-slate-500 mb-2">Heart Rate</div>
                  <div className="text-2xl font-bold text-slate-900">72 <span className="text-sm font-normal text-slate-500">bpm</span></div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-red-400 h-full w-[60%]"></div>
                  </div>
                </div>
                <div className="p-4 border border-slate-100 rounded-xl bg-blue-50/50">
                  <div className="text-xs text-slate-500 mb-2">Blood Pressure</div>
                  <div className="text-2xl font-bold text-slate-900">120/80</div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-blue-400 h-full w-[80%]"></div>
                  </div>
                </div>
                <div className="p-4 border border-slate-100 rounded-xl bg-purple-50/50 col-span-2">
                  <div className="text-xs text-slate-500 mb-2">AI Summary</div>
                  <p className="text-sm text-slate-700">
                    "Vitals represent a healthy range. Compared to last month, blood pressure has stabilized."
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
    <section className="py-24 bg-[#0277BD] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
              New: MedClerk AI Assistant
            </div>
            <h2 className="text-4xl font-bold mb-6">Chat with your Health History.</h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Don't remember your cholesterol levels from 2023? Just ask. 
              Our RAG (Retrieval-Augmented Generation) engine searches through your PDFs and images to give you accurate answers citing the specific document source.
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
              className="font-bold h-12 px-8"
              onClick={() => navigate('/get-started')}
            >
              Try the Demo
            </Button>
          </div>

          {/* Chat Interface Mockup */}
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto w-full">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
              <div>
                <div className="font-bold text-sm">MedClerk Assistant</div>
                <div className="text-xs text-slate-500">Online</div>
              </div>
            </div>
            <div className="p-4 h-80 flex flex-col gap-4 bg-slate-50/50">
              {/* User Message */}
              <div className="self-end bg-[#0277BD] text-white px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-[85%] shadow-md">
                What medications am I currently taking?
              </div>

              {/* AI Response */}
              <div className="self-start bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-[90%] shadow-sm">
                <p className="mb-2">Based on the prescription from <strong>Dr. Smith</strong> uploaded on <strong>Oct 15th</strong>, you are currently taking:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 bg-slate-50 p-2 rounded mb-2">
                  <li>Aspirin 100mg (Daily)</li>
                  <li>Lisinopril 10mg (Daily)</li>
                </ul>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  <FileText size={10} /> Source: Rx_Oct15.pdf
                </div>
              </div>
            </div>
            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask a question about your health..." 
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] transition-all"
                  disabled
                />
                <div className="absolute right-2 top-2 p-1 bg-[#0277BD] rounded-full text-white">
                  <ArrowRight size={16} />
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
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-white">
              <Activity className="h-6 w-6" />
              <span className="font-bold text-xl">MedClerk</span>
            </div>
            <p className="text-sm text-slate-400">
              Empowering patients and doctors with intelligent, organized medical history.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">For Patients</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For Doctors</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Connect</h4>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 bg-slate-800 rounded-full hover:bg-slate-700 cursor-pointer transition-colors" />
              <div className="w-8 h-8 bg-slate-800 rounded-full hover:bg-slate-700 cursor-pointer transition-colors" />
              <div className="w-8 h-8 bg-slate-800 rounded-full hover:bg-slate-700 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          &copy; 2025 MedClerk. All rights reserved.
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
    <div className="font-sans antialiased text-slate-900 bg-white min-h-screen selection:bg-[#0277BD] selection:text-white">
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
