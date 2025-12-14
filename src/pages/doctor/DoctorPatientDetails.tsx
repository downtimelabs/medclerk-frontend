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
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{patient.name}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
              Active Patient
            </span>
            <span>•</span>
            <span>{patient.email}</span>
            {stats && stats.totalReviews > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
                  <StarRating rating={stats.averageRating} size={12} readOnly />
                  <span className="text-xs font-bold text-slate-700">{stats.averageRating.toFixed(1)}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="ml-auto">
          {myRating ? (
            <div className="flex flex-col items-end">
              <span className="text-xs font-medium text-slate-500">You rated</span>
              <div className="flex items-center gap-1">
                <StarRating rating={myRating.rating} size={16} readOnly />
                <span className="text-sm font-bold text-slate-700">{myRating.rating}/5</span>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsRateModalOpen(true)}>
              Rate Patient
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-8">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'chat', label: 'AI Chat', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 flex items-center gap-2 text-sm font-medium transition-colors relative ${activeTab === tab.id
                ? 'text-[#0277BD] dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0277BD] rounded-t-full" />
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
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Personal Information</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Full Name</label>
                      <p className="mt-1 font-medium text-slate-900 dark:text-white">{patient.name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Email</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail size={14} className="text-slate-400" />
                        <p className="font-medium text-slate-900 dark:text-white">{patient.email}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Phone</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone size={14} className="text-slate-400" />
                        <p className="font-medium text-slate-900 dark:text-white">{patient.phoneNumber || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Date of Birth</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar size={14} className="text-slate-400" />
                        <p className="font-medium text-slate-900 dark:text-white">N/A</p>
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
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {docsLoading ? (
                  <div className="p-12 flex justify-center">
                    <Loader2 className="animate-spin text-[#0277BD]" size={24} />
                  </div>
                ) : documents.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
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
              className="h-[600px] flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white shadow-sm">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">MedClerk AI</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ask questions about {patient.name}'s medical history</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                    <Bot size={48} className="text-slate-300 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No messages yet</p>
                    <p className="text-sm text-slate-400 max-w-xs mt-2">Ask about recent blood tests, diagnosis history, or summarize documents.</p>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      : 'bg-gradient-to-r from-blue-500 to-teal-400 text-white'
                      }`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-tr-none'
                      : 'bg-blue-50 dark:bg-blue-900/20 text-slate-800 dark:text-slate-200 rounded-tl-none border border-blue-100 dark:border-blue-900/30'
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white flex-shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl rounded-tl-none border border-blue-100 dark:border-blue-900/30">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask a question..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:text-white"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || chatLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#0277BD] text-white rounded-lg hover:bg-[#026aa8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-2">
                  AI responses are generated based on patient documents. Verify with original files.
                </p>
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
