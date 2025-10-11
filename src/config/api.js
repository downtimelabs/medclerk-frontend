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
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    ME: `${API_BASE_URL}/auth/me`
  },
  
  // Upload
  UPLOAD: {
    PRESIGNED_URL: `${API_BASE_URL}/upload/presigned-url`,
    CONFIRM: `${API_BASE_URL}/upload/confirm`,
    DOCUMENTS: `${API_BASE_URL}/upload/documents`,
    FILE_URL: `${API_BASE_URL}/upload/file-url-endpoint`
  },
  
  // User
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/user/profile`
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
 * Base fetch wrapper with error handling
 */
export const apiFetch = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
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
  apiFetch
};
