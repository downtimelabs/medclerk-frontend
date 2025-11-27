import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser, Tokens } from '../interfaces/auth';
import { loginApi, registerPatientApi, logoutApi } from '../api/auth';
import type { RegisterPatientRequest } from '../types/registerPatient';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  authenticated: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  registerPatient: (payload: RegisterPatientRequest) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (tokens: Tokens) => void;
  loadFromStorage: () => void;
  clearStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      authenticated: false,

      login: async (email, password) => {
        try {
          const response = await loginApi({ email, password });
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            authenticated: true,
          });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      registerPatient: async (payload) => {
        try {
          await registerPatientApi(payload);
          // Depending on requirements, we might auto-login or just return
          // For now, we'll update the user if provided, but usually registration 
          // might require email verification or separate login.
          // The interface says it returns user and verificationToken.
          // We'll just store the user if it's returned and authenticated.
          // But typically registration doesn't always auto-login.
          // The prompt says "On login: call loginApi...". It doesn't explicitly say what to do on register.
          // I'll leave state update minimal here unless auto-login is desired.
          // But to be safe and consistent with "production-grade", let's assume 
          // we might need to login separately or handle the response.
          // If the response includes tokens, we could auto-login. 
          // The RegisterPatientResponse has `user` but NO tokens in the interface definition provided.
          // So we cannot auto-login.
        } catch (error) {
          console.error('Registration failed:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          const { refreshToken } = get();
          if (refreshToken) {
            await logoutApi({ refreshToken });
          }
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            authenticated: false,
          });
          localStorage.removeItem('auth-storage');
        }
      },

      setTokens: (tokens: Tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },

      loadFromStorage: () => {
        // Zustand persist middleware handles loading automatically on init
        // but if we need manual trigger:
        // The persist middleware automatically hydrates the store.
      },

      clearStorage: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          authenticated: false,
        });
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        authenticated: state.authenticated,
      }),
    }
  )
);
