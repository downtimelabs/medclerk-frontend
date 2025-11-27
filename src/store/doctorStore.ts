import { create } from 'zustand';
import type {
  DoctorProfile,
  DoctorStats,
  LinkedPatient,
  PendingPatientRequest,
  UpdateDoctorPersonalPayload,
  UpdateDoctorProfessionalPayload,
} from '../interfaces/doctor';
import {
  getDoctorProfile,
  updateDoctorPersonal,
  updateDoctorProfessional,
  getDoctorStats,
  getDoctorPendingRequests,
  getDoctorActivePatients,
  approvePatient,
  rejectPatient,
  revokePatient,
} from '../api/doctor';

interface DoctorState {
  profile: DoctorProfile | null;
  stats: DoctorStats | null;
  pendingRequests: PendingPatientRequest[];
  activePatients: LinkedPatient[];
  loading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updatePersonal: (payload: UpdateDoctorPersonalPayload) => Promise<void>;
  updateProfessional: (payload: UpdateDoctorProfessionalPayload) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchPendingRequests: () => Promise<void>;
  fetchActivePatients: () => Promise<void>;
  approvePatient: (patientId: string) => Promise<void>;
  rejectPatient: (patientId: string) => Promise<void>;
  revokePatient: (patientId: string) => Promise<void>;
  reset: () => void;
}

export const useDoctorStore = create<DoctorState>((set, get) => ({
  profile: null,
  stats: null,
  pendingRequests: [],
  activePatients: [],
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const profile = await getDoctorProfile();
      set({ profile, loading: false });
    } catch (error) {
      console.error('Failed to fetch doctor profile:', error);
      set({ error: 'Failed to fetch doctor profile', loading: false });
    }
  },

  updatePersonal: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { profile } = await updateDoctorPersonal(payload);
      set({ profile, loading: false });
    } catch (error) {
      console.error('Failed to update personal info:', error);
      set({ error: 'Failed to update personal info', loading: false });
    }
  },

  updateProfessional: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { profile } = await updateDoctorProfessional(payload);
      set({ profile, loading: false });
    } catch (error) {
      console.error('Failed to update professional info:', error);
      set({ error: 'Failed to update professional info', loading: false });
    }
  },

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await getDoctorStats();
      set({ stats, loading: false });
    } catch (error) {
      console.error('Failed to fetch doctor stats:', error);
      set({ error: 'Failed to fetch doctor stats', loading: false });
    }
  },

  fetchPendingRequests: async () => {
    set({ loading: true, error: null });
    try {
      const pendingRequests = await getDoctorPendingRequests();
      set({ pendingRequests, loading: false });
    } catch (error) {
      console.error('Failed to fetch pending requests:', error);
      set({ error: 'Failed to fetch pending requests', loading: false });
    }
  },

  fetchActivePatients: async () => {
    set({ loading: true, error: null });
    try {
      const activePatients = await getDoctorActivePatients();
      set({ activePatients, loading: false });
    } catch (error) {
      console.error('Failed to fetch active patients:', error);
      set({ error: 'Failed to fetch active patients', loading: false });
    }
  },

  approvePatient: async (patientId: string) => {
    set({ loading: true, error: null });
    try {
      await approvePatient(patientId);
      // Optimistic update: remove from pending, refresh active
      set((state) => ({
        pendingRequests: state.pendingRequests.filter((req) => req.patientId !== patientId),
      }));
      await get().fetchActivePatients();
      set({ loading: false });
    } catch (error) {
      console.error('Failed to approve patient:', error);
      set({ error: 'Failed to approve patient', loading: false });
    }
  },

  rejectPatient: async (patientId: string) => {
    set({ loading: true, error: null });
    try {
      await rejectPatient(patientId);
      // Optimistic update: remove from pending
      set((state) => ({
        pendingRequests: state.pendingRequests.filter((req) => req.patientId !== patientId),
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to reject patient:', error);
      set({ error: 'Failed to reject patient', loading: false });
    }
  },

  revokePatient: async (patientId: string) => {
    set({ loading: true, error: null });
    try {
      await revokePatient(patientId);
      // Optimistic update: remove from active
      set((state) => ({
        activePatients: state.activePatients.filter((p) => p.patientId !== patientId),
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to revoke patient:', error);
      set({ error: 'Failed to revoke patient', loading: false });
    }
  },

  reset: () => {
    set({
      profile: null,
      stats: null,
      pendingRequests: [],
      activePatients: [],
      error: null,
    });
  },
}));
