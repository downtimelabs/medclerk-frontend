import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  FaCloudUploadAlt, 
  FaFilePdf, 
  FaFileImage, 
  FaFileAlt, 
  FaTrash, 
  FaCheckCircle,
  FaSpinner,
  FaArrowRight,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';

const UploadItems = ({ user, selectedLanguage, onLanguageSelect, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadComplete, setUploadComplete] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'],
      'text/*': ['.txt', '.doc', '.docx']
    },
    multiple: true
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') return <FaFilePdf className="text-error" />;
    if (type.startsWith('image/')) return <FaFileImage className="text-blue-400" />;
    return <FaFileAlt className="text-dark-500" />;
  };

  const simulateUpload = async (file) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        setUploadProgress(prev => ({
          ...prev,
          [file.id]: progress
        }));
      }, 200);
    });
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    setUploadComplete(false);

    try {
      // Simulate uploading each file
      for (const file of uploadedFiles) {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id ? { ...f, status: 'uploading' } : f
          )
        );
        
        await simulateUpload(file);
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id ? { ...f, status: 'completed' } : f
          )
        );
      }

      setUploadComplete(true);
      
      // Simulate processing time
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col text-dark-700">
      <div className="flex justify-between items-center p-5 bg-white/90 backdrop-blur-md border-b border-dark-200 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="MedClerk Logo" className="h-8 w-8 object-contain" />
          <div className="text-2xl font-bold text-dark-950">MedClerk</div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <select
              className="appearance-none bg-white text-dark-700 border border-dark-200 rounded-lg px-3 py-2 pr-7 text-sm cursor-pointer focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500 focus:ring-opacity-15"
              value={selectedLanguage || 'en'}
              onChange={(e) => onLanguageSelect?.(e.target.value)}
            >
              <option value="en" className="bg-white text-dark-700">English</option>
              <option value="es" className="bg-white text-dark-700">Español</option>
              <option value="fr" className="bg-white text-dark-700">Français</option>
              <option value="de" className="bg-white text-dark-700">Deutsch</option>
              <option value="it" className="bg-white text-dark-700">Italiano</option>
              <option value="pt" className="bg-white text-dark-700">pt</option>
              <option value="ru" className="bg-white text-dark-700">ru</option>
              <option value="zh" className="bg-white text-dark-700">zh</option>
              <option value="ja" className="bg-white text-dark-700">ja</option>
              <option value="ko" className="bg-white text-dark-700">ko</option>
              <option value="ar" className="bg-white text-dark-700">ar</option>
              <option value="hi" className="bg-white text-dark-700">Hindi</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-dark-700 font-medium">
            <FaUser className="text-base" />
            <span>{user?.name}</span>
          </div>
          <button className="btn btn-secondary flex items-center gap-2 px-4 py-2 text-sm" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-5">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 text-dark-900">
              {t('upload_title')}
            </h1>
            <p className="text-lg text-dark-500">
              {t('upload_sub')}
            </p>
          </div>

          <div className="card">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed border-dark-200 rounded-xl p-10 text-center cursor-pointer transition-all duration-300 bg-white mb-8 hover:border-primary-500 hover:bg-primary-50 ${
                isDragActive ? 'border-primary-500 bg-primary-500 bg-opacity-10 scale-105' : ''
              } ${uploadedFiles.length > 0 ? 'border-success bg-success bg-opacity-5' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="space-y-5">
                <FaCloudUploadAlt className="text-5xl text-primary-500 mx-auto" />
                <h3 className="text-dark-900 text-xl font-semibold">
                  {isDragActive
                    ? 'Drop files here...'
                    : 'Drag & drop files here, or click to select'}
                </h3>
                <p className="text-dark-500">Supports PDF, Images, and Text documents</p>
                <p className="text-xs text-dark-500">Maximum file size: 10MB per file</p>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mb-8">
                <h3 className="text-dark-900 text-lg font-semibold mb-5">
                  Selected Files ({uploadedFiles.length})
                </h3>
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex justify-between items-center p-4 bg-white rounded-lg border border-dark-100">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-3xl">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-dark-900 mb-1">{file.name}</span>
                          <span className="text-xs text-dark-500">{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2.5">
                        {file.status === 'pending' && (
                          <button
                            className="bg-error text-white border-0 rounded-md px-3 py-2 cursor-pointer transition-colors hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => removeFile(file.id)}
                            disabled={isUploading}
                          >
                            <FaTrash />
                          </button>
                        )}
                        
                        {file.status === 'uploading' && (
                          <div className="flex items-center gap-2 text-primary-500 font-semibold">
                            <FaSpinner className="animate-spin" />
                            <span>{Math.round(uploadProgress[file.id] || 0)}%</span>
                          </div>
                        )}
                        
                        {file.status === 'completed' && (
                          <FaCheckCircle className="text-success text-2xl" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadComplete && (
              <div className="text-center p-8 bg-success bg-opacity-10 rounded-xl border border-success border-opacity-20 mb-8">
                <FaCheckCircle className="text-success text-5xl mx-auto mb-4" />
                <h3 className="text-success mb-2.5 text-xl font-semibold">Upload Complete!</h3>
                <p className="text-dark-400">Your files are being processed. Redirecting to dashboard...</p>
              </div>
            )}

            <div className="text-center">
              <button
                className={`btn btn-primary min-w-48 flex items-center justify-center gap-2.5 text-base py-4 px-8 ${
                  isUploading ? 'cursor-not-allowed' : ''
                }`}
                onClick={handleUpload}
                disabled={uploadedFiles.length === 0 || isUploading || uploadComplete}
              >
                {isUploading ? (
                  <div className="flex items-center gap-2.5">
                    <FaSpinner className="animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : uploadComplete ? (
                  <>
                    <span>Processing Complete</span>
                    <FaArrowRight />
                  </>
                ) : (
                  <>
                    <span>{t('upload_button')}</span>
                    <FaArrowRight />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-center mt-5">
            <p className="text-dark-500 text-sm bg-dark-50 px-4 py-2 rounded-full inline-block">
              Language: {selectedLanguage?.toUpperCase()} | Files will be processed using OCR and AI analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadItems;
