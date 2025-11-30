import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { getPresignedUrl, confirmDocumentUpload } from '../../api/upload';

interface UploadBoxProps {
  onUploadComplete?: () => void;
}

const UploadBox = ({ onUploadComplete }: UploadBoxProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setUploading(true);
      setError(null);

      // Get presigned URL
      const presignData = await getPresignedUrl(
        selectedFile.name,
        selectedFile.type,
        selectedFile.size
      );

      // Upload to S3
      const uploadResponse = await fetch(presignData.presignedUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      // Confirm upload with backend
      await confirmDocumentUpload({
        key: presignData.key,
        title: selectedFile.name,
        type: 'OTHER',
        mimeType: selectedFile.type,
        fileSize: selectedFile.size,
      });

      setSelectedFile(null);
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${dragActive ? 'border-[#0277BD] bg-blue-50' : 'border-slate-300 hover:border-[#0277BD]'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          onChange={handleChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-slate-700">{selectedFile.name}</span>
              <button 
                onClick={() => setSelectedFile(null)}
                className="text-slate-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
            
            <Button 
              onClick={handleUpload}
              disabled={uploading}
              className="bg-[#0277BD] hover:bg-[#015f96] text-white min-w-[120px]"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Confirm Upload'
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => inputRef.current?.click()}>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0277BD] mb-2">
              <Upload size={24} />
            </div>
            <h3 className="font-semibold text-slate-900">Click to upload or drag and drop</h3>
            <p className="text-sm text-slate-500">PDF, JPG or PNG (max. 10MB)</p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadBox;
