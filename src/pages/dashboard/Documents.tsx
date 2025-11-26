import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Folder, 
  FileText, 
  MoreVertical, 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  Eye,
  PieChart,
  HardDrive,
  Activity
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import UploadModal from '../../components/dashboard/UploadModal';

// --- Mock Data ---

const folders = [
  { id: 'health-report', name: 'Health Report', files: 80, size: '168 MB' },
  { id: 'medical-info', name: 'Medical Information', files: 8, size: '56 MB' },
  { id: 'prescriptions', name: 'Prescriptions', files: 20, size: '11 MB' },
  { id: 'archived', name: 'Archived', files: 99, size: '267 MB' }
];

const stats = [
  { label: 'Total Documents', value: '207', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Storage Used', value: '502 MB', icon: HardDrive, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Most Active', value: 'Health Report', icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'File Types', value: '4 Types', icon: PieChart, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const recentFiles = [
  { id: 1, name: 'Health data', date: '31.11.2024', size: '56 MB', type: 'doc', category: 'Report' },
  { id: 2, name: 'Medical report', date: '31.11.2024', size: '56 MB', type: 'doc', category: 'Report' },
  { id: 3, name: 'Prescriptions', date: '31.11.2024', size: '56 MB', type: 'doc', category: 'Prescription' }
];

const allFiles = [
  { id: 101, name: 'Blood Test Results', date: '31.11.2024', size: '2.4 MB', category: 'Lab Report' },
  { id: 102, name: 'MRI Scan', date: '30.11.2024', size: '15 MB', category: 'Radiology' },
  { id: 103, name: 'Dr. Smith Prescription', date: '28.11.2024', size: '1.2 MB', category: 'Prescription' },
  { id: 104, name: 'Vaccination Record', date: '15.11.2024', size: '500 KB', category: 'Record' }
];

const Documents = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const toggleMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleFileClick = (file: any) => {
    // In a real app, this would open a modal
    alert(`Previewing ${file.name}`);
  };

  return (
    <div className="space-y-10 pb-12 font-sans">
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />

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

      {/* Folders */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Folder size={20} className="text-[#FF9800]" />
            Folders
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {folders.map((folder) => (
            <div 
              key={folder.id}
              onClick={() => navigate(`/dashboard/documents/${folder.id}`)}
              className="group p-6 bg-white border border-slate-200 rounded-2xl cursor-pointer transition-all hover:border-[#0277BD] hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0277BD] flex items-center justify-center mb-4 group-hover:bg-[#0277BD] group-hover:text-white transition-colors">
                <Folder size={24} fill="currentColor" className="opacity-90" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1 text-lg">{folder.name}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>{folder.files} Files</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{folder.size}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentFiles.map((file) => (
            <div 
                key={file.id} 
                onClick={() => handleFileClick(file)}
                className="p-4 border border-slate-200 rounded-2xl flex items-center gap-4 bg-white hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 bg-orange-50 text-[#FF9800] rounded-xl flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{file.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="font-medium text-slate-600">{file.category}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{file.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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
              {allFiles.map((file) => (
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
                      <span className="font-semibold text-slate-900 text-sm">{file.name}</span>
                    </div>
                  </td>
                  <td className="p-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {file.category}
                      </span>
                  </td>
                  <td className="p-5 text-sm text-slate-600 font-medium">{file.size}</td>
                  <td className="p-5 text-sm text-slate-500">{file.date}</td>
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
                          <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 w-full text-left font-medium">
                            <Eye size={16} /> Preview
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
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Documents;
