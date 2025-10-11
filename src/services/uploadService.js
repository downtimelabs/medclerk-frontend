/**
 * Upload Service for MedClerk
 * Implements the three-step upload flow with presigned URLs
 */

import { API_ENDPOINTS, getAuthHeaders, STORAGE_KEYS } from '../config/api';

// Document type enum values
export const DocumentType = {
  LAB_REPORT: 'LAB_REPORT',
  PRESCRIPTION: 'PRESCRIPTION',
  DISCHARGE_SUMMARY: 'DISCHARGE_SUMMARY',
  SCAN_IMAGE: 'SCAN_IMAGE',
  OTHER: 'OTHER'
};

// Allowed content types
export const AllowedContentTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Max file size: 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Validates if a file is allowed to be uploaded
 */
export const validateFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  }

  if (!AllowedContentTypes.includes(file.type)) {
    errors.push(`File type '${file.type}' is not allowed`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Gets the access token from localStorage
 */
const getAccessToken = () => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Step 1: Request presigned URL from backend
 * @param {Object} params - Upload parameters
 * @param {string} params.fileName - Name of the file
 * @param {string} params.contentType - MIME type of the file
 * @param {number} params.size - File size in bytes
 * @returns {Promise<{presignedUrl: string, key: string}>}
 */
export const requestPresignedUrl = async ({ fileName, contentType, size }) => {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    throw new Error('User not authenticated. Please login first.');
  }

  try {
    console.log('Requesting presigned URL:', { fileName, contentType, size });
    
    const response = await fetch(API_ENDPOINTS.UPLOAD.PRESIGNED_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        fileName,
        contentType,
        size
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to get presigned URL:', errorData);
      throw new Error(errorData.message || 'Failed to get presigned URL');
    }

    const result = await response.json();
    console.log('Presigned URL response:', { 
      hasPresignedUrl: !!result.data?.presignedUrl,
      hasKey: !!result.data?.key 
    });
    return result.data; // Returns { presignedUrl, key }
  } catch (error) {
    console.error('Error requesting presigned URL:', error);
    throw error;
  }
};

/**
 * Step 2: Upload file directly to S3 using presigned URL
 * @param {string} presignedUrl - S3 presigned URL
 * @param {File} file - File to upload
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<void>}
 */
export const uploadToS3 = (presignedUrl, file, onProgress) => {
  return new Promise((resolve, reject) => {
    console.log('Starting S3 upload:', {
      url: presignedUrl.substring(0, 100) + '...',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          onProgress(percent);
        }
      });
    }

    xhr.addEventListener('load', () => {
      console.log('S3 Upload response:', {
        status: xhr.status,
        statusText: xhr.statusText
      });

      // S3 can return 200 or 204 for successful uploads
      if (xhr.status === 200 || xhr.status === 204) {
        resolve();
      } else {
        console.error('S3 Upload Error:', {
          status: xhr.status,
          statusText: xhr.statusText,
          response: xhr.responseText
        });
        reject(new Error(`S3 upload failed with status ${xhr.status}: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', (e) => {
      console.error('Network error during S3 upload:', e);
      reject(new Error('Network error during S3 upload. Please check your internet connection.'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    // Simple PUT request with file as binary data - no extra headers needed
    // The presigned URL already contains all necessary parameters
    xhr.open('PUT', presignedUrl);
    xhr.send(file);
  });
};

/**
 * Alternative S3 upload using fetch (no progress tracking)
 * Use this if XHR method fails
 */
export const uploadToS3Fetch = async (presignedUrl, file) => {
  console.log('Using fetch for S3 upload (fallback method)');
  
  try {
    // Simple PUT request with file as binary body - no headers needed
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file
    });

    if (!response.ok && response.status !== 204) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('S3 fetch upload failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`S3 upload failed with status ${response.status}: ${errorText}`);
    }

    console.log('S3 upload successful via fetch');
    return true;
  } catch (error) {
    console.error('Fetch upload error:', error);
    throw error;
  }
};

/**
 * Step 3: Confirm upload with backend to store metadata
 * @param {Object} params - Confirmation parameters
 * @param {string} params.key - S3 object key from Step 1
 * @param {string} params.title - Document title
 * @param {string} params.type - Document type (from DocumentType enum)
 * @param {string} params.mimeType - MIME type
 * @param {number} params.fileSize - File size in bytes
 * @returns {Promise<Object>} Document metadata
 */
export const confirmUpload = async ({ key, title, type, mimeType, fileSize }) => {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    throw new Error('User not authenticated. Please login first.');
  }

  try {
    const response = await fetch(API_ENDPOINTS.UPLOAD.CONFIRM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        key,
        title,
        type,
        mimeType,
        fileSize
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to confirm upload');
    }

    const result = await response.json();
    return result.data; // Returns document metadata
  } catch (error) {
    console.error('Error confirming upload:', error);
    throw error;
  }
};

/**
 * Complete upload flow: Request presigned URL -> Upload to S3 -> Confirm
 * @param {File} file - File to upload
 * @param {Object} metadata - File metadata
 * @param {string} metadata.title - Document title
 * @param {string} metadata.type - Document type
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<Object>} Uploaded document metadata
 */
export const uploadFile = async (file, metadata, onProgress) => {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Report progress: Getting presigned URL
    if (onProgress) {
      onProgress({ stage: 'presigned', percent: 5 });
    }

    // Step 1: Get presigned URL
    const { presignedUrl, key } = await requestPresignedUrl({
      fileName: file.name,
      contentType: file.type,
      size: file.size
    });

    if (onProgress) {
      onProgress({ stage: 'presigned', percent: 10 });
    }

    // Step 2: Upload to S3
    try {
      await uploadToS3(presignedUrl, file, (uploadPercent) => {
        if (onProgress) {
          // Map upload progress to 10-80%
          const percent = 10 + (uploadPercent * 0.7);
          onProgress({ stage: 'uploading', percent });
        }
      });
    } catch (xhrError) {
      console.warn('XHR upload failed, trying fetch method:', xhrError);
      
      // Fallback to fetch if XHR fails
      if (onProgress) {
        onProgress({ stage: 'uploading', percent: 40 });
      }
      
      await uploadToS3Fetch(presignedUrl, file);
      
      if (onProgress) {
        onProgress({ stage: 'uploading', percent: 80 });
      }
    }

    if (onProgress) {
      onProgress({ stage: 'confirming', percent: 85 });
    }

    // Step 3: Confirm upload
    const document = await confirmUpload({
      key,
      title: metadata.title || file.name,
      type: metadata.type || DocumentType.OTHER,
      mimeType: file.type,
      fileSize: file.size
    });

    if (onProgress) {
      onProgress({ stage: 'complete', percent: 100 });
    }

    return document;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

/**
 * Upload multiple files
 * @param {File[]} files - Array of files to upload
 * @param {Function} getMetadata - Function to get metadata for each file
 * @param {Function} onFileProgress - Progress callback for individual files
 * @param {Function} onOverallProgress - Progress callback for overall upload
 * @returns {Promise<Object[]>} Array of uploaded documents
 */
export const uploadMultipleFiles = async (
  files,
  getMetadata,
  onFileProgress,
  onOverallProgress
) => {
  const results = [];
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const metadata = getMetadata ? getMetadata(file, i) : {};

    try {
      const document = await uploadFile(file, metadata, (progress) => {
        if (onFileProgress) {
          onFileProgress(i, file, progress);
        }
      });

      results.push({ success: true, document, file });

      if (onOverallProgress) {
        const overallPercent = ((i + 1) / total) * 100;
        onOverallProgress(overallPercent, i + 1, total);
      }
    } catch (error) {
      results.push({ success: false, error: error.message, file });
      
      if (onOverallProgress) {
        const overallPercent = ((i + 1) / total) * 100;
        onOverallProgress(overallPercent, i + 1, total);
      }
    }
  }

  return results;
};

/**
 * Get file download URL
 * @param {string} key - S3 object key
 * @returns {Promise<string>} Presigned download URL
 */
export const getFileUrl = async (key) => {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    throw new Error('User not authenticated. Please login first.');
  }

  try {
    const response = await fetch(`${API_ENDPOINTS.UPLOAD.FILE_URL}?key=${encodeURIComponent(key)}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to get file URL');
    }

    const result = await response.json();
    return result.data.url; // Returns presigned download URL
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

/**
 * Get user's uploaded documents
 * @returns {Promise<Object[]>} Array of documents
 */
export const getUserDocuments = async () => {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    throw new Error('User not authenticated. Please login first.');
  }

  try {
    const response = await fetch(API_ENDPOINTS.UPLOAD.DOCUMENTS, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch documents');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export default {
  uploadFile,
  uploadMultipleFiles,
  validateFile,
  requestPresignedUrl,
  uploadToS3,
  confirmUpload,
  getFileUrl,
  getUserDocuments,
  DocumentType,
  AllowedContentTypes,
  MAX_FILE_SIZE
};
