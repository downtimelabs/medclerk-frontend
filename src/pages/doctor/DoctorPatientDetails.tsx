import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  User,
  Calendar,
  Phone,
  Mail,
  Send,
  Bot,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getDoctorPatients,
  getPatientDocuments,
  queryPatientDocuments
} from '../../api/doctor';
import { getRatingStats, getMyRating, type RatingStats, type Rating } from '../../api/rating';
import StarRating from '../../components/common/StarRating';
import RatingModal from '../../components/common/RatingModal';
import { Button } from '../../components/ui/Button';
import type {
  PatientInfo,
  Document,
  RAGResponse
} from '../../interfaces/doctor';

const DoctorPatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'chat'>('overview');
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Documents State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Rating State
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [myRating, setMyRating] = useState<Rating | null>(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      try {
        // We might need a specific getPatient endpoint, but for now we can find in list
        // Or assume we have a getPatientById endpoint. 
        // Since getDoctorPatients returns a list, let's try to find it there or use a new endpoint if available.
        // Looking at api/doctor.ts, there isn't a direct getPatientById for doctors.
        // We'll use getDoctorPatients with a search or just fetch all active and find.
        // Ideally backend should support /doctor/patients/:id
        // For this implementation, I'll assume we can fetch the patient details.
        // If not, I'll fallback to fetching list and filtering (inefficient but works for now).

        // Let's try fetching list and filtering for now as per available API
        const data = await getDoctorPatients({ status: 'ACTIVE' }); // This might be heavy if many patients
        const found = data.patients.find(p => p.id === id);
        if (found) {
          setPatient(found);
        } else {
          // Fallback: maybe it's pending or we need another call. 
          // For now, handle not found.
          console.error('Patient not found in active list');
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  // Fetch rating stats
  useEffect(() => {
    if (id) {
      const fetchRatingData = async () => {
        try {
          const [statsData, myRatingData] = await Promise.all([
            getRatingStats(id),
            getMyRating(id).catch(() => null)
          ]);
          setStats(statsData);
          setMyRating(myRatingData);
        } catch (error) {
          console.error('Error fetching rating data:', error);
        }
      };
      fetchRatingData();
    }
  }, [id]);

  const handleRatingSuccess = () => {
    if (id) {
      getRatingStats(id).then(setStats);
      getMyRating(id).then(setMyRating);
    }
  };

  useEffect(() => {
    if (activeTab === 'documents' && id) {
      fetchDocuments();
    }
  }, [activeTab, id]);

  const fetchDocuments = async () => {
    if (!id) return;
    setDocsLoading(true);
    try {
      const data = await getPatientDocuments(id, {});
      setDocuments(data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setDocsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !id) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      const response: RAGResponse = await queryPatientDocuments(id, { question: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', content: response.answer }]);
    } catch (error) {
      console.error('Error querying documents:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error while processing your request." }]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-[#0277BD]" size={32} />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Patient not found</h2>
        <button onClick={() => navigate('/doctor/patients')} className="mt-4 text-[#0277BD] hover:underline">
          Back to Patients
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/doctor/patients')}
          className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">{patient.name}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span className="px-2.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              Active Patient
            </span>
            <span className="opacity-30">•</span>
            <span>{patient.email}</span>
            {stats && stats.totalReviews > 0 && (
              <>
                <span className="opacity-30">•</span>
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                  <StarRating rating={stats?.averageRating || 0} size={14} readOnly />
                  <span className="text-xs font-bold text-slate-700 dark:text-yellow-500">{stats?.averageRating?.toFixed(1)}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="ml-auto">
          {myRating ? (
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 dark:text-slate-500 mb-1">Your Rating</span>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <StarRating rating={myRating.rating} size={18} readOnly />
                <span className="text-sm font-bold text-slate-950 dark:text-white">{myRating.rating}/5</span>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsRateModalOpen(true)}
              className="rounded-xl font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              Rate Patient
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-10">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'chat', label: 'AI Insights', icon: Bot },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 flex items-center gap-2 text-sm font-bold transition-colors relative tracking-wide ${activeTab === tab.id
                ? 'text-[#0277BD] dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'animate-pulse' : ''} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0277BD] dark:bg-blue-500 rounded-t-full shadow-[0_-2px_6px_rgba(2,119,189,0.3)] dark:shadow-[0_-2px_6px_rgba(59,130,246,0.3)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-premium dark:shadow-premium-dark backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-6">Patient Overview</h3>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-extrabold">Full Name</label>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{patient.name}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-extrabold">Email Address</label>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-blue-500" />
                        <p className="font-bold text-slate-900 dark:text-slate-100">{patient.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-extrabold">Primary Contact</label>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-teal-500" />
                        <p className="font-bold text-slate-900 dark:text-slate-100">{patient.phoneNumber || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-extrabold">Birth Date</label>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-orange-500" />
                        <p className="font-bold text-slate-900 dark:text-slate-100">Not specified</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
            <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-premium dark:shadow-premium-dark backdrop-blur-sm overflow-hidden">
                {docsLoading ? (
                  <div className="p-12 flex justify-center">
                    <Loader2 className="animate-spin text-[#0277BD]" size={24} />
                  </div>
                ) : documents.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-slate-50/50 dark:bg-slate-950/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Document Name</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-[#0277BD] dark:text-blue-400">
                                <FileText size={18} />
                              </div>
                              <span className="font-medium text-slate-900 dark:text-white">{doc.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 capitalize">
                            {doc.type.replace('_', ' ')}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0277BD] hover:underline text-sm font-medium"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <FileText size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No documents found</h3>
                    <p className="text-slate-500 dark:text-slate-400">This patient hasn't uploaded any documents yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-[600px] flex flex-col bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-premium dark:shadow-premium-dark backdrop-blur-md overflow-hidden relative"
            >
              {/* Decorative background pulse for AI */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 dark:bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

              {/* Chat Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 flex items-center justify-between z-10 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0277BD] to-[#00ACC1] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <Bot size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-base">MedClerk Specialist AI</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Active Insight Mode</p>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-900/30">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">RAG Enabled</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-6 text-slate-300 dark:text-slate-700 border border-slate-100 dark:border-slate-800">
                      <MessageSquare size={40} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Patient Intelligence Hub</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto font-medium">
                      Analyze medical history, summarize lab reports, or track vital trends across documents.
                    </p>
                    <div className="mt-8 grid grid-cols-1 gap-3 w-full max-w-sm">
                      {['Summarize recent reports', 'Highlight critical findings', 'Track BP trends'].map(hint => (
                        <button key={hint} onClick={() => setInput(hint)} className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700 rounded-xl transition-all text-left">
                          "{hint}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user'
                      ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700'
                      : 'bg-gradient-to-tr from-[#0277BD] to-[#00ACC1] text-white'
                      }`}>
                      {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                      ? 'bg-[#0277BD] text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex gap-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0277BD] to-[#00ACC1] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                      <Bot size={18} className="animate-pulse" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-[#0277BD] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-[#0277BD] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-[#0277BD] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
                <div className="relative group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask AI anything about this patient's records..."
                    className="w-full pl-5 pr-14 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/30 dark:text-white dark:placeholder:text-slate-600 transition-all font-medium"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || chatLoading}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-[#0277BD] text-white rounded-xl hover:bg-[#01579B] disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-blue-500/20 active:scale-90"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4">
                   <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                   <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
                     AI Insight Engine
                   </p>
                   <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <RatingModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        targetName={patient.name}
        targetId={patient.id}
        onSuccess={handleRatingSuccess}
      />
    </div>
  );
};

export default DoctorPatientDetails;
