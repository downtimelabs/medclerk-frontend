import React, { useState, useEffect, useMemo } from 'react';
import { FaUser, FaSignOutAlt, FaCloudUploadAlt, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaHome, FaUserMd, FaFileMedical, FaChartLine, FaBell, FaDownload, FaEye, FaPlus, FaRobot, FaPaperPlane, FaMicrophone, FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaStethoscope, FaTrash, FaHeart, FaHeartbeat, FaTint, FaFilePdf, FaFileAlt, FaTimes, FaFileImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useTheme } from '../contexts/ThemeContext';
import { API_ENDPOINTS, getAuthHeaders, apiFetch } from '../config/api';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [appointments, setAppointments] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showFileTypeModal, setShowFileTypeModal] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    bloodGroup: '',
    heightCm: '',
    weightKg: '',
    gender: ''
  });
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', message: 'Hello! I\'m your AI health assistant. I can help you understand your medical reports and answer health-related questions. How can I help you today?', time: new Date().toLocaleTimeString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedDoctor, setExpandedDoctor] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [loadingPatientDetails, setLoadingPatientDetails] = useState(false);
  const doctors = [
    'Dr. John Smith',
    'Dr. Emily Clark',
    'Dr. Richard Lee',
    'Dr. Priya Sharma'
  ];

  // Rich doctor dataset for Doctors section
  const doctorData = useMemo(() => ([
    { name: 'Dr. John Smith', specialty: 'Cardiology', rating: 4.8, patients: 1200, experience: 12, clinic: 'City Heart Center', conditions: ['Heart Disease', 'Hypertension', 'Arrhythmia'], availability: 'Mon-Fri: 9AM-5PM', bio: 'Specialist in cardiovascular diseases with expertise in preventive cardiology and heart disease management.', education: 'MD from Johns Hopkins University', languages: ['English'], fee: 180 },
    { name: 'Dr. Emily Clark', specialty: 'Dermatology', rating: 4.6, patients: 980, experience: 8, clinic: 'SkinCare Clinic', conditions: ['Acne', 'Eczema', 'Psoriasis'], availability: 'Tue-Sat: 10AM-6PM', bio: 'Experienced dermatologist focusing on medical and cosmetic dermatology.', education: 'MD from Stanford University', languages: ['English'], fee: 150 },
    { name: 'Dr. Richard Lee', specialty: 'Neurology', rating: 4.9, patients: 1430, experience: 15, clinic: 'Neuro Wellness', conditions: ['Migraine', 'Epilepsy', 'Parkinson’s'], availability: 'Mon-Thu: 9AM-4PM', bio: 'Neurologist with extensive experience in movement disorders and headache management.', education: 'MD from UCSF', languages: ['English', 'Mandarin'], fee: 220 },
    { name: 'Dr. Priya Sharma', specialty: 'Pediatrics', rating: 4.7, patients: 1103, experience: 10, clinic: 'Kids Health Hub', conditions: ['Common cold', 'Asthma', 'Allergies'], availability: 'Mon-Sat: 10AM-7PM', bio: 'Pediatrician passionate about child wellness and preventive care.', education: 'MBBS, MD Pediatrics (AIIMS)', languages: ['English', 'Hindi'], fee: 120 },
    { name: 'Dr. Arjun Mehta', specialty: 'General', rating: 4.5, patients: 870, experience: 7, clinic: 'Family Care Clinic', conditions: ['General Medicine', 'Diabetes', 'Hypertension'], availability: 'Mon-Fri: 11AM-8PM', bio: 'General physician providing comprehensive primary care for families.', education: 'MBBS, DNB (Family Medicine)', languages: ['English', 'Hindi'], fee: 100 },
    { name: 'Dr. Sara Khan', specialty: 'Cardiology', rating: 4.8, patients: 1310, experience: 11, clinic: 'CardioLife', conditions: ['Heart Disease', 'High Cholesterol', 'Hypertension'], availability: 'Mon-Fri: 9AM-5PM', bio: 'Cardiologist focused on preventive cardiology and heart disease management.', education: 'MD from Harvard Medical School', languages: ['English', 'Spanish'], fee: 200 }
  ]), []);

  const pendingReports = 3;
  useEffect(() => {
    const stored = localStorage.getItem('patientAppointments');
    if (stored) setAppointments(JSON.parse(stored));
    else setAppointments([
      { id: 'P-2001', date: '2025-09-12', doctor: 'Dr. John Smith', time: '10:30 AM', room: '302B', status: 'Confirmed' },
      { id: 'P-2002', date: '2025-09-16', doctor: 'Dr. Emily Clark', time: '02:15 PM', room: '118', status: 'Pending' },
    ]);
  }, []);
  useEffect(() => {
    localStorage.setItem('patientAppointments', JSON.stringify(appointments));
  }, [appointments]);

  // Load uploaded files from backend and localStorage on component mount
  useEffect(() => {
    const loadFiles = async () => {
      try {
        // First try to load from backend (authoritative source)
        if (user) {
          await loadDocumentsFromBackend();
        } else {
          // Fallback to localStorage if no user (shouldn't happen in normal flow)
          const storedFiles = localStorage.getItem('patientUploadedFiles');
          if (storedFiles) {
            const parsedFiles = JSON.parse(storedFiles);
            console.log('📁 Loaded', parsedFiles.length, 'files from localStorage');
            setUploadedFiles(parsedFiles);
          } else {
            console.log('📁 No files found in localStorage');
          }
        }
      } catch (error) {
        console.error('Error loading files:', error);
        // Clear corrupted data
        localStorage.removeItem('patientUploadedFiles');
      } finally {
        // Mark initial load as complete
        setIsInitialLoad(false);
      }
    };

    loadFiles();
  }, [user]);

  // Save uploaded files to localStorage whenever files change (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      try {
        localStorage.setItem('patientUploadedFiles', JSON.stringify(uploadedFiles));
        console.log('💾 Saved', uploadedFiles.length, 'files to localStorage');
      } catch (error) {
        console.error('Error saving files to localStorage:', error);
      }
    }
  }, [uploadedFiles, isInitialLoad]);

  // Debug function to check localStorage status
  const checkLocalStorageStatus = () => {
    const stored = localStorage.getItem('patientUploadedFiles');
    console.log('🔍 LocalStorage Debug:');
    console.log('- Key exists:', !!stored);
    console.log('- Stored data:', stored);
    console.log('- Current uploadedFiles length:', uploadedFiles.length);
    console.log('- Current uploadedFiles:', uploadedFiles);
    
    // Check for failed uploads
    const failedUploads = uploadedFiles.filter(f => f.uploadError);
    if (failedUploads.length > 0) {
      console.log('❌ Failed uploads:', failedUploads.length);
      failedUploads.forEach(file => {
        console.log(`  - ${file.name}:`);
        console.log(`    Error Type: ${file.errorType}`);
        console.log(`    Error Message: ${file.error}`);
        console.log(`    Original Error: ${file.originalError}`);
        console.log(`    Can Retry: ${file.canRetry}`);
      });
    }
    
    // Check authentication status
    const token = localStorage.getItem('accessToken');
    console.log('🔐 Auth Status:');
    console.log('- Access token exists:', !!token);
    console.log('- User object:', user);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        console.log('- Token expired:', isExpired);
        console.log('- Token expires at:', new Date(payload.exp * 1000));
        console.log('- Current time:', new Date());
        
        if (isExpired) {
          console.log('⚠️ TOKEN IS EXPIRED - Please log out and log in again');
        }
      } catch (e) {
        console.log('- Invalid token format:', e.message);
      }
    }
  };

  // Calendar state
  const [viewDate, setViewDate] = useState(new Date());
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const monthDays = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);
  const appointmentDays = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth() + 1;
    return new Set(
      appointments
        .filter(a => {
          const [yy, mm] = a.date.split('-').map(n => parseInt(n, 10));
          return yy === y && mm === m;
        })
        .map(a => parseInt(a.date.split('-')[2], 10))
    );
  }, [appointments, viewDate]);

  const goPrevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ date: '', time: '', doctor: '', room: '' });
  const saveAppointment = (e) => {
    e.preventDefault();
    if (editingId) {
      setAppointments(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a));
    } else {
      const id = `P-${Math.floor(1000 + Math.random() * 9000)}`;
      const next = { id, date: form.date, time: form.time, doctor: form.doctor, room: form.room || 'TBD', status: 'Pending' };
      setAppointments(prev => [next, ...prev]);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ date: '', time: '', doctor: '', room: '' });
  };

  const onEdit = (a) => {
    setForm({ date: a.date, time: a.time, doctor: a.doctor, room: a.room });
    setEditingId(a.id);
    setIsModalOpen(true);
  };

  const onCancel = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const handleUploadReport = () => {
    // Show modal to ask for file type
    setShowFileTypeModal(true);
  };

  // Map file types to document types
  const getDocumentType = (fileType, mimeType) => {
    if (fileType === 'image') {
      return 'SCAN_IMAGE';
    } else if (fileType === 'pdf') {
      // For PDFs, we could be smarter about classification, but default to OTHER
      return 'OTHER';
    }
    return 'OTHER';
  };

  // New upload function using presigned URLs and S3
  const uploadFileToS3 = async (file, metadata, onProgress) => {
    try {
      console.log(`📤 Starting upload for ${file.name}...`);
      
      // Step 1: Get presigned URL
      onProgress?.({ stage: 'presigned', percent: 10 });
      
      let presignedResponse;
      try {
        presignedResponse = await apiFetch(API_ENDPOINTS.UPLOAD.PRESIGNED_URL, {
          method: 'POST',
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size
          })
        });
      } catch (error) {
        // If token is invalid, suggest re-login
        if (error.message.includes('Invalid access token') || error.message.includes('401')) {
          throw new Error('Authentication expired. Please log out and log in again.');
        }
        throw error;
      }

      const { presignedUrl, key } = presignedResponse.data;
      console.log(`🔗 Got presigned URL for key: ${key}`);

      // Step 2: Upload to S3 with progress tracking
      onProgress?.({ stage: 'uploading', percent: 20 });

      const uploadResponse = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = 20 + Math.round((e.loaded / e.total) * 60);
            onProgress?.({ stage: 'uploading', percent });
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            resolve(xhr);
          } else {
            reject(new Error(`S3 upload failed: ${xhr.status} ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('S3 upload failed')));
        
        xhr.open('PUT', presignedUrl);
        // Only set Content-Type for S3 upload - NO Authorization header needed
        // The presigned URL contains all necessary authentication
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      console.log('✅ File uploaded to S3 successfully');

      // Step 3: Confirm upload with backend
      onProgress?.({ stage: 'confirming', percent: 85 });

      const confirmResponse = await apiFetch(API_ENDPOINTS.UPLOAD.CONFIRM, {
        method: 'POST',
        body: JSON.stringify({
          key,
          title: metadata.title || file.name,
          type: metadata.type,
          mimeType: file.type,
          fileSize: file.size
        })
      });

      console.log('🎉 Upload confirmed:', confirmResponse.data);
      onProgress?.({ stage: 'complete', percent: 100 });

      return {
        success: true,
        document: confirmResponse.data,
        s3Key: key
      };

    } catch (error) {
      console.error('❌ Upload error:', error);
      
      // Provide more specific error messages
      let errorMessage = error.message;
      let errorType = 'Unknown';
      
      if (error.message.includes('presigned')) {
        errorType = 'Presigned URL';
        errorMessage = 'Failed to get upload URL from server';
      } else if (error.message.includes('S3 upload failed')) {
        errorType = 'S3 Upload';
        errorMessage = 'Failed to upload file to storage';
      } else if (error.message.includes('confirm')) {
        errorType = 'Backend Confirmation';
        errorMessage = 'File uploaded but failed to save metadata';
      } else if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('Invalid access token') || error.message.includes('Authentication expired')) {
        errorType = 'Authentication';
        errorMessage = 'Authentication expired. Please log out and log in again.';
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        errorType = 'Permission';
        errorMessage = 'You do not have permission to upload files';
      } else if (error.message.includes('413') || error.message.includes('too large')) {
        errorType = 'File Size';
        errorMessage = 'File is too large (max 10MB)';
      }
      
      return {
        success: false,
        error: errorMessage,
        errorType: errorType,
        originalError: error.message
      };
    }
  };

  // Helper function to query uploaded documents using RAG
  const queryDocuments = async (question) => {
    try {
        console.log('🤖 Querying documents:', question);
      
      // Validate question length (1-500 characters as per API spec)
      if (!question || question.trim().length === 0) {
        throw new Error('Question cannot be empty');
      }
      if (question.length > 500) {
        throw new Error('Question too long (max 500 characters)');
      }

      const response = await apiFetch(API_ENDPOINTS.PATIENT.QUERY_DOCUMENTS, {
        method: 'POST',
        body: JSON.stringify({
          question: question.trim()
        })
      });

      console.log('📥 RAG Query response:', response);

      // Handle the new API response format
      if (response.statusCode === 200 && response.data) {
        return {
          success: response.data.success,
          answer: response.data.answer,
          sources: response.data.sources || [],
          processing_time: response.data.processing_time,
          query: response.data.query
        };
      } else {
        throw new Error(response.message || 'Query failed');
      }
    } catch (error) {
      console.error('❌ Document query error:', error);
      
      // Handle different error types
      let errorMessage = 'Sorry, I encountered an error while searching your documents.';
      
      if (error.message.includes('401') || error.message.includes('not authenticated')) {
        errorMessage = 'Please log in to query your documents.';
      } else if (error.message.includes('400') || error.message.includes('Validation error')) {
        errorMessage = 'Please check your question and try again.';
      } else if (error.message.includes('500')) {
        errorMessage = 'The document search service is temporarily unavailable. Please try again later.';
      }

      return {
        success: false,
        error: error.message,
        answer: errorMessage,
        sources: []
      };
    }
  };

  // Helper function to delete a file
  const handleDeleteFile = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setUploadedFiles(prev => {
        const updatedFiles = prev.filter(file => file.id !== fileId);
        console.log('🗑️ Deleted file, remaining:', updatedFiles.length);
        return updatedFiles;
      });
    }
  };

  // Helper function to clear all files (for testing)
  const handleClearAllFiles = () => {
    if (window.confirm('Are you sure you want to delete ALL uploaded files? This cannot be undone.')) {
      setUploadedFiles([]);
      localStorage.removeItem('patientUploadedFiles');
      console.log('🧹 Cleared all files and localStorage');
    }
  };

  // Function to load documents from backend
  const loadDocumentsFromBackend = async () => {
    try {
      console.log('📥 Loading documents from backend...');
      const response = await apiFetch(API_ENDPOINTS.UPLOAD.DOCUMENTS);
      
      if (response.data && Array.isArray(response.data)) {
        const backendFiles = response.data.map(doc => ({
          id: doc.id,
          name: doc.title,
          size: doc.fileSize,
          type: doc.mimeType,
          uploadDate: doc.createdAt,
          documentType: doc.type,
          processing: false,
          processed: true,
          s3Key: doc.objectKey,
          documentId: doc.id,
          ocrProcessing: false, // Would need to check OCR status separately
          backendDocument: doc,
          fromBackend: true
        }));
        
        setUploadedFiles(backendFiles);
        console.log(`📥 Loaded ${backendFiles.length} documents from backend`);
      }
    } catch (error) {
      console.error('❌ Failed to load documents from backend:', error);
    }
  };

  // Function to fetch patient details
  const fetchPatientDetails = async () => {
    if (!user || user.role !== 'PATIENT') {
      console.log('⚠️ Not a patient or no user, skipping fetch');
      return;
    }
    
    setLoadingPatientDetails(true);
    try {
      // Get auth token to verify it exists
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('❌ No access token found');
        throw new Error('Authentication required. Please log in again.');
      }
      
      console.log('🔐 Fetching patient details from:', API_ENDPOINTS.PATIENT.DETAILS);
      console.log('🔐 Auth token exists:', !!token);
      
      // Use apiFetch which automatically includes Authorization header
      const response = await apiFetch(API_ENDPOINTS.PATIENT.DETAILS, {
        method: 'GET',
        headers: {
          // Explicitly ensure Authorization header is included
          ...getAuthHeaders()
        }
      });
      
      console.log('📥 Patient details API response:', response);
      
      // Handle both response formats: {success, data} or {status, data}
      if ((response.success || response.status === 'success') && response.data) {
        // Map the response structure to match our expected format
        // API returns: { data: { personal: {...}, medical: {...}, careTeam: {...} } }
        const mappedData = {
          personalInfo: {
            id: response.data.personal?.id,
            name: response.data.personal?.name,
            email: response.data.personal?.email,
            phoneNumber: response.data.medical?.phone || response.data.personal?.phoneNumber,
            countryCode: response.data.medical?.phone?.startsWith('+') ? response.data.medical.phone.split(' ')[0] : '',
            country: response.data.personal?.country,
            state: response.data.personal?.state,
            avatarUrl: response.data.personal?.avatarUrl,
            emailVerified: response.data.personal?.emailVerified,
            createdAt: response.data.personal?.createdAt,
            updatedAt: response.data.personal?.updatedAt
          },
          medicalInfo: {
            dateOfBirth: response.data.medical?.dateOfBirth,
            gender: response.data.medical?.gender,
            bloodType: response.data.medical?.bloodGroup ? response.data.medical.bloodGroup.replace('-', '_NEGATIVE').replace('+', '_POSITIVE') : response.data.medical?.bloodType,
            bloodGroup: response.data.medical?.bloodGroup, // e.g., "A-"
            height: response.data.medical?.heightCm,
            heightCm: response.data.medical?.heightCm, // Also store as heightCm for compatibility
            weight: response.data.medical?.weightKg,
            weightKg: response.data.medical?.weightKg, // Also store as weightKg for compatibility
            allergies: response.data.medical?.allergies ? (Array.isArray(response.data.medical.allergies) ? response.data.medical.allergies : [response.data.medical.allergies]) : [],
            medications: response.data.medical?.medications || [],
            medicalConditions: response.data.medical?.chronicConditions || [],
            chronicConditions: response.data.medical?.chronicConditions || [], // Also store as chronicConditions
            emergencyContact: response.data.medical?.emergencyContact,
            phone: response.data.medical?.phone, // Store phone directly from medical
            profileCreatedAt: response.data.medical?.profileCreatedAt,
            profileUpdatedAt: response.data.medical?.profileUpdatedAt
          },
          careTeam: response.data.careTeam || { doctors: [], caregivers: [] },
          documentStats: response.data.documentStats || {}
        };
        
        setPatientDetails(mappedData);
        console.log('✅ Patient details loaded and mapped successfully:');
        console.log('  - Personal Info:', mappedData.personalInfo);
        console.log('  - Medical Info:', mappedData.medicalInfo);
        console.log('  - Care Team:', mappedData.careTeam);
      } else {
        console.warn('⚠️ Response success but no data:', response);
      }
    } catch (error) {
      console.error('❌ Failed to fetch patient details:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack
      });
      // Don't show error to user, just use existing user data
    } finally {
      setLoadingPatientDetails(false);
    }
  };

  // Fetch patient details when profile dropdown or modal is opened
  useEffect(() => {
    if ((showProfile || showProfileModal) && user?.role === 'PATIENT' && !loadingPatientDetails) {
      // Always fetch when modal opens to ensure fresh data
      if (showProfileModal && !patientDetails) {
        console.log('🔄 Profile modal opened, fetching patient details...');
        fetchPatientDetails();
      } else if (showProfile && !patientDetails) {
        console.log('🔄 Profile dropdown opened, fetching patient details...');
        fetchPatientDetails();
      }
    }
  }, [showProfile, showProfileModal]);

  // Function to get file URL for viewing/downloading
  const getFileUrl = async (s3Key) => {
    try {
      const response = await apiFetch(`${API_ENDPOINTS.UPLOAD.FILE_URL}?key=${encodeURIComponent(s3Key)}`);
      return response.data?.url;
    } catch (error) {
      console.error('❌ Failed to get file URL:', error);
      return null;
    }
  };

  // Function to retry failed upload
  const retryUpload = async (fileId) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file || !file.canRetry) return;

    console.log(`🔄 Retrying upload for ${file.name}...`);
    
    // Reset file status
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? {
        ...f,
        processing: true,
        uploadError: false,
        error: null,
        uploadProgress: { stage: 'presigned', percent: 0 }
      } : f
    ));

    // Create a File object from the stored data (if available)
    // Note: This is a simplified retry - in a real app, you'd need to store the original File object
    try {
      // For now, just show that retry was attempted
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? {
            ...f,
            processing: false,
            error: 'Retry not fully implemented - please re-upload the file'
          } : f
        ));
      }, 2000);
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  // Test function to add a dummy file for testing persistence
  const addTestFile = () => {
    const testFile = {
      id: Date.now(),
      name: 'test-report.pdf',
      size: 1024000,
      type: 'application/pdf',
      uploadDate: new Date().toISOString(),
      documentType: 'OTHER',
      processing: false,
      processed: true,
      s3Key: 'test-key',
      documentId: 'test-doc-id',
      ocrProcessing: false
    };
    
    setUploadedFiles(prev => [...prev, testFile]);
    console.log('✅ Added test file for persistence testing');
  };

  const handleFileTypeSelection = (fileType) => {
    setSelectedFileType(fileType);
    setShowFileTypeModal(false);
    
    const input = document.createElement('input');
    input.type = 'file';
    
    if (fileType === 'pdf') {
      input.accept = '.pdf';
    } else if (fileType === 'image') {
      input.accept = '.jpg,.jpeg,.png,.gif,.webp';
    } else {
      // 'any' - allow all supported types
      input.accept = 'image/*,application/pdf,.doc,.docx,text/plain';
    }
    
    input.multiple = true; // Allow multiple files
    input.onchange = async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        setIsUploading(true);

        try {
          const uploadPromises = files.map(async (file) => {
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
              throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
            }

            // Create initial file entry with processing status
            const fileId = Date.now() + Math.random();
            const initialFileData = {
              id: fileId,
              name: file.name,
              size: file.size,
              type: file.type,
              uploadDate: new Date().toISOString(),
              documentType: getDocumentType(fileType, file.type),
              processing: true,
              processed: false,
              uploadProgress: { stage: 'presigned', percent: 0 },
              s3Key: null,
              documentId: null,
              ocrProcessing: false
            };

            // Add file to list immediately to show processing status
            setUploadedFiles(prev => [...prev, initialFileData]);

            // Upload to S3 with progress tracking
            const result = await uploadFileToS3(
              file,
              {
                title: file.name,
                type: getDocumentType(fileType, file.type)
              },
              (progress) => {
                // Update progress in real-time
                setUploadedFiles(prev => prev.map(f => 
                  f.id === fileId ? { ...f, uploadProgress: progress } : f
                ));
              }
            );

            // Update file data with upload results
            setUploadedFiles(prev => prev.map(f => 
              f.id === fileId ? {
                ...f,
                processing: false,
                processed: result.success,
                uploadError: !result.success,
                error: result.error,
                errorType: result.errorType,
                originalError: result.originalError,
                s3Key: result.s3Key,
                documentId: result.document?.id,
                ocrProcessing: result.document?.ocrProcessing || false,
                backendDocument: result.document,
                canRetry: !result.success && !['Authentication', 'Permission', 'File Size'].includes(result.errorType)
              } : f
            ));

            return result;
          });

          // Wait for all uploads to complete
          const results = await Promise.allSettled(uploadPromises);
          
          // Count successes and failures
          const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
          const failed = results.filter(r => r.status === 'rejected' || !r.value?.success).length;

          // Show appropriate message
          let message = '';
          if (successful > 0) {
            message += `✅ Successfully uploaded ${successful} file(s)`;
            if (results.some(r => r.value?.document?.ocrProcessing)) {
              message += ' (OCR processing started for PDFs)';
            }
          }
          if (failed > 0) {
            message += `${successful > 0 ? '\n' : ''}❌ Failed to upload ${failed} file(s)`;
          }
          
          alert(message || 'Upload completed');

        } catch (error) {
          console.error('Upload error:', error);
          alert(`Upload failed: ${error.message}`);
        } finally {
          setIsUploading(false);
        }
      }
    };
    input.click();
  };

  // Helper function to format blood type (O_POSITIVE -> O+)
  const formatBloodType = (bloodType) => {
    if (!bloodType) return '';
    return bloodType.replace('_', '+');
  };

  // Helper function to format date for input (ISO date to YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Helper function to format phone number with country code
  const formatPhoneNumber = () => {
    // Check medical.phone first (from API response)
    if (patientDetails?.medicalInfo?.phone) {
      return patientDetails.medicalInfo.phone;
    }
    // Check emergency contact phone
    if (patientDetails?.medicalInfo?.emergencyContact?.phone) {
      return patientDetails.medicalInfo.emergencyContact.phone;
    }
    // Check personalInfo.phoneNumber
    if (patientDetails?.personalInfo?.phoneNumber) {
      const countryCode = patientDetails.personalInfo.countryCode || '';
      return countryCode ? `${countryCode} ${patientDetails.personalInfo.phoneNumber}` : patientDetails.personalInfo.phoneNumber;
    }
    return '';
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    // Use patientDetails if available, otherwise fall back to user data
    setEditFormData({
      name: patientDetails?.personalInfo?.name || user?.name || '',
      email: patientDetails?.personalInfo?.email || user?.email || '',
      phone: formatPhoneNumber() || user?.phone || '',
      dob: formatDateForInput(patientDetails?.medicalInfo?.dateOfBirth) || user?.dob || '',
      bloodGroup: patientDetails?.medicalInfo?.bloodGroup || formatBloodType(patientDetails?.medicalInfo?.bloodType) || user?.patientProfile?.bloodGroup || '',
      heightCm: patientDetails?.medicalInfo?.heightCm || patientDetails?.medicalInfo?.height || user?.patientProfile?.heightCm || '',
      weightKg: patientDetails?.medicalInfo?.weightKg || patientDetails?.medicalInfo?.weight || user?.patientProfile?.weightKg || '',
      gender: patientDetails?.medicalInfo?.gender || user?.patientProfile?.gender || ''
    });
  };

  const handleSaveProfile = () => {
    // Update user data
    const updatedUser = {
      ...user,
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      dob: editFormData.dob,
      patientProfile: {
        ...user?.patientProfile,
        bloodGroup: editFormData.bloodGroup,
        heightCm: editFormData.heightCm,
        weightKg: editFormData.weightKg,
        gender: editFormData.gender
      }
    };

    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Update parent component (if needed)
    if (onProfileComplete) {
      onProfileComplete(updatedUser);
    }

    setIsEditingProfile(false);
    setShowProfileModal(false);
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditFormData({
      name: '',
      email: '',
      phone: '',
      dob: '',
      bloodGroup: '',
      heightCm: '',
      weightKg: '',
      gender: ''
    });
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: chatInput,
      time: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const question = chatInput;
    setChatInput('');
    setIsTyping(true);

    try {
      // Query uploaded documents using RAG
      const queryResult = await queryDocuments(question);
      
      let botResponse;
      let botMessage;
      
      if (queryResult.success && queryResult.answer) {
        // Use AI-generated answer from documents
        botResponse = queryResult.answer;
        
        // Add source information if available
        if (queryResult.sources && queryResult.sources.length > 0) {
          const sourceInfo = queryResult.sources.map(source => 
            `📄 ${source.source_name} (${Math.round(source.relevance_score * 100)}% relevant)`
          ).join('\n');
          botResponse += `\n\n**Sources:**\n${sourceInfo}`;
          
          // Add processing time if available
          if (queryResult.processing_time) {
            botResponse += `\n\n⏱️ *Processed in ${queryResult.processing_time.toFixed(2)}s*`;
          }
        }
        
        botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: botResponse,
          time: new Date().toLocaleTimeString(),
          sources: queryResult.sources || [],
          processing_time: queryResult.processing_time,
          query: queryResult.query
        };
      } else {
        // Use the error message from the API or fallback
        botResponse = queryResult.answer || "I don't have specific information about that in your uploaded documents. Please upload your medical reports first, or consult with your healthcare provider.";
        
        botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: botResponse,
          time: new Date().toLocaleTimeString(),
          error: queryResult.error
        };
      }

      setChatMessages(prev => [...prev, botMessage]);
      
      // Auto-scroll to bottom after message is added
      setTimeout(() => {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: "I'm sorry, I encountered an error while processing your question. Please try again.",
        time: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
      
      // Auto-scroll to bottom after error message is added
      setTimeout(() => {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    "What do my latest blood test results mean?",
    "Are there any concerning values in my reports?",
    "What should I do about my blood pressure?",
    "Can you explain my X-ray results?"
  ];

  const quickActions = [
    { id: 1, name: 'Upload New Report', icon: FaCloudUploadAlt, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200', action: handleUploadReport },
    { id: 2, name: 'Schedule Appointment', icon: FaCalendarAlt, color: 'bg-green-100 text-green-700 hover:bg-green-200', action: () => setIsModalOpen(true) },
    { id: 3, name: 'View All Reports', icon: FaEye, color: 'bg-purple-100 text-purple-700 hover:bg-purple-200', action: () => setActiveSection('reports') },
    { id: 4, name: 'Health Analytics', icon: FaChartLine, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200', action: () => setActiveSection('analytics') }
  ];

  const recentActivity = [
    { id: 1, type: 'upload', message: 'Blood test results uploaded', time: '2 hours ago', icon: FaCloudUploadAlt },
    { id: 2, type: 'appointment', message: 'Appointment with Dr. Smith confirmed', time: '1 day ago', icon: FaCalendarAlt },
    { id: 3, type: 'report', message: 'X-ray analysis completed', time: '3 days ago', icon: FaFileMedical }
  ];

  const notifications = [
    { id: 1, message: 'Your appointment reminder for tomorrow', type: 'reminder', time: '1 hour ago' },
    { id: 2, message: 'New lab results available', type: 'report', time: '3 hours ago' },
    { id: 3, message: 'Dr. Smith sent you a message', type: 'message', time: '5 hours ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex">
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
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col h-screen fixed">
        <div className="mb-8 p-2">
          <img
            src="/logo1.jpg"
            alt="MedClerk Logo"
            className="h-16 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
            title="Go to Dashboard"
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {[
            { id: 'overview', name: 'Overview', icon: FaHome },
            { id: 'uploads', name: 'Uploads', icon: FaCloudUploadAlt, badge: uploadedFiles.length },
            { id: 'appointments', name: 'Appointments', icon: FaCalendarAlt, badge: appointments.length },
            { id: 'doctors', name: 'Doctors', icon: FaUserMd },
            { id: 'reports', name: 'Reports', icon: FaFileMedical, badge: uploadedFiles.length }
          ].map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${isActive
                    ? 'bg-primary-500 text-white'
                    : 'hover:bg-blue-50 dark:hover:bg-gray-700'
                  }`}
                onClick={() => setActiveSection(item.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl transition-all duration-300 transform hover:scale-110 ${isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-600 dark:to-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    } flex items-center justify-center`}>
                    <Icon className={`transition-all duration-300 ${isActive ? 'text-lg' : 'text-base hover:text-lg'}`} />
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full transition-all ${isActive
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
        <button
          className="mt-auto flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Profile Button & Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <FaUser className="text-white text-lg" />
                  </div>
                  <span className="text-sm font-medium hidden md:block">{user?.name}</span>
                </button>

                {showProfile && (
                  <div className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[600px] overflow-y-auto">
                    {loadingPatientDetails ? (
                      <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Loading profile...</p>
                      </div>
                    ) : (
                      <>
                        {/* Personal Info Section */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-3 mb-4">
                            {patientDetails?.personalInfo?.avatarUrl ? (
                              <img 
                                src={patientDetails.personalInfo.avatarUrl} 
                                alt={patientDetails.personalInfo.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <FaUser className="text-white text-xl" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800 dark:text-gray-200">
                                {patientDetails?.personalInfo?.name || user?.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {patientDetails?.personalInfo?.email || user?.email}
                              </div>
                              {patientDetails?.personalInfo?.phoneNumber && (
                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                                  <FaPhone className="text-xs" />
                                  {patientDetails.personalInfo.countryCode} {patientDetails.personalInfo.phoneNumber}
                                </div>
                              )}
                            </div>
                          </div>
                          {patientDetails?.personalInfo?.state && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <FaMapMarkerAlt />
                              {patientDetails.personalInfo.state}, {patientDetails.personalInfo.country}
                            </div>
                          )}
                        </div>

                        {/* Medical Info Section */}
                        {patientDetails?.medicalInfo && (
                          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                              <FaHeartbeat className="text-red-500" />
                              Medical Information
                            </h3>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              {patientDetails.medicalInfo.bloodType && (
                                <div>
                                  <div className="text-gray-500 dark:text-gray-400">Blood Type</div>
                                  <div className="font-medium text-gray-800 dark:text-gray-200">
                                    {patientDetails.medicalInfo.bloodType.replace('_', '+')}
                                  </div>
                                </div>
                              )}
                              {patientDetails.medicalInfo.height && (
                                <div>
                                  <div className="text-gray-500 dark:text-gray-400">Height</div>
                                  <div className="font-medium text-gray-800 dark:text-gray-200">
                                    {patientDetails.medicalInfo.height} cm
                                  </div>
                                </div>
                              )}
                              {patientDetails.medicalInfo.weight && (
                                <div>
                                  <div className="text-gray-500 dark:text-gray-400">Weight</div>
                                  <div className="font-medium text-gray-800 dark:text-gray-200">
                                    {patientDetails.medicalInfo.weight} kg
                                  </div>
                                </div>
                              )}
                              {patientDetails.medicalInfo.gender && (
                                <div>
                                  <div className="text-gray-500 dark:text-gray-400">Gender</div>
                                  <div className="font-medium text-gray-800 dark:text-gray-200">
                                    {patientDetails.medicalInfo.gender}
                                  </div>
                                </div>
                              )}
                            </div>
                            {patientDetails.medicalInfo.allergies?.length > 0 && (
                              <div className="mt-3">
                                <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Allergies</div>
                                <div className="flex flex-wrap gap-1">
                                  {patientDetails.medicalInfo.allergies.map((allergy, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs">
                                      {allergy}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {patientDetails.medicalInfo.medications?.length > 0 && (
                              <div className="mt-3">
                                <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Medications</div>
                                <div className="flex flex-wrap gap-1">
                                  {patientDetails.medicalInfo.medications.map((med, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
                                      {med}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Care Team Section */}
                        {patientDetails?.careTeam && patientDetails.careTeam.doctors?.length > 0 && (
                          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                              <FaStethoscope className="text-blue-500" />
                              Care Team ({patientDetails.careTeam.total})
                            </h3>
                            <div className="space-y-2">
                              {patientDetails.careTeam.doctors.slice(0, 3).map((doctor) => (
                                <div key={doctor.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                  <FaUserMd className="text-blue-500" />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                                      {doctor.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                      {doctor.specialization}
                                    </div>
                                  </div>
                                  {doctor.status === 'ACTIVE' && (
                                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs">
                                      Active
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="p-2">
                          <button
                            onClick={() => {
                              setShowProfile(false);
                              setShowProfileModal(true);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
                          >
                            <FaUser className="text-gray-500" />
                            View Full Profile
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2 mt-1"
                          >
                            <FaSignOutAlt className="text-red-500" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Notifications Button */}
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


            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {activeSection === 'overview' && (
              <>
                {/* Welcome section */}
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 mb-8 shadow-sm relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full translate-y-24 -translate-x-24"></div>

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
                          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
                        </h1>
                        <span className="text-3xl">👋</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-base mb-6">Manage your medical reports and health information</p>

                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Last visit:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Dec 15, 2024</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Health Score:</span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">85/100</span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:block">
                      <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <FaUser className="text-4xl text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'TOTAL REPORTS', value: '4', icon: FaFileMedical, iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400', change: '+5 this week', changeColor: 'text-blue-600', arrow: '↗' },
                    { label: 'THIS MONTH', value: '0', icon: FaCalendarAlt, iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400', change: '+3 from last month', changeColor: 'text-green-600', arrow: '↗' },
                    { label: 'AI ANSWERS', value: '3', icon: FaChartLine, iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400', change: '94% accuracy', changeColor: 'text-purple-600', arrow: '↗' },
                    { label: 'ALERTS', value: '1', icon: FaBell, iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400', change: 'Requires attention', changeColor: 'text-red-600', arrow: '⚠' }
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                            <Icon className={`${stat.iconColor} text-lg`} />

                          </div>
                          <div className="flex-1">
                            <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">{stat.label}</div>
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">{stat.value}</div>
                        <div className={`text-xs font-medium ${stat.changeColor} flex items-center gap-1`}>
                          <span className="text-sm">{stat.arrow}</span>
                          {stat.change}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* AI Chat Interface */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
                  <div className="max-w-4xl mx-auto">
                    {/* Chat Header */}
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        Hi there, <span className="text-purple-600 dark:text-purple-400">{user?.name?.split(' ')[0] || 'Patient'}</span>
                      </h2>
                      <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                        What would <span className="text-blue-600 dark:text-blue-400">like to know?</span>
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use one of the most common prompts below or use your own to begin
                      </p>
                    </div>

                    {/* Quick Prompt Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      {[
                        {
                          title: "Analyze my latest lab report",
                          subtitle: "Get insights from recent tests",
                          icon: "📊"
                        },
                        {
                          title: "Explain my prescription details",
                          subtitle: "Understand medication info",
                          icon: "💊"
                        },
                        {
                          title: "Summarize my medical history",
                          subtitle: "Get a comprehensive overview",
                          icon: "📋"
                        },
                        {
                          title: "What should I discuss with my doctor?",
                          subtitle: "Prepare for your next visit",
                          icon: "👩‍⚕️"
                        }
                      ].map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setChatInput(prompt.title);
                            // Simulate form submission
                            const fakeEvent = { preventDefault: () => {} };
                            handleSendMessage(fakeEvent);
                          }}
                          className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-left group"
                        >
                          <div className="text-2xl mb-2">{prompt.icon}</div>
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {prompt.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {prompt.subtitle}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Refresh Prompts Button */}
                    <div className="text-center mb-6">
                      <button className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh Prompts
                      </button>
                    </div>

                    {/* Chat Input */}
                    <div className="relative max-w-3xl mx-auto">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm">
                        {/* Attachment Button */}
                        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </button>

                        {/* Input Field */}
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const fakeEvent = { preventDefault: () => {} };
                              handleSendMessage(fakeEvent);
                            }
                          }}
                          placeholder="Ask whatever you want..."
                          className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                        />

                        {/* Character Count */}
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {chatInput.length}/500
                        </div>

                        {/* Send Button */}
                        <button
                          onClick={() => {
                            const fakeEvent = { preventDefault: () => {} };
                            handleSendMessage(fakeEvent);
                          }}
                          disabled={!chatInput.trim() || isTyping}
                          className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>

                      {/* AI Web Badge */}
                      <div className="absolute -top-3 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400">
                        🤖 AI Web
                      </div>
                    </div>

                    {/* Chat Messages Display */}
                    {chatMessages.length > 1 && (
                      <div className="mt-8 space-y-4 max-h-96 overflow-y-auto px-4" id="chat-messages">
                        {chatMessages.slice(1).map((message, idx) => (
                          <div key={idx} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                              message.type === 'user' 
                                ? 'bg-purple-600 text-white rounded-br-md' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
                            }`}>
                              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {message.message}
                              </div>
                              <div className="text-xs opacity-70 mt-2 flex items-center justify-between">
                                <span>{message.time}</span>
                                {message.processing_time && (
                                  <span className="text-xs opacity-60">
                                    {message.processing_time.toFixed(1)}s
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Appointment Modal */}
                {isModalOpen && (
                  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm grid place-items-center p-4 z-50">
                    <div className="bg-white border border-gray-100 rounded-xl p-5 w-full max-w-md shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-lg font-semibold text-gray-800">Book an appointment</div>
                        <button className="btn btn-link" onClick={() => setIsModalOpen(false)}>Close</button>
                      </div>
                      <form onSubmit={saveAppointment} className="grid gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input type="date" className="form-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                          <input type="time" className="form-input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                          <select className="form-input" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} required>
                            <option value="" disabled>Select doctor</option>
                            {doctors.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Room (optional)</label>
                          <input type="text" placeholder="e.g., 302B" className="form-input" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
                        </div>
                        <button type="submit" className="btn btn-primary w-full">{editingId ? 'Update appointment' : 'Save appointment'}</button>
                      </form>
                    </div>
                  </div>
                )}

                {/* Close overview fragment and block */}
              </>
            )}

            {/* Doctors Section - simple rows */}
            {activeSection === 'doctors' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Recommended Doctors</h2>
                  <div className="flex gap-3">
                    <input
                      className="form-input w-64"
                      placeholder="Search doctor by name"
                      onChange={(e) => {
                        const q = e.target.value.toLowerCase();
                        const box = document.getElementById('doctor-list-simple');
                        if (!box) return;
                        box.querySelectorAll('[data-name]')?.forEach((el) => {
                          const name = (el.getAttribute('data-name') || '').toLowerCase();
                          el.style.display = name.includes(q) ? '' : 'none';
                        });
                      }}
                    />
                    <select
                      className="form-input"
                      onChange={(e) => {
                        const v = e.target.value;
                        const box = document.getElementById('doctor-list-simple');
                        if (!box) return;
                        box.querySelectorAll('[data-specialty]')?.forEach((el) => {
                          const sp = el.getAttribute('data-specialty') || '';
                          el.style.display = v === 'all' ? '' : sp === v ? '' : 'none';
                        });
                      }}
                    >
                      <option value="all">All Specialties</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
                  <div id="doctor-list-simple" className="divide-y divide-gray-100 dark:divide-gray-700">
                    {[
                      { name: 'Dr. John Smith', specialty: 'Cardiology', rating: 4.8, patients: 1200, experience: 12, clinic: 'City Heart Center', conditions: ['Heart Disease', 'Hypertension', 'Arrhythmia'], availability: 'Mon-Fri: 9AM-5PM', bio: 'Specialist in cardiovascular diseases with expertise in preventive cardiology and heart disease management.', education: 'MD from Johns Hopkins University', languages: ['English'], fee: 180 },
                      { name: 'Dr. Emily Clark', specialty: 'Dermatology', rating: 4.6, patients: 980, experience: 8, clinic: 'SkinCare Clinic', conditions: ['Acne', 'Eczema', 'Psoriasis'], availability: 'Tue-Sat: 10AM-6PM', bio: 'Experienced dermatologist focusing on medical and cosmetic dermatology.', education: 'MD from Stanford University', languages: ['English'], fee: 150 },
                      { name: 'Dr. Richard Lee', specialty: 'Neurology', rating: 4.9, patients: 1430, experience: 15, clinic: 'Neuro Wellness', conditions: ['Migraine', 'Epilepsy', 'Parkinson’s'], availability: 'Mon-Thu: 9AM-4PM', bio: 'Neurologist with extensive experience in movement disorders and headache management.', education: 'MD from UCSF', languages: ['English', 'Mandarin'], fee: 220 },
                      { name: 'Dr. Priya Sharma', specialty: 'Pediatrics', rating: 4.7, patients: 1103, experience: 10, clinic: 'Kids Health Hub', conditions: ['Common cold', 'Asthma', 'Allergies'], availability: 'Mon-Sat: 10AM-7PM', bio: 'Pediatrician passionate about child wellness and preventive care.', education: 'MBBS, MD Pediatrics (AIIMS)', languages: ['English', 'Hindi'], fee: 120 },
                      { name: 'Dr. Arjun Mehta', specialty: 'General', rating: 4.5, patients: 870, experience: 7, clinic: 'Family Care Clinic', conditions: ['General Medicine', 'Diabetes', 'Hypertension'], availability: 'Mon-Fri: 11AM-8PM', bio: 'General physician providing comprehensive primary care for families.', education: 'MBBS, DNB (Family Medicine)', languages: ['English', 'Hindi'], fee: 100 },
                      { name: 'Dr. Sara Khan', specialty: 'Cardiology', rating: 4.8, patients: 1310, experience: 11, clinic: 'CardioLife', conditions: ['Heart Disease', 'High Cholesterol', 'Hypertension'], availability: 'Mon-Fri: 9AM-5PM', bio: 'Cardiologist focused on preventive cardiology and heart disease management.', education: 'MD from Harvard Medical School', languages: ['English', 'Spanish'], fee: 200 }
                    ].map((d, i) => (
                      <div key={i} data-name={d.name} data-specialty={d.specialty} className="">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white grid place-items-center text-xl">
                              <FaUserMd />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800 dark:text-gray-100">{d.name}</div>
                              <div className="text-sm text-gray-500">{d.specialty}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                            <span>⭐ {d.rating}</span>
                            <span>{d.patients.toLocaleString()} patients</span>
                            <button
                              className="btn btn-primary"
                              onClick={() => setExpandedDoctor(expandedDoctor === i ? null : i)}
                            >
                              {expandedDoctor === i ? 'Hide' : 'View'}
                            </button>
                          </div>
                        </div>
                        {expandedDoctor === i && (
                          <div className="px-4 pb-4">
                            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-rose-50/60 dark:bg-gray-800 p-5">
                              {/* Header */}
                              <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white grid place-items-center text-3xl">👩‍⚕️</div>
                                <div className="flex-1">
                                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{d.name}</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">{d.specialty}</div>
                                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mt-1">
                                    <FaStar className="text-yellow-500" />
                                    <span>{d.rating}</span>
                                    <span className="text-gray-400">•</span>
                                    <span>({d.experience} years)</span>
                                  </div>
                                </div>
                              </div>

                              {/* Quick facts */}
                              <div className="mt-4 space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                  <FaMapMarkerAlt className="text-gray-500" />
                                  <span>{d.clinic}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                  <FaStethoscope className="text-gray-500" />
                                  <span>{d.conditions.join(', ')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                  <FaClock className="text-gray-500" />
                                  <span>{d.availability}</span>
                                </div>
                              </div>

                              {/* Bio */}
                              <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 leading-6">{d.bio}</p>

                              {/* Info card 2x2 */}
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
                                  <div className="text-xs text-gray-500">Education:</div>
                                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{d.education}</div>
                                </div>
                                <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
                                  <div className="text-xs text-gray-500">Languages:</div>
                                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{d.languages.join(', ')}</div>
                                </div>
                                <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
                                  <div className="text-xs text-gray-500">Consultation:</div>
                                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">${'{'}d.fee{'}'}</div>
                                </div>
                                <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
                                  <div className="text-xs text-gray-500">Experience:</div>
                                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{d.experience} years</div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="mt-5 flex flex-wrap items-center gap-3">
                                <button className="btn btn-primary" onClick={() => setActiveSection('appointments')}>
                                  Book Appointment
                                </button>
                                <button className="btn btn-secondary" onClick={() => alert('Messaging coming soon')}>
                                  Message
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Uploads Section */}
            {activeSection === 'uploads' && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Upload Reports</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Upload and manage your medical reports</p>
                  </div>
                  <button
                    onClick={handleUploadReport}
                    disabled={isUploading}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="spinner"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaCloudUploadAlt />
                        Upload New Report
                      </>
                    )}
                  </button>
                </div>

                {/* Upload Area */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaCloudUploadAlt className="text-4xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Upload Your Medical Reports</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                      Drag and drop your medical files here, or click the button above to browse and select files.
                      Supported formats: PDF, JPG, PNG, DOC, DOCX
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Secure & Private
                      </span>
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        AI Analysis
                      </span>
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Easy Organization
                      </span>
                    </div>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Uploaded Reports ({uploadedFiles.length})</h3>
                    <div className="space-y-4">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                              {file.type?.includes('pdf') ? (
                                <FaFilePdf className="text-red-600 dark:text-red-400 text-xl" />
                              ) : file.type?.includes('image') ? (
                                <FaFileImage className="text-green-600 dark:text-green-400 text-xl" />
                              ) : (
                                <FaFileMedical className="text-blue-600 dark:text-blue-400 text-xl" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200">{file.name}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                <span>•</span>
                                <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                                <span>•</span>
                                <span className="capitalize">{file.documentType?.replace('_', ' ').toLowerCase()}</span>
                              </div>
                              
                              {/* Status indicators */}
                              <div className="flex items-center gap-2 mt-2">
                                {file.processing && (
                                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium flex items-center gap-1">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                    {file.uploadProgress ? `${file.uploadProgress.stage} (${file.uploadProgress.percent}%)` : 'Processing...'}
                                  </span>
                                )}
                                
                                {file.processed && !file.uploadError && (
                                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                                    ✓ Uploaded
                                  </span>
                                )}
                                
                                {file.ocrProcessing && (
                                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                                    🤖 OCR Processing
                                  </span>
                                )}
                                
                                {file.uploadError && (
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                                      ❌ {file.errorType || 'Upload Failed'}
                                    </span>
                                    {file.canRetry && (
                                      <button
                                        onClick={() => retryUpload(file.id)}
                                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                                        title={`Retry upload: ${file.error}`}
                                      >
                                        🔄 Retry
                                      </button>
                                    )}
                                  </div>
                                )}
                                
                                {/* Error details tooltip */}
                                {file.uploadError && file.error && (
                                  <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                    {file.error}
                                  </div>
                                )}
                                
                                {file.fromBackend && (
                                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 rounded-full text-xs font-medium">
                                    📁 From Server
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={async () => {
                                if (file.s3Key) {
                                  // Get presigned URL for download
                                  const url = await getFileUrl(file.s3Key);
                                  if (url) {
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = file.name;
                                    link.click();
                                  } else {
                                    alert('Failed to get download URL');
                                  }
                                } else {
                                  alert('File not available for download');
                                }
                              }}
                              disabled={!file.s3Key || file.processing}
                              className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Download"
                            >
                              <FaDownload />
                            </button>
                            
                            <button
                              onClick={async () => {
                                if (file.s3Key) {
                                  // Get presigned URL for viewing
                                  const url = await getFileUrl(file.s3Key);
                                  if (url) {
                                    window.open(url, '_blank');
                                  } else {
                                    alert('Failed to get file URL');
                                  }
                                } else {
                                  alert('File not available for viewing');
                                }
                              }}
                              disabled={!file.s3Key || file.processing}
                              className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="View"
                            >
                              <FaEye />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              disabled={file.processing}
                              className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {uploadedFiles.length === 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaFileMedical className="text-2xl text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Reports Uploaded Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Upload your first medical report to get started with AI analysis</p>
                    <button
                      onClick={handleUploadReport}
                      className="btn btn-primary"
                    >
                      <FaCloudUploadAlt />
                      Upload Your First Report
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Appointments Section */}
            {activeSection === 'appointments' && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-3xl p-8 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <FaCalendarAlt className="text-white text-xl" />
                        </div>
                        Appointments
                      </h2>
                      <p className="text-gray-600 text-lg">Manage your medical appointments and schedules</p>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full flex items-center justify-center">
                        <span className="text-4xl">📅</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Calendar */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">Calendar</h3>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
                            onClick={goPrevMonth}
                          >
                            <FaChevronLeft className="text-gray-600" />
                          </button>
                          <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-bold text-lg">
                            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                          </div>
                          <button
                            className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
                            onClick={goNextMonth}
                          >
                            <FaChevronRight className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-2 text-center mb-4">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                          <div key={d} className="text-sm font-bold text-gray-500 py-3">{d.slice(0, 3)}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2 text-center">
                        {monthDays.map((d) => (
                          <div
                            key={d}
                            className={`py-4 rounded-xl text-sm font-medium cursor-pointer transition-all ${appointmentDays.has(d)
                                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg transform scale-105'
                                : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm hover:scale-105'
                              }`}
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Appointments List */}
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Upcoming</h3>
                        <button
                          className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 transition-colors"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {appointments.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <FaCalendarAlt className="text-3xl mb-3 mx-auto opacity-50" />
                            <p>No appointments scheduled</p>
                            <button
                              className="mt-3 text-green-600 hover:text-green-700 font-medium"
                              onClick={() => setIsModalOpen(true)}
                            >
                              Schedule your first appointment
                            </button>
                          </div>
                        ) : (
                          appointments.map((a) => (
                            <div key={a.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-all group">
                              <div className="flex items-center justify-between mb-3">
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${a.status === 'Confirmed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                  {a.status}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    className="p-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-xs px-2"
                                    onClick={() => onEdit(a)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="p-1 rounded-lg bg-red-500 text-white hover:bg-red-600 text-xs px-2"
                                    onClick={() => onCancel(a.id)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                              <div className="text-gray-800 font-bold text-lg">{a.doctor}</div>
                              <div className="text-gray-600 font-medium">{a.date} at {a.time}</div>
                              <div className="text-gray-500 text-sm">Room {a.room}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <FaPlus />
                          New Appointment
                        </button>
                        <button
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                          onClick={handleUploadReport}
                        >
                          <FaCloudUploadAlt />
                          Upload Report
                        </button>
                        <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                          <FaBell />
                          Reminders
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Section */}
            {activeSection === 'reports' && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <FaFileMedical className="text-blue-600 text-2xl" />
                        My Reports
                      </h2>
                      <p className="text-gray-600">Manage and view your medical reports</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleUploadReport}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <FaCloudUploadAlt />
                        Upload Report
                      </button>
                    </div>
                  </div>
                </div>

                {/* Health Vitals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Blood Pressure Card */}
                  <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-gray-500 text-sm font-medium">Blood Pressure</h3>
                        <p className="text-2xl font-bold text-gray-800">120/80</p>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Normal
                        </p>
                      </div>
                      <div className="bg-red-100 p-2 rounded-lg">
                        <FaHeart className="text-red-500 text-xl" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Last checked: Today</div>
                  </div>

                  {/* Heart Rate Card */}
                  <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-gray-500 text-sm font-medium">Heart Rate</h3>
                        <p className="text-2xl font-bold text-gray-800">72 <span className="text-sm text-gray-500">bpm</span></p>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Normal
                        </p>
                      </div>
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FaHeartbeat className="text-blue-500 text-xl" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Last checked: 2h ago</div>
                  </div>

                  {/* Blood Oxygen Card */}
                  <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-gray-500 text-sm font-medium">Blood Oxygen</h3>
                        <p className="text-2xl font-bold text-gray-800">98 <span className="text-sm text-gray-500">%</span></p>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Normal
                        </p>
                      </div>
                      <div className="bg-green-100 p-2 rounded-lg">
                        <FaTint className="text-green-500 text-xl" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Last checked: 2h ago</div>
                  </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Recent Reports</h3>
                    <button className="text-blue-600 text-sm font-medium">View All</button>
                  </div>

                  <div className="space-y-4">
                    {/* Report Item 1 */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <FaFilePdf className="text-blue-600 text-xl" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Blood Test Results</h4>
                          <p className="text-sm text-gray-500">12 Sep 2023 • 2.4 MB</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 p-2">
                        <FaEye />
                      </button>
                    </div>

                    {/* Report Item 2 */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <FaFileAlt className="text-green-600 text-xl" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">X-Ray Report</h4>
                          <p className="text-sm text-gray-500">05 Sep 2023 • 1.2 MB</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 p-2">
                        <FaEye />
                      </button>
                    </div>

                    {/* Report Item 3 */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <FaFileMedical className="text-purple-600 text-xl" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Doctor's Prescription</h4>
                          <p className="text-sm text-gray-500">28 Aug 2023 • 0.5 MB</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 p-2">
                        <FaEye />
                      </button>
                    </div>
                  </div>
                </div>

                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaFileMedical className="text-2xl text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">No reports available</h4>
                    <p>Upload your medical reports to see AI analysis and insights</p>
                    <button
                      onClick={() => {
                        handleUploadReport();
                        setActiveSection('uploads');
                      }}
                      className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-xl hover:bg-purple-600 transition-colors"
                    >
                      Upload Reports
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                              <span className="text-2xl">
                                {file.type.includes('pdf') ? '📄' :
                                  file.type.includes('image') ? '🖼️' :
                                    file.type.includes('doc') ? '📝' : '📋'}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-800">{file.name}</h4>
                              <p className="text-gray-500 text-sm">
                                Uploaded on {new Date(file.uploadDate).toLocaleDateString()} • {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  Analyzed
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  Normal Range
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">
                              <FaEye />
                            </button>
                            <button className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                              <FaRobot />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = file.data;
                                link.download = file.name;
                                link.click();
                              }}
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">AI Analysis Summary</h5>
                          <p className="text-gray-600 text-sm mb-3">
                            Blood glucose: 95 mg/dL (Normal) • Cholesterol: 180 mg/dL (Good) • Blood pressure: 125/82 mmHg (Slightly elevated)
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-green-600">✓ 8 values normal</span>
                            <span className="text-yellow-600">⚠ 1 value elevated</span>
                            <span className="text-gray-600">📈 Trend: Improving</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm grid place-items-center p-4 z-50">
            <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800">Profile Details</h3>
                <div className="flex items-center gap-3">
                  {!isEditingProfile && !loadingPatientDetails && (
                    <button
                      onClick={handleEditProfile}
                      className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                  <button
                    className="text-gray-400 hover:text-gray-600 p-2"
                    onClick={() => {
                      setShowProfileModal(false);
                      setIsEditingProfile(false);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-grow">
                {loadingPatientDetails ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading profile details...</p>
                    <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your information</p>
                  </div>
                ) : (
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Full Name</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">{patientDetails?.personalInfo?.name || user?.name || 'Not set'}</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Email</label>
                        {isEditingProfile ? (
                          <input
                            type="email"
                            value={editFormData.email}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">{patientDetails?.personalInfo?.email || user?.email || 'Not set'}</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Phone</label>
                        {isEditingProfile ? (
                          <input
                            type="tel"
                            value={editFormData.phone}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">{formatPhoneNumber() || user?.phone || 'Not set'}</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Date of Birth</label>
                        {isEditingProfile ? (
                          <input
                            type="date"
                            value={editFormData.dob}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, dob: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">
                              {patientDetails?.medicalInfo?.dateOfBirth 
                                ? new Date(patientDetails.medicalInfo.dateOfBirth).toLocaleDateString() 
                                : user?.dob || 'Not set'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Medical Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Blood Group</label>
                        {isEditingProfile ? (
                          <select
                            value={editFormData.bloodGroup}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                          >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">
                              {patientDetails?.medicalInfo?.bloodGroup || formatBloodType(patientDetails?.medicalInfo?.bloodType) || user?.patientProfile?.bloodGroup || 'Not set'}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Height (cm)</label>
                        {isEditingProfile ? (
                          <input
                            type="number"
                            value={editFormData.heightCm}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, heightCm: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                            placeholder="Enter height in cm"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">
                              {patientDetails?.medicalInfo?.heightCm 
                                ? `${patientDetails.medicalInfo.heightCm} cm` 
                                : patientDetails?.medicalInfo?.height 
                                  ? `${patientDetails.medicalInfo.height} cm` 
                                  : user?.patientProfile?.heightCm 
                                    ? `${user.patientProfile.heightCm} cm` 
                                    : 'Not set'}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Weight (kg)</label>
                        {isEditingProfile ? (
                          <input
                            type="number"
                            value={editFormData.weightKg}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, weightKg: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                            placeholder="Enter weight in kg"
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">
                              {patientDetails?.medicalInfo?.weightKg 
                                ? `${patientDetails.medicalInfo.weightKg} kg` 
                                : patientDetails?.medicalInfo?.weight 
                                  ? `${patientDetails.medicalInfo.weight} kg` 
                                  : user?.patientProfile?.weightKg 
                                    ? `${user.patientProfile.weightKg} kg` 
                                    : 'Not set'}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Gender</label>
                        {isEditingProfile ? (
                          <select
                            value={editFormData.gender}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, gender: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                          >
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">
                              {patientDetails?.medicalInfo?.gender || user?.patientProfile?.gender || 'Not set'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Medical Information */}
                    {(() => {
                      // Use patientDetails if available, otherwise fall back to user data
                      const allergies = patientDetails?.medicalInfo?.allergies || user?.patientProfile?.allergies;
                      const medications = patientDetails?.medicalInfo?.medications || [];
                      const medicalConditions = patientDetails?.medicalInfo?.chronicConditions || patientDetails?.medicalInfo?.medicalConditions || user?.patientProfile?.chronicConditions;

                      // Handle both array and string formats
                      const allergiesList = Array.isArray(allergies) ? allergies :
                        (typeof allergies === 'string' && allergies.trim()) ? [allergies] : [];
                      const medicationsList = Array.isArray(medications) ? medications : [];
                      const conditionsList = Array.isArray(medicalConditions) ? medicalConditions :
                        (typeof medicalConditions === 'string' && medicalConditions.trim()) ? [medicalConditions] : [];

                      return (allergiesList.length > 0 || medicationsList.length > 0 || conditionsList.length > 0) && (
                        <div className="mt-6 space-y-4">
                          {allergiesList.length > 0 && (
                            <div>
                              <h5 className="text-md font-semibold text-gray-700 mb-2">Allergies</h5>
                              <div className="flex flex-wrap gap-2">
                                {allergiesList.map((allergy, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                    {allergy}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {medicationsList.length > 0 && (
                            <div>
                              <h5 className="text-md font-semibold text-gray-700 mb-2">Medications</h5>
                              <div className="flex flex-wrap gap-2">
                                {medicationsList.map((medication, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    {medication}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {conditionsList.length > 0 && (
                            <div>
                              <h5 className="text-md font-semibold text-gray-700 mb-2">Medical Conditions</h5>
                              <div className="flex flex-wrap gap-2">
                                {conditionsList.map((condition, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {condition}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Emergency Contact */}
                    {(patientDetails?.medicalInfo?.emergencyContact || user?.patientProfile?.emergencyContact) && (
                      <div className="mt-6">
                        <h5 className="text-md font-semibold text-gray-700 mb-2">Emergency Contact</h5>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-500">Name</div>
                              <div className="font-medium text-gray-900">
                                {patientDetails?.medicalInfo?.emergencyContact?.name || user?.patientProfile?.emergencyContact?.name || 'Not set'}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Phone</div>
                              <div className="font-medium text-gray-900">
                                {patientDetails?.medicalInfo?.emergencyContact?.phone || user?.patientProfile?.emergencyContact?.phone || 'Not set'}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Email</div>
                              <div className="font-medium text-gray-900">
                                {patientDetails?.medicalInfo?.emergencyContact?.email || user?.patientProfile?.emergencyContact?.email || 'Not set'}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Relationship</div>
                              <div className="font-medium text-gray-900">
                                {patientDetails?.medicalInfo?.emergencyContact?.relationship || user?.patientProfile?.emergencyContact?.relationship || 'Not set'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* Edit Mode Buttons */}
                {isEditingProfile && !loadingPatientDetails && (
                  <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer - single instance */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm bg-gray-50 px-4 py-2 rounded-full inline-block">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
