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
  FaSignOutAlt,
  FaExclamationCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { uploadMultipleFiles, validateFile, DocumentType } from '../services/uploadService';

const UploadItems = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadComplete, setUploadComplete] = useState(false);
  const [overallProgress, setOverallProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [error, setError] = useState('');
  const [uploadResults, setUploadResults] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('');
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ file, errors }) => 
        `${file.name}: ${errors.map(e => e.message).join(', ')}`
      );
      setError(errors.join('\n'));
    }

    // Validate and add accepted files
    const validFiles = [];
    const invalidFiles = [];

    acceptedFiles.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push({
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'pending',
          progress: 0,
          metadata: {
            title: file.name,
            type: file.type.includes('pdf') ? DocumentType.LAB_REPORT : DocumentType.OTHER
          }
        });
      } else {
        invalidFiles.push(`${file.name}: ${validation.errors.join(', ')}`);
      }
    });

    if (invalidFiles.length > 0) {
      setError(prev => prev ? `${prev}\n${invalidFiles.join('\n')}` : invalidFiles.join('\n'));
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB
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

  const updateFileMetadata = (fileId, field, value) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, metadata: { ...f.metadata, [field]: value } }
        : f
    ));
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    setUploadComplete(false);
    setError('');
    setUploadResults([]);

    try {
      const files = uploadedFiles.map(f => f.file);
      
      const results = await uploadMultipleFiles(
        files,
        (file, index) => uploadedFiles[index].metadata,
        (index, file, progress) => {
          // Update individual file progress
          setUploadedFiles(prev => 
            prev.map((f, i) => {
              if (i === index) {
                return {
                  ...f,
                  status: progress.stage === 'complete' ? 'completed' : 'uploading',
                  progress: progress.percent
                };
              }
              return f;
            })
          );
        },
        (percent, current, total) => {
          // Update overall progress
          setOverallProgress({ percent, current, total });
        }
      );

      setUploadResults(results);
      
      // Check if all uploads succeeded
      const allSuccess = results.every(r => r.success);
      
      if (allSuccess) {
        setUploadComplete(true);
        setTimeout(() => {
          navigate('/uploads');
        }, 2000);
      } else {
        const failedFiles = results.filter(r => !r.success);
        setError(`${failedFiles.length} file(s) failed to upload:\n${failedFiles.map(f => f.file.name).join('\n')}`);
      }

    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || 'Upload failed. Please try again.');
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
        <div className="flex items-center">
          <img src="/logo1.jpg" alt="MedClerk Logo" className="h-10 w-10 object-contain" />
        </div>
        <div className="flex gap-4 items-center">
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

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <FaExclamationCircle className="text-red-500 text-xl mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-800 mb-1">Upload Errors</h4>
                    <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
                  </div>
                </div>
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div className="mb-8">
                <h3 className="text-dark-900 text-lg font-semibold mb-5">
                  Selected Files ({uploadedFiles.length})
                </h3>
                <div className="space-y-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={file.id} className="p-4 bg-white rounded-lg border border-dark-100">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-3xl">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex flex-col flex-1">
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
                              <span>{Math.round(file.progress || 0)}%</span>
                            </div>
                          )}
                          
                          {file.status === 'completed' && (
                            <FaCheckCircle className="text-success text-2xl" />
                          )}
                        </div>
                      </div>

                      {/* Metadata inputs */}
                      {file.status === 'pending' && !isUploading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-dark-100">
                          <div>
                            <label className="block text-xs font-semibold text-dark-600 mb-1">
                              Document Title
                            </label>
                            <input
                              type="text"
                              value={file.metadata.title}
                              onChange={(e) => updateFileMetadata(file.id, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-dark-200 rounded-md text-sm"
                              placeholder="Enter title"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-dark-600 mb-1">
                              Document Type
                            </label>
                            <select
                              value={file.metadata.type}
                              onChange={(e) => updateFileMetadata(file.id, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-dark-200 rounded-md text-sm"
                            >
                              <option value={DocumentType.LAB_REPORT}>Lab Report</option>
                              <option value={DocumentType.PRESCRIPTION}>Prescription</option>
                              <option value={DocumentType.DISCHARGE_SUMMARY}>Discharge Summary</option>
                              <option value={DocumentType.SCAN_IMAGE}>Scan/Image</option>
                              <option value={DocumentType.OTHER}>Other</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Upload progress bar */}
                      {file.status === 'uploading' && (
                        <div className="mt-3 pt-3 border-t border-dark-100">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-primary-500 to-primary-600 h-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overall progress */}
            {isUploading && overallProgress.total > 0 && (
              <div className="mb-8 p-4 bg-primary-50 border border-primary-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-primary-900">
                    Uploading {overallProgress.current} of {overallProgress.total} files
                  </span>
                  <span className="text-primary-700 font-bold">
                    {Math.round(overallProgress.percent)}%
                  </span>
                </div>
                <div className="w-full bg-primary-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-full transition-all duration-300"
                    style={{ width: `${overallProgress.percent}%` }}
                  />
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
              Files will be processed using OCR and AI analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadItems;
