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
import './UploadItems.css';
import { useI18n } from '../i18n';

const UploadItems = ({ user, selectedLanguage }) => {
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
    if (type === 'application/pdf') return <FaFilePdf className="file-icon pdf" />;
    if (type.startsWith('image/')) return <FaFileImage className="file-icon image" />;
    return <FaFileAlt className="file-icon document" />;
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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedLanguage');
    navigate('/');
  };

  return (
    <div className="upload-items">
      <div className="navigation">
        <div className="nav-brand">AI Report Organizer</div>
        <div className="nav-actions">
          <div className="user-info">
            <FaUser className="user-icon" />
            <span>{user?.name}</span>
          </div>
          <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="page-container">
          <div className="header">
            <h1>{t('upload_title')}</h1>
            <p>{t('upload_sub')}</p>
          </div>

          <div className="card">
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'active' : ''} ${uploadedFiles.length > 0 ? 'has-files' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="dropzone-content">
                <FaCloudUploadAlt className="upload-icon" />
                <h3>
                  {isDragActive
                    ? 'Drop files here...'
                    : 'Drag & drop files here, or click to select'}
                </h3>
                <p>Supports PDF, Images, and Text documents</p>
                <p className="file-limit">Maximum file size: 10MB per file</p>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="uploaded-files">
                <h3>Selected Files ({uploadedFiles.length})</h3>
                <div className="files-list">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="file-item">
                      <div className="file-info">
                        {getFileIcon(file.type)}
                        <div className="file-details">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      
                      <div className="file-actions">
                        {file.status === 'pending' && (
                          <button
                            className="remove-btn"
                            onClick={() => removeFile(file.id)}
                            disabled={isUploading}
                          >
                            <FaTrash />
                          </button>
                        )}
                        
                        {file.status === 'uploading' && (
                          <div className="upload-progress">
                            <FaSpinner className="spinning" />
                            <span>{Math.round(uploadProgress[file.id] || 0)}%</span>
                          </div>
                        )}
                        
                        {file.status === 'completed' && (
                          <FaCheckCircle className="success-icon" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadComplete && (
              <div className="upload-complete">
                <FaCheckCircle className="complete-icon" />
                <h3>Upload Complete!</h3>
                <p>Your files are being processed. Redirecting to dashboard...</p>
              </div>
            )}

            <div className="upload-actions">
              <button
                className={`btn btn-primary upload-btn ${isUploading ? 'loading' : ''}`}
                onClick={handleUpload}
                disabled={uploadedFiles.length === 0 || isUploading || uploadComplete}
              >
                {isUploading ? (
                  <div className="loading">
                    <FaSpinner className="spinning" />
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

          <div className="footer-info">
            <p>Language: {selectedLanguage?.toUpperCase()} | Files will be processed using OCR and AI analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadItems;
