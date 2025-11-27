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
        <Button variant="ghost" onClick={() => navigate('/patient/documents')} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={24} className="text-slate-700" />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{categoryName}</h1>
          <p className="text-slate-500 text-sm mt-1">{categoryFiles.length} files</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={`Search in ${categoryName}...`}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD] transition-all"
          />
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
              <th className="p-5 w-[40%]">Name</th>
              <th className="p-5 w-[20%]">Category</th>
              <th className="p-5 w-[15%]">Size</th>
              <th className="p-5 w-[15%]">Date</th>
              <th className="p-5 w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {categoryFiles.map((file) => (
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
    </div>
  );
};

export default DocumentCategory;
