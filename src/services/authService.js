import { API_ENDPOINTS, STORAGE_KEYS, apiFetch } from '../config/api';

export const saveTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const register = async (userData) => {
  console.log('📤 Registration request:', {
    endpoint: API_ENDPOINTS.AUTH.REGISTER,
    role: userData.role,
    email: userData.email
  });
  
  const res = await apiFetch(API_ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  
  console.log('📥 Registration response:', res);
  
  const tokens = res?.data?.tokens || res?.tokens || {};
  saveTokens({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
  return res;
};

export const login = async ({ email, password }) => {
  console.log('📤 Login request:', {
    endpoint: API_ENDPOINTS.AUTH.LOGIN,
    email: email
  });
  
  try {
    const res = await apiFetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    console.log('📥 Login response:', res);
    console.log('📥 Full response structure:', JSON.stringify(res, null, 2));
    
    // Try multiple possible token locations
    const tokens = res?.data?.tokens || res?.tokens || res?.data || {};
    console.log('🔑 Extracted tokens:', tokens);
    
    // Check for different token field names
    const accessToken = tokens.accessToken || tokens.access_token || tokens.token;
    const refreshToken = tokens.refreshToken || tokens.refresh_token;
    
    console.log('🔑 Access token found:', !!accessToken);
    console.log('🔑 Refresh token found:', !!refreshToken);
    
    if (accessToken) {
      saveTokens({ accessToken, refreshToken });
      console.log('✅ Tokens saved to localStorage');
    } else {
      console.error('❌ No access token found in response');
      console.error('❌ Available response keys:', Object.keys(res || {}));
      if (res?.data) {
        console.error('❌ Available data keys:', Object.keys(res.data || {}));
      }
    }
    
    return res;
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    throw error;
  }
};

export const me = async () => {
  return await apiFetch(API_ENDPOINTS.AUTH.ME, { method: 'GET' });
};

export const updateProfile = async (profile) => {
  return await apiFetch(API_ENDPOINTS.USER.UPDATE_PROFILE, {
    method: 'PUT',
    body: JSON.stringify(profile)
  });
};

export const forgotPassword = async ({ email }) => {
  return await apiFetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
    method: 'POST',
    body: JSON.stringify({ email })
  });
};

export default {
  register,
  login,
  me,
  updateProfile,
  forgotPassword,
  saveTokens,
  clearTokens,
};
