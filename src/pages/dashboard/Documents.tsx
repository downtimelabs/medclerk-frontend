
import { useState, useEffect } from 'react';
import { 
  FileText, 
  MoreVertical, 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  Eye,
  PieChart,
  HardDrive,
  Activity,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { fetchPatientDocuments, getFileUrl } from '../../api/upload';
import { useOnFocus } from '../../hooks/useRefresh';
import UploadBox from '../../components/documents/UploadBox';
import type { PatientDocument } from '../../interfaces/upload';

// Simple Modal for Upload
const UploadModal = ({ isOpen, onClose, onUploadComplete }: { isOpen: boolean; onClose: () => void; onUploadComplete: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <Trash2 size={20} className="rotate-45" /> {/* Using Trash2 as X icon placeholder if X not imported, but X is usually imported. Let's use X if available or just text */}
        </button>
        <h2 className="text-xl font-bold mb-4">Upload Document</h2>
        <UploadBox onUploadComplete={() => { onUploadComplete(); onClose(); }} />
      </div>
    </div>
  );
};

const Documents = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingKey, setViewingKey] = useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await fetchPatientDocuments();
      setDocuments(docs.documents);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  useOnFocus(() => {
    loadDocuments();
  });

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleFileClick = async (file: any) => {
    try {
      setViewingKey(file.objectKey);
      const url = await getFileUrl(file.objectKey);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to view document:', error);
    } finally {
      setViewingKey(null);
    }
  };

  // Derived stats
  const totalSize = documents.reduce((acc, doc) => acc + (doc.fileSize || 0), 0);
  const formattedTotalSize = (totalSize / (1024 * 1024)).toFixed(2) + ' MB';
  const fileTypes = new Set(documents.map(d => d.mimeType)).size;

  const stats = [
    { label: 'Total Documents', value: documents.length.toString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Storage Used', value: formattedTotalSize, icon: HardDrive, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Most Active', value: 'Health Report', icon: Activity, color: 'text-green-600', bg: 'bg-green-50' }, // Placeholder
    { label: 'File Types', value: `${fileTypes} Types`, icon: PieChart, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-12 font-sans">
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUploadComplete={() => loadDocuments()}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Report Centre</h1>
           <p className="text-slate-500 mt-1">Manage and organize your medical records.</p>
        </div>
        <div className="flex gap-4">
           <div className="relative hidden md:block w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search files..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Button 
             onClick={() => setIsUploadModalOpen(true)}
             className="bg-gradient-to-r from-[#0277BD] to-[#01579B] hover:shadow-lg hover:shadow-blue-200 text-white px-6 rounded-xl font-semibold transition-all"
           >
              <Plus size={18} className="mr-2" />
              Upload
           </Button>
        </div>
      </div>

      {/* Statistics Section */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <PieChart size={20} className="text-[#FF9800]" />
            Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Files */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <FileText size={20} className="text-[#FF9800]" />
            Recent Files
        </h2>
        {loading && documents.length === 0 ? (
             <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-[#0277BD]" />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.slice(0, 3).map((file) => (
                <div 
                    key={file.id} 
                    onClick={() => handleFileClick(file)}
                    className="p-4 border border-slate-200 rounded-2xl flex items-center gap-4 bg-white hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                >
                <div className="w-12 h-12 bg-orange-50 text-[#FF9800] rounded-xl flex items-center justify-center">
                    <FileText size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm truncate max-w-[150px]">{file.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="font-medium text-slate-600">{file.type || 'Doc'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{(file.fileSize / 1024).toFixed(0)} KB</span>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
      </section>

      {/* All Files Table */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-5">All Files</h2>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                <th className="p-5 w-[40%]">Name</th>
                <th className="p-5 w-[20%]">Category</th>
                <th className="p-5 w-[15%]">Size</th>
                <th className="p-5 w-[15%]">Date</th>
                <th className="p-5 w-[10%] text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((file) => (
                <tr 
                    key={file.id} 
                    onClick={() => handleFileClick(file)}
                    className="border-b border-slate-50 last:border-none hover:bg-blue-50/30 transition-colors cursor-pointer group"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:text-[#0277BD] group-hover:shadow-sm transition-all">
                        <FileText size={20} />
                      </div>
                      <span className="font-semibold text-slate-900 text-sm truncate max-w-[200px]">{file.title}</span>
                    </div>
                  </td>
                  <td className="p-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {file.type || 'Document'}
                      </span>
                  </td>
                  <td className="p-5 text-sm text-slate-600 font-medium">{(file.fileSize / 1024).toFixed(0)} KB</td>
                  <td className="p-5 text-sm text-slate-500">{new Date(file.createdAt).toLocaleDateString()}</td>
                  <td className="p-5 text-right relative">
                    <button 
                      onClick={(e) => toggleMenu(e, file.id)}
                      className="p-2 text-slate-400 hover:text-[#0277BD] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {activeMenu === file.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }}
                        />
                        <div className="absolute right-8 top-10 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                          <button 
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 w-full text-left font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileClick(file);
                            }}
                            disabled={viewingKey === file.objectKey}
                          >
                            {viewingKey === file.objectKey ? (
                              <Loader2 size={16} className="animate-spin text-[#0277BD]" />
                            ) : (
                              <Eye size={16} />
                            )}
                            Preview
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 w-full text-left font-medium">
                            <Download size={16} /> Download
                          </button>
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left font-medium">
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDocuments.length === 0 && (
                  <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                          No documents found.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Documents;
