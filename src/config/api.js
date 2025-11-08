/**
 * API Configuration for MedClerk Frontend
 */


// Backend API base URL
export const API_BASE_URL = 'https://medclerk-backend.vercel.app/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh-token`,
    ME: `${API_BASE_URL}/auth/me`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`
  },
  
  // Upload
  UPLOAD: {
    MEDICAL_RECORDS: `${API_BASE_URL}/upload/medical-records`,
    CONFIRM: `${API_BASE_URL}/upload/confirm`,
    DOCUMENTS: `${API_BASE_URL}/upload/documents`,
    FILE_URL: `${API_BASE_URL}/upload/file-url-endpoint`,
    PRESIGNED_URL: `${API_BASE_URL}/upload/presigned-url`
  },
  
  // AI Services (OCR-RAG)
  AI: {
    IMAGE_OCR: 'https://medclerk-ai.onrender.com/ocr-rag/image-url',
    PDF_OCR: 'https://medclerk-ai.onrender.com/ocr-rag/pdf-url'
  },
  
  // User
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/user/profile`
  },
  
  // Patient Document Query (RAG)
  PATIENT: {
    QUERY_DOCUMENTS: `${API_BASE_URL}/patient/documents/query`,
    DETAILS: `${API_BASE_URL}/patient/details`
  }
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// Token storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'user'
};

/**
 * Get authorization headers for API requests
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  
  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refreshToken: refreshTokenValue
      })
    });

    if (!response.ok) {
      // If refresh token is invalid, clear all auth data
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      throw new Error('Refresh token expired or invalid');
    }

    const data = await response.json();
    
    // Store new tokens
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.data.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.data.refreshToken);
    
    console.log('🔄 Token refreshed successfully');
    return data.data.accessToken;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    // Clear all auth data on refresh failure
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    throw error;
  }
};

/**
 * Base fetch wrapper with error handling and automatic token refresh
 */
export const apiFetch = async (url, options = {}) => {
  const makeRequest = async (useRefreshToken = false) => {
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      }
    };

    const response = await fetch(url, config);
    
    // If 401 and we haven't tried refreshing yet, attempt token refresh
    if (response.status === 401 && !useRefreshToken) {
      try {
        await refreshToken();
        // Retry the request with new token
        return makeRequest(true);
      } catch (refreshError) {
        // If refresh fails, throw the original 401 error
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Authentication expired. Please log in again.');
      }
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  };

  try {
    return await makeRequest();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  REQUEST_TIMEOUT,
  STORAGE_KEYS,
  getAuthHeaders,
  refreshToken,
  apiFetch
};
