import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaFileMedical, FaCalendarAlt, FaRobot, FaDownload, FaEye, FaPlus, FaTrash, FaUser, FaSignOutAlt, FaHome, FaUserMd, FaCog, FaChartLine, FaBell, FaTimes, FaFilePdf, FaFileImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const UploadPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState('uploads');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showFileTypeModal, setShowFileTypeModal] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');

  const notifications = [
    { id: 1, message: 'Your appointment reminder for tomorrow', type: 'reminder', time: '1 hour ago' },
    { id: 2, message: 'New lab results available', type: 'results', time: '3 hours ago' },
    { id: 3, message: 'Prescription refill due', type: 'prescription', time: '1 day ago' }
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false); // Close notifications if open
  };

  // Load uploaded files from localStorage
  useEffect(() => {
    try {
      const storedFiles = localStorage.getItem('uploadPageFiles');
      if (storedFiles) {
        const parsedFiles = JSON.parse(storedFiles);
        console.log('📁 UploadPage loaded', parsedFiles.length, 'files from localStorage');
        setUploadedFiles(parsedFiles);
      }
    } catch (error) {
      console.error('Error loading files from localStorage:', error);
      localStorage.removeItem('uploadPageFiles');
    }
  }, []);

  // Save uploaded files to localStorage
  useEffect(() => {
    try {
      if (uploadedFiles.length > 0) {
        localStorage.setItem('uploadPageFiles', JSON.stringify(uploadedFiles));
        console.log('💾 UploadPage saved', uploadedFiles.length, 'files to localStorage');
      }
    } catch (error) {
      console.error('Error saving files to localStorage:', error);
    }
  }, [uploadedFiles]);

  const handleUploadReport = () => {
    // Show modal to ask for file type
    setShowFileTypeModal(true);
  };

  const handleFileTypeSelection = (fileType) => {
    setSelectedFileType(fileType);
    setShowFileTypeModal(false);
    
    const input = document.createElement('input');
    input.type = 'file';
    
    if (fileType === 'pdf') {
      input.accept = '.pdf';
    } else if (fileType === 'image') {
      input.accept = '.jpg,.jpeg,.png';
    } else {
      // 'any' - allow all
      input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
    }
    
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        if (fileType === 'any') {
          await processFileWithoutAI(file);
        } else {
          await processFileWithAI(file, fileType);
        }
      }
    };
    input.click();
  };

  const processFileWithoutAI = async (file) => {
    setIsUploading(true);
    setProcessingStatus('Uploading file...');
    
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result;
        
        const localFileData = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
          data: fileData,
          processing: false,
          processed: false,
          skippedAI: true
        };
        
        setUploadedFiles(prev => [...prev, localFileData]);
        setProcessingStatus('File uploaded successfully!');
        setTimeout(() => setProcessingStatus(''), 2000);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setProcessingStatus('Upload failed!');
      setTimeout(() => setProcessingStatus(''), 2000);
    } finally {
      setIsUploading(false);
    }
  };

  const processFileWithAI = async (file, fileType) => {
    setIsUploading(true);
    setProcessingStatus('Uploading file...');
    
    try {
      // Read file as data URL
      const reader = new FileReader();
      reader.onload = async () => {
        const fileData = reader.result;
        
        // Store file locally first
        const localFileData = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
          data: fileData,
          processing: true
        };
        
        setUploadedFiles(prev => [...prev, localFileData]);
        setProcessingStatus('Processing with AI...');
        
        // Send to AI service
        const endpoint = fileType === 'pdf' ? API_ENDPOINTS.AI.PDF_OCR : API_ENDPOINTS.AI.IMAGE_OCR;
        
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              [fileType === 'pdf' ? 'pdf_url' : 'image_url']: fileData,
              user_id: user?.id || `user_${Date.now()}` // User isolation
            })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`AI service error: ${response.status} - ${errorText}`);
          }
          
          const aiResult = await response.json();
          
          // Update file with AI results
          setUploadedFiles(prev => prev.map(f => 
            f.id === localFileData.id 
              ? { 
                  ...f, 
                  processing: false, 
                  processed: aiResult.success,
                  aiError: !aiResult.success,
                  documentType: aiResult.document_type || fileType,
                  extractedText: aiResult.extracted_text,
                  aiAnalysis: aiResult,
                  documentId: aiResult.document_id,
                  confidenceScores: aiResult.confidence_scores,
                  chunksCreated: aiResult.chunks_created,
                  processingTime: aiResult.processing_time
                }
              : f
          ));
          
          setProcessingStatus('AI analysis complete!');
          setTimeout(() => setProcessingStatus(''), 2000);
          
        } catch (aiError) {
          // Mark file as processed even if AI fails
          setUploadedFiles(prev => prev.map(f => 
            f.id === localFileData.id 
              ? { ...f, processing: false, aiError: aiError.message, processed: false }
              : f
          ));
          setProcessingStatus(`AI processing failed: ${aiError.message}`);
          setTimeout(() => setProcessingStatus(''), 5000);
        }
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      setProcessingStatus('Upload failed!');
      setTimeout(() => setProcessingStatus(''), 2000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex text-gray-700 dark:text-gray-300">
      {/* File Type Selection Modal */}
      {showFileTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Select Document Type</h3>
              <button 
                onClick={() => setShowFileTypeModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Choose the type of medical document you want to upload
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => handleFileTypeSelection('image')}
                className="w-full p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaFileImage className="text-3xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">Image Document</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">JPG, PNG format</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">X-rays, scans, photos</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleFileTypeSelection('pdf')}
                className="w-full p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaFilePdf className="text-3xl text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">PDF Document</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">PDF format</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Lab reports, prescriptions</p>
                  </div>
                </div>
              </button>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => handleFileTypeSelection('any')}
                  className="w-full p-4 text-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all"
                >
                  Skip AI Processing (Upload only)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen px-4 pt-4 pb-4 flex flex-col shadow-lg">
        <div className="flex items-center mb-4">
          <img src="/logo1.jpg" alt="MedClerk Logo" className="h-16 w-26 object-contain" />
        </div>

        {/* Enhanced Patient Profile Card */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 grid place-items-center text-blue-600 dark:text-blue-400 shadow-md">
              <FaUser className="text-xl" />
            </div>
            <div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </div>

          {user?.role === 'PATIENT' && user?.patientProfile && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200/50 dark:border-blue-700/50">
              <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Blood Group</div>
                <div className="font-semibold text-blue-600">{user.patientProfile.bloodGroup || 'N/A'}</div>
              </div>
              <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Height</div>
                <div className="font-semibold text-blue-600">{user.patientProfile.heightCm || 'N/A'} cm</div>
              </div>
              <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Weight</div>
                <div className="font-semibold text-blue-600">{user.patientProfile.weightKg || 'N/A'} kg</div>
              </div>
              <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Age</div>
                <div className="font-semibold text-blue-600">{user.patientProfile.age || 'N/A'} yrs</div>
              </div>
            </div>
          )}
        </div>

        <nav className="space-y-1 flex-1">
          {[
            { id: 'overview', name: 'Overview', icon: FaHome, route: '/dashboard' },
            { id: 'uploads', name: 'Uploads', icon: FaCloudUploadAlt, route: '/uploads', badge: uploadedFiles.length },
            { id: 'appointments', name: 'Appointments', icon: FaCalendarAlt, route: '/dashboard' },
            { id: 'doctors', name: 'Doctors', icon: FaUserMd, route: '/doctors' },
            { id: 'reports', name: 'Reports', icon: FaFileMedical, route: '/dashboard', badge: uploadedFiles.length },
            { id: 'settings', name: 'Settings', icon: FaCog, route: '/dashboard' }
          ].map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105' 
                    : 'hover:bg-blue-50 dark:hover:bg-gray-700 hover:shadow-sm hover:transform hover:scale-102'
                }`}
                onClick={() => navigate(item.route)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-600 dark:to-gray-700 text-blue-600 dark:text-blue-400 shadow-sm hover:shadow-md'
                  } flex items-center justify-center`}>
                    <Icon className={`transition-all duration-300 ${isActive ? 'text-lg' : 'text-base hover:text-lg'}`} />
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : item.id === 'uploads' ? 'bg-blue-500 text-white' : 'bg-primary-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
        <button className="btn btn-secondary mt-auto" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {/* Enhanced navbar with notifications */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="p-2 rounded-lg hover:bg-gray-50 transition-colors relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FaBell className="text-gray-600" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className="p-3 border-b border-gray-50 hover:bg-gray-25 transition-colors">
                          <div className="text-sm text-gray-800">{notif.message}</div>
                          <div className="text-xs text-gray-500 mt-1">{notif.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile Button & Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={toggleProfile}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 grid place-items-center">
                    <FaUser className="text-primary-600" />
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>

                {showProfile && (
                  <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800">Profile Information</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <label className="text-xs text-gray-500">Full Name</label>
                        <p className="text-sm font-medium">{user?.name}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Email</label>
                        <p className="text-sm font-medium">{user?.email}</p>
                      </div>
                      {user?.role === 'PATIENT' && user?.patientProfile && (
                        <>
                          <div>
                            <label className="text-xs text-gray-500">Blood Group</label>
                            <p className="text-sm font-medium">{user.patientProfile.bloodGroup || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Height</label>
                            <p className="text-sm font-medium">{user.patientProfile.heightCm || 'Not specified'} cm</p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Weight</label>
                            <p className="text-sm font-medium">{user.patientProfile.weightKg || 'Not specified'} kg</p>
                          </div>
                        </>
                      )}
                      <div className="pt-2 border-t border-gray-100">
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          <FaSignOutAlt className="inline mr-2" /> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content area with padding */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-3xl p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FaCloudUploadAlt className="text-white text-xl" />
              </div>
              Medical Documents
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Upload and manage your medical reports and documents</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full flex items-center justify-center">
              <span className="text-4xl">📄</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Upload New Documents</h3>
            {processingStatus && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-2">
                <FaRobot className="animate-pulse" />
                {processingStatus}
              </p>
            )}
          </div>
          <button 
            onClick={handleUploadReport}
            disabled={isUploading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
          >
            <FaPlus />
            {isUploading ? 'Processing...' : 'Upload New Report'}
          </button>
        </div>
        
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
          onClick={handleUploadReport}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <FaCloudUploadAlt className="text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Drop files here or click to upload</h4>
          <p className="text-gray-600 dark:text-gray-400">Supports PDF, JPG, PNG, DOC files up to 10MB</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span>📄 Lab Reports</span>
            <span>🖼️ X-rays</span>
            <span>📋 Prescriptions</span>
            <span>📊 Test Results</span>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your Documents ({uploadedFiles.length})</h3>
          <div className="flex items-center gap-2">
            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <FaEye />
            </button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <FaDownload />
            </button>
          </div>
        </div>
        
        {uploadedFiles.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaFileMedical className="text-2xl text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No documents uploaded yet</h4>
            <p>Start by uploading your medical reports and documents</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl hover:shadow-md transition-all group border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                    <span className="text-2xl">
                      {file.type.includes('pdf') ? '📄' : 
                       file.type.includes('image') ? '🖼️' : 
                       file.type.includes('doc') ? '📝' : '📋'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800 dark:text-gray-200 font-semibold">{file.name}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {file.processing && (
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium flex items-center gap-1">
                          <FaRobot className="animate-pulse" />
                          AI Processing...
                        </span>
                      )}
                      {file.processed && (
                        <>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                            ✓ Processed
                          </span>
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                            <FaRobot className="inline mr-1" />
                            AI Analyzed
                          </span>
                        </>
                      )}
                      {file.aiError && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                          AI Error
                        </span>
                      )}
                      {file.skippedAI && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 rounded-full text-xs font-medium">
                          ✓ Uploaded (No AI)
                        </span>
                      )}
                      {!file.processing && !file.processed && !file.aiError && !file.skippedAI && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 rounded-full text-xs font-medium">
                          Uploaded
                        </span>
                      )}
                    </div>
                    {file.aiAnalysis && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">AI Insights:</span> {JSON.stringify(file.aiAnalysis).substring(0, 100)}...
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg">
                    <FaEye />
                  </button>
                  <button 
                    className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = file.data;
                      link.download = file.name;
                      link.click();
                    }}
                  >
                    <FaDownload />
                  </button>
                  <button 
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
