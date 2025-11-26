import { X, UploadCloud, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate upload progress
  useEffect(() => {
    if (files.length > 0) {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(file => {
          if (file.status === 'uploading' && file.progress < 100) {
            return { ...file, progress: Math.min(file.progress + 2, 100), status: file.progress >= 98 ? 'completed' : 'uploading' };
          }
          return file;
        }));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [files]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const fileEntries = newFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      progress: 0,
      status: 'uploading'
    }));
    setFiles(prev => [...prev, ...fileEntries]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#FDFBF7] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative"
        >
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-black/5 transition-colors z-10"
            >
                <X size={24} />
            </button>

            <div className="p-8 pb-0 flex flex-col items-center text-center">
                {/* Drag & Drop Area */}
                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all mb-6
                        ${isDragging ? 'border-[#004D40] bg-[#E0F2F1]' : 'border-slate-300 hover:border-[#004D40] hover:bg-slate-50'}
                    `}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple 
                        onChange={handleFileSelect} 
                    />
                    <div className="w-16 h-16 bg-[#004D40] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-900/20">
                        <UploadCloud size={28} className="text-white" />
                    </div>
                    <p className="text-slate-900 font-bold text-lg">Drop files here to upload</p>
                    <p className="text-slate-500 text-sm mt-1">or click to browse</p>
                </div>
                
                {files.length === 0 && (
                     <p className="text-xs text-slate-400 mb-8">Supports: pdf, Max file size 90MB</p>
                )}
            </div>

            {/* File List - Only visible if files exist */}
            {files.length > 0 && (
                <div className="px-6 pb-8 space-y-4 max-h-60 overflow-y-auto">
                    <h3 className="text-sm font-bold text-slate-900 mb-2 text-left">Uploading {files.length} files</h3>
                    {files.map((file) => (
                        <div key={file.id} className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#26A69A] rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]">
                                PDF
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <p className={`text-sm font-medium truncate ${file.status === 'failed' ? 'text-red-500' : 'text-slate-900'}`}>
                                        {file.name}
                                    </p>
                                </div>
                                {file.status === 'failed' ? (
                                    <p className="text-xs text-red-500 font-medium">Failed</p>
                                ) : (
                                    <div className="h-1.5 w-full bg-[#FFE0B2] rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-[#FF9800] rounded-full transition-all duration-300"
                                            style={{ width: `${file.progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                {file.status === 'uploading' && (
                                    <span className="text-xs font-medium text-slate-600 w-8 text-right">{file.progress}%</span>
                                )}
                                {file.status === 'failed' && (
                                    <button className="p-1 text-[#FF5722] hover:bg-orange-50 rounded-full">
                                        <RefreshCw size={16} />
                                    </button>
                                )}
                                <button 
                                    onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UploadModal;
