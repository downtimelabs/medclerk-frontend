import { create } from 'zustand';
import type { PatientProfile, PatientStats, PatientPersonalUpdatePayload, PatientMedicalUpdatePayload } from '../interfaces/patient';
import type { LinkedDoctor, PatientDoctorRequest } from '../interfaces/linking';
import type { PatientDocument } from '../interfaces/upload';
import {
  getPatientProfile,
  updatePatientPersonal,
  updatePatientMedical,
  getPatientStats,
  getPatientActiveDoctors,
  getPatientPendingDoctorRequests,
  getPatientDocuments,
} from '../api/patient';

interface PatientState {
  profile: PatientProfile | null;
  stats: PatientStats | null;
  activeDoctors: LinkedDoctor[];
  pendingRequests: PatientDoctorRequest[];
  documents: PatientDocument[];
  loading: boolean;
  error: string | null;
  lastFetched: number;

  fetchProfile: () => Promise<void>;
  updatePersonalProfile: (payload: PatientPersonalUpdatePayload) => Promise<void>;
  updateMedicalProfile: (payload: PatientMedicalUpdatePayload) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchActiveDoctors: () => Promise<void>;
  fetchPendingRequests: () => Promise<void>;
  fetchDocuments: () => Promise<void>;
  reset: () => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  profile: null,
  stats: null,
  activeDoctors: [],
  pendingRequests: [],
  documents: [],
  loading: false,
  error: null,
  lastFetched: 0,

  fetchProfile: async () => {
    const now = Date.now();
    // if (profile && now - lastFetched < 5 * 60 * 1000) return; // 5 mins cache
    console.log('Fetching patient profile...');

    set({ loading: true, error: null });
    try {
      const profileData = await getPatientProfile();
      set({ profile: profileData, loading: false, lastFetched: now });
    } catch (error) {
      console.error('Failed to fetch patient profile:', error);
      set({ error: 'Failed to fetch patient profile', loading: false });
    }
  },

  updatePersonalProfile: async (payload) => {
    console.log('Updating personal profile:', payload);
    set({ loading: true, error: null });
    try {
      await updatePatientPersonal(payload);
      // Refetch profile to get updated state
      const profile = await getPatientProfile();
      set({ profile, loading: false, lastFetched: Date.now() });
    } catch (error) {
      console.error('Failed to update personal profile:', error);
      set({ error: 'Failed to update personal profile', loading: false });
    }
  },

  updateMedicalProfile: async (payload) => {
    console.log('Updating medical profile:', payload);
    set({ loading: true, error: null });
    try {
      await updatePatientMedical(payload);
      // Refetch profile to get updated state
      const profile = await getPatientProfile();
      set({ profile, loading: false, lastFetched: Date.now() });
    } catch (error) {
      console.error('Failed to update medical profile:', error);
      set({ error: 'Failed to update medical profile', loading: false });
    }
  },

  fetchStats: async () => {
    // Stats might change more often, maybe 1 min cache or always fetch?
    // Let's keep it simple and always fetch for now, or use a shorter cache
    set({ loading: true, error: null });
    try {
      const stats = await getPatientStats();
      set({ stats, loading: false });
    } catch (error) {
      console.error('Failed to fetch patient stats:', error);
      set({ error: 'Failed to fetch patient stats', loading: false });
    }
  },

  fetchActiveDoctors: async () => {
    set({ loading: true, error: null });
    try {
      const activeDoctors = await getPatientActiveDoctors();
      set({ activeDoctors, loading: false });
    } catch (error) {
      console.error('Failed to fetch active doctors:', error);
      set({ error: 'Failed to fetch active doctors', loading: false });
    }
  },

  fetchPendingRequests: async () => {
    set({ loading: true, error: null });
    try {
      const pendingRequests = await getPatientPendingDoctorRequests();
      set({ pendingRequests, loading: false });
    } catch (error) {
      console.error('Failed to fetch pending requests:', error);
      set({ error: 'Failed to fetch pending requests', loading: false });
    }
  },

  fetchDocuments: async () => {
    set({ loading: true, error: null });
    try {
      const documents = await getPatientDocuments();
      set({ documents, loading: false });
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      set({ error: 'Failed to fetch documents', loading: false });
    }
  },

  reset: () => {
    set({
      profile: null,
      stats: null,
      activeDoctors: [],
      pendingRequests: [],
      documents: [],
      error: null,
      lastFetched: 0,
    });
  },
}));
