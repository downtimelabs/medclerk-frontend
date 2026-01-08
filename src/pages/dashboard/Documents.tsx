
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
import { fetchPatientDocuments } from '../../api/upload';
import { useOnFocus } from '../../hooks/useRefresh';
import UploadBox from '../../components/documents/UploadBox';
import type { PatientDocument } from '../../interfaces/upload';

// Simple Modal for Upload
const UploadModal = ({ isOpen, onClose, onUploadComplete }: { isOpen: boolean; onClose: () => void; onUploadComplete: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 border dark:border-slate-800">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
            <Trash2 size={20} className="rotate-45" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">Upload Document</h2>
        <UploadBox onUploadComplete={() => { onUploadComplete(); onClose(); }} />
      </div>
    </div>
  );
};

// Preview Modal for Documents
const PreviewModal = ({ isOpen, onClose, fileUrl, fileName, mimeType, onDownload }: { 
  isOpen: boolean; 
  onClose: () => void; 
  fileUrl: string | null; 
  fileName: string;
  mimeType: string;
  onDownload: () => void;
}) => {
  if (!isOpen) return null;

  const isImage = mimeType?.startsWith('image/');
  const isPdf = mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 dark:bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 border dark:border-slate-800">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isImage ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
              <FileText size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white truncate max-w-[250px] md:max-w-md leading-tight">{fileName}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-0.5">{mimeType || 'Document'}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
             <Trash2 size={20} className="rotate-45" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-950/50 p-6 flex items-center justify-center">
          {!fileUrl ? (
             <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-[#0277BD] animate-spin" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Loading preview...</p>
             </div>
          ) : isImage ? (
            <img src={fileUrl} alt={fileName} className="max-w-full max-h-full object-contain rounded-2xl shadow-lg border border-white dark:border-slate-800" />
          ) : isPdf ? (
            <iframe src={`${fileUrl}#toolbar=0`} className="w-full h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-inner" title={fileName} />
          ) : (
            <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 max-w-sm">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600">
                <FileText size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Preview Available</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">We can't preview this file type directly in the browser.</p>
              <Button onClick={onDownload} className="w-full bg-[#0277BD] text-white">
                Download to View
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-white dark:bg-slate-900">
           <Button variant="outline" onClick={onClose} className="rounded-xl px-6 dark:border-slate-800 dark:hover:bg-slate-800">Close</Button>
           {fileUrl && (
             <Button onClick={onDownload} className="bg-[#0277BD] hover:bg-[#01579B] text-white rounded-xl px-6 hover:shadow-lg dark:hover:shadow-blue-900/50 transition-all">
                <Download size={18} className="mr-2" />
                Download Report
             </Button>
           )}
        </div>
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

  // Preview states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PatientDocument | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleFileClick = (file: PatientDocument) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
    setPreviewUrl(file.fileUrl); // Use the fileUrl already in the document
  };

  const handleDownload = (e: React.MouseEvent, file: PatientDocument) => {
    e.stopPropagation();
    if (file.fileUrl) {
      window.open(file.fileUrl, '_blank');
    }
  };

  // Derived stats
  const totalSize = documents.reduce((acc, doc) => acc + (doc.fileSize || 0), 0);
  const formattedTotalSize = (totalSize / (1024 * 1024)).toFixed(2) + ' MB';
  const fileTypes = new Set(documents.map(d => d.mimeType)).size;

  const stats = [
    { label: 'Total Documents', value: documents.length.toString(), icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Storage Used', value: formattedTotalSize, icon: HardDrive, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Most Active', value: 'Health Report', icon: Activity, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' }, // Placeholder
    { label: 'File Types', value: `${fileTypes} Types`, icon: PieChart, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
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

      <PreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewUrl(null);
          setSelectedFile(null);
        }}
        fileUrl={previewUrl}
        fileName={selectedFile?.title || ''}
        mimeType={selectedFile?.mimeType || ''}
        onDownload={() => previewUrl && window.open(previewUrl, '_blank')}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Report Centre</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and organize your medical records.</p>
        </div>
        <div className="flex gap-4">
           <div className="relative hidden md:block w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder="Search files..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] shadow-sm transition-all dark:text-slate-100 dark:placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Button 
             onClick={() => setIsUploadModalOpen(true)}
             className="bg-gradient-to-r from-[#0277BD] to-[#01579B] hover:shadow-lg dark:hover:shadow-blue-900/50 text-white px-6 rounded-xl font-semibold transition-all border-none"
           >
              <Plus size={18} className="mr-2" />
              Upload
           </Button>
        </div>
      </div>

      {/* Statistics Section */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <PieChart size={20} className="text-[#FF9800]" />
            Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="p-5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-premium dark:shadow-premium-dark backdrop-blur-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Files */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
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
                    className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 bg-white dark:bg-slate-900/50 hover:shadow-lg dark:hover:shadow-premium-dark hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer backdrop-blur-sm"
                >
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 text-[#FF9800] rounded-xl flex items-center justify-center">
                    <FileText size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-[150px]">{file.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{file.type || 'Doc'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
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
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">All Files</h2>
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-premium dark:shadow-premium-dark backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/30">
                <th className="p-5 w-[40%]">Name</th>
                <th className="p-5 w-[20%]">Category</th>
                <th className="p-5 w-[15%]">Size</th>
                <th className="p-5 w-[15%] text-right">Date</th>
                <th className="p-5 w-[10%] text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((file) => (
                 <tr 
                    key={file.id} 
                    onClick={() => handleFileClick(file)}
                    className="border-b border-slate-50 dark:border-slate-800 last:border-none hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors cursor-pointer group"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-[#0277BD] group-hover:shadow-sm transition-all">
                        <FileText size={20} />
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate max-w-[200px]">{file.title}</span>
                    </div>
                  </td>
                  <td className="p-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {file.type || 'Document'}
                      </span>
                  </td>
                  <td className="p-5 text-sm text-slate-600 dark:text-slate-400 font-medium">{(file.fileSize / 1024).toFixed(0)} KB</td>
                  <td className="p-5 text-sm text-slate-500 dark:text-slate-400">{new Date(file.createdAt).toLocaleDateString()}</td>
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
                         <div className="absolute right-8 top-10 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 py-1.5 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                          <button 
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full text-left font-medium transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileClick(file);
                              setActiveMenu(null);
                            }}
                          >
                            <Eye size={16} />
                            Preview
                          </button>
                          <button 
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full text-left font-medium transition-colors"
                            onClick={(e) => {
                                handleDownload(e, file);
                                setActiveMenu(null);
                            }}
                          >
                            <Download size={16} /> Download
                          </button>
                          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1.5 mx-2"></div>
                          <button 
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left font-medium transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
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
