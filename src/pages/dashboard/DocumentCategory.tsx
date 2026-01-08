import { useParams, useNavigate } from 'react-router-dom';
import { FileText, MoreVertical, Search, ArrowLeft, Download, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';

// Mock data for category files
const categoryFiles = [
  { id: 1, name: 'Blood Test Report', date: '25.11.2024', size: '2.4 MB', category: 'Lab Report' },
  { id: 2, name: 'X-Ray Scan', date: '20.11.2024', size: '15 MB', category: 'Radiology' },
  { id: 3, name: 'Prescription - Nov', date: '15.11.2024', size: '1.1 MB', category: 'Prescription' },
  { id: 4, name: 'Vaccination Record', date: '10.10.2024', size: '3.5 MB', category: 'Record' },
];

const DocumentCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  // Format category name from slug (e.g., 'health-report' -> 'Health Report')
  const categoryName = category
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const toggleMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleFileClick = (file: any) => {
    alert(`Previewing ${file.name}`);
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/patient/documents')} 
          className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
        </Button>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-none">{categoryName}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0277BD] dark:bg-blue-500" />
            {categoryFiles.length} documents archived
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#0277BD] transition-colors" />
          <input 
            type="text" 
            placeholder={`Search in ${categoryName}...`}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 dark:focus:ring-blue-500/10 transition-all font-medium text-slate-700 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] bg-slate-50/50 dark:bg-slate-900/50">
              <th className="p-5 w-[40%]">Name</th>
              <th className="p-5 w-[20%]">Category</th>
              <th className="p-5 w-[15%]">Size</th>
              <th className="p-5 w-[15%]">Date</th>
              <th className="p-5 w-[10%] text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {categoryFiles.map((file) => (
              <tr 
                key={file.id} 
                onClick={() => handleFileClick(file)}
                className="border-b border-slate-50 dark:border-slate-800 last:border-none hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
              >
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-[#0277BD] dark:group-hover:text-blue-400 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                      <FileText size={20} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm group-hover:translate-x-1 transition-transform duration-300">{file.name}</span>
                  </div>
                </td>
                <td className="p-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-[#0277BD] dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                        {file.category}
                    </span>
                </td>
                <td className="p-5 text-sm text-slate-600 dark:text-slate-400 font-bold">{file.size}</td>
                <td className="p-5 text-sm text-slate-500 dark:text-slate-500 font-medium">{file.date}</td>
                <td className="p-5 text-right relative">
                  <button 
                    onClick={(e) => toggleMenu(e, file.id)}
                    className="p-2 text-slate-400 dark:text-slate-600 hover:text-[#0277BD] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all active:scale-90"
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
                      <div className="absolute right-8 top-10 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-20 py-2 flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <button className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full text-left font-bold transition-colors">
                          <Eye size={18} className="text-slate-400" /> Preview
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full text-left font-bold transition-colors">
                          <Download size={18} className="text-slate-400" /> Download
                        </button>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left font-bold transition-colors">
                          <Trash2 size={18} /> Delete
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
    </div>
  );
};

export default DocumentCategory;
