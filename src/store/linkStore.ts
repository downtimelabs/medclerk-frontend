import { create } from 'zustand';
import type {
  LinkedDoctor,
  PatientDoctorRequest,
  DoctorPatientRequest,
} from '../interfaces/linking';
import type { PublicDoctorProfile } from '../interfaces/discovery';
import { searchDoctors } from '../api/discovery';
import {
  getActiveDoctorsForPatient,
  getPatientPendingDoctorRequests,
  getDoctorPatientRequests,
  requestDoctorLink,
  approvePatientRequest,
  rejectPatientRequest,
  revokePatientLink,
  cancelLinkRequest,
  revokeDoctorLink,
} from '../api/linking';

interface LinkState {
  activeDoctors: LinkedDoctor[];
  pendingRequests: PatientDoctorRequest[];
  doctorPendingPatients: DoctorPatientRequest[];
  discoverableDoctors: PublicDoctorProfile[];
  loading: boolean;
  error: string | null;

  fetchActiveDoctors: () => Promise<void>;
  fetchPendingDoctorRequests: () => Promise<void>;
  fetchDoctorPendingRequests: () => Promise<void>;
  discoverDoctors: () => Promise<void>;
  sendDoctorRequest: (doctorId: string) => Promise<void>;
  cancelRequest: (linkId: string) => Promise<void>;
  revokeLink: (linkId: string) => Promise<void>;
  approvePatient: (patientId: string) => Promise<void>;
  rejectPatient: (patientId: string) => Promise<void>;
  revokePatient: (patientId: string) => Promise<void>;
  reset: () => void;
}

export const useLinkStore = create<LinkState>((set, get) => ({
  activeDoctors: [],
  pendingRequests: [],
  doctorPendingPatients: [],
  discoverableDoctors: [],
  loading: false,
  error: null,

  fetchActiveDoctors: async () => {
    set({ loading: true, error: null });
    try {
      const activeDoctors = await getActiveDoctorsForPatient();
      set({ activeDoctors, loading: false });
    } catch (error) {
      console.error('Failed to fetch active doctors:', error);
      set({ error: 'Failed to fetch active doctors', loading: false });
    }
  },

  fetchPendingDoctorRequests: async () => {
    set({ loading: true, error: null });
    try {
      const pendingRequests = await getPatientPendingDoctorRequests();
      set({ pendingRequests, loading: false });
    } catch (error) {
      console.error('Failed to fetch pending requests:', error);
      set({ error: 'Failed to fetch pending requests', loading: false });
    }
  },

  fetchDoctorPendingRequests: async () => {
    set({ loading: true, error: null });
    try {
      const doctorPendingPatients = await getDoctorPatientRequests();
      set({ doctorPendingPatients, loading: false });
    } catch (error) {
      console.error('Failed to fetch doctor pending requests:', error);
      set({ error: 'Failed to fetch doctor pending requests', loading: false });
    }
  },

  discoverDoctors: async () => {
      set({ loading: true, error: null });
      try {
          const response = await searchDoctors({});
          set({ discoverableDoctors: response.doctors, loading: false });
      } catch (error) {
          console.error('Failed to discover doctors:', error);
          set({ error: 'Failed to discover doctors', loading: false });
      }
  },

  sendDoctorRequest: async (doctorId: string) => {
    set({ loading: true, error: null });
    try {
      await requestDoctorLink({ doctorId });
      // Re-fetch to get actual data
      await get().fetchPendingDoctorRequests();
      set({ loading: false });
    } catch (error) {
      console.error('Failed to send doctor request:', error);
      set({ error: 'Failed to send doctor request', loading: false });
    }
  },

  cancelRequest: async (linkId: string) => {
    set({ loading: true, error: null });
    try {
      await cancelLinkRequest(linkId);
      // Remove from local state
      set((state) => ({
        pendingRequests: state.pendingRequests.filter(req => req.id !== linkId)
      }));
      set({ loading: false });
    } catch (error) {
      console.error('Failed to cancel request:', error);
      set({ error: 'Failed to cancel request', loading: false });
    }
  },

  revokeLink: async (linkId: string) => {
    set({ loading: true, error: null });
    try {
      await revokeDoctorLink(linkId);
      // Remove from local state
      set((state) => ({
        activeDoctors: state.activeDoctors.filter(doc => doc.linkId !== linkId)
      }));
      set({ loading: false });
    } catch (error) {
      console.error('Failed to revoke link:', error);
      set({ error: 'Failed to revoke link', loading: false });
    }
  },

  approvePatient: async (patientId: string) => {
    set({ loading: true, error: null });
    const previousPending = get().doctorPendingPatients;
    // Optimistic update
    set((state) => ({
      doctorPendingPatients: state.doctorPendingPatients.filter(
        (req) => req.patientId !== patientId
      ),
    }));

    try {
      await approvePatientRequest(patientId);
      set({ loading: false });
    } catch (error) {
      console.error('Failed to approve patient:', error);
      // Rollback
      set({ doctorPendingPatients: previousPending, error: 'Failed to approve patient', loading: false });
    }
  },

  rejectPatient: async (patientId: string) => {
    set({ loading: true, error: null });
    const previousPending = get().doctorPendingPatients;
    // Optimistic update
    set((state) => ({
      doctorPendingPatients: state.doctorPendingPatients.filter(
        (req) => req.patientId !== patientId
      ),
    }));

    try {
      await rejectPatientRequest(patientId);
      set({ loading: false });
    } catch (error) {
      console.error('Failed to reject patient:', error);
      // Rollback
      set({ doctorPendingPatients: previousPending, error: 'Failed to reject patient', loading: false });
    }
  },

  revokePatient: async (patientId: string) => {
    set({ loading: true, error: null });
    // For revoke, we might want to remove from activeDoctors if this was patient side, 
    // but this action seems to be "revokePatient" which implies doctor side revoking patient.
    // If it's patient revoking doctor, it should be "revokeDoctor".
    // Assuming this is doctor side for now based on naming.
    // If we had activePatients list, we would optimistically remove.
    
    try {
      await revokePatientLink(patientId);
      set({ loading: false });
    } catch (error) {
      console.error('Failed to revoke patient:', error);
      set({ error: 'Failed to revoke patient', loading: false });
    }
  },

  reset: () => {
    set({
      activeDoctors: [],
      pendingRequests: [],
      doctorPendingPatients: [],
      discoverableDoctors: [],
      error: null,
    });
  },
}));
