import { create } from 'zustand';
import type {
  LinkedDoctor,
  PatientDoctorRequest,
  DoctorPatientRequest,
} from '../interfaces/linking';
import {
  getActiveDoctorsForPatient,
  getPatientPendingDoctorRequests,
  getDoctorPatientRequests,
  requestDoctorLink,
  approvePatientRequest,
  rejectPatientRequest,
  revokePatientLink,
} from '../api/linking';

interface LinkState {
  activeDoctors: LinkedDoctor[];
  pendingRequests: PatientDoctorRequest[];
  doctorPendingPatients: DoctorPatientRequest[];
  discoverableDoctors: any[]; // Using any for now as we don't have a full Doctor type for discovery yet
  loading: boolean;
  error: string | null;

  fetchActiveDoctors: () => Promise<void>;
  fetchPendingDoctorRequests: () => Promise<void>;
  fetchDoctorPendingRequests: () => Promise<void>;
  discoverDoctors: () => Promise<void>;
  sendDoctorRequest: (doctorId: string) => Promise<void>;
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
      // Map to include flattened properties if needed, or backend should return them
      // For now, assuming backend returns nested doctor object, we map it manually if needed
      // But let's assume the API returns what we need or we fix the API later.
      // To fix the build, we'll cast or map.
      const mappedDoctors = activeDoctors.map((d: any) => ({
        ...d,
        doctorName: d.doctor?.name || 'Unknown Doctor',
        doctorProfile: {
            specialization: d.doctor?.specialization || 'General',
            clinicName: 'Clinic', // Mock
            clinicAddress: 'Address', // Mock
            experienceYears: 5 // Mock
        }
      }));
      set({ activeDoctors: mappedDoctors, loading: false });
    } catch (error) {
      console.error('Failed to fetch active doctors:', error);
      set({ error: 'Failed to fetch active doctors', loading: false });
    }
  },

  fetchPendingDoctorRequests: async () => {
    set({ loading: true, error: null });
    try {
      const pendingRequests = await getPatientPendingDoctorRequests();
      const mappedRequests = pendingRequests.map((r: any) => ({
          ...r,
          doctorName: r.doctor?.name || 'Unknown Doctor',
          doctorProfile: {
              specialization: r.doctor?.specialization || 'General'
          }
      }));
      set({ pendingRequests: mappedRequests, loading: false });
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
          // Mock discovery for now as we don't have an endpoint in api/linking.ts yet
          // In a real app, this would call `searchDoctors` or similar
          const mockDoctors = [
            {
                id: 'doc-1',
                name: "Dr. Michael Ross",
                doctorProfile: {
                    specialization: "General Physician",
                    experienceYears: 20,
                    clinicName: "City Health Clinic",
                    clinicAddress: "321 5th Ave, New York",
                },
                rating: 4.7,
            },
            {
                id: 'doc-2',
                name: "Dr. Lisa Chang",
                doctorProfile: {
                    specialization: "Neurologist",
                    experienceYears: 15,
                    clinicName: "Brain & Spine Institute",
                    clinicAddress: "88 West End, New York",
                },
                rating: 4.9,
            }
          ];
          set({ discoverableDoctors: mockDoctors, loading: false });
      } catch (error) {
          set({ error: 'Failed to discover doctors', loading: false });
      }
  },

  sendDoctorRequest: async (doctorId: string) => {
    set({ loading: true, error: null });
    // Optimistic update: Add to pendingRequests immediately (mocking the request object)
    const previousPending = get().pendingRequests;
    const optimisticRequest: any = {
        id: 'temp-' + Date.now(),
        doctor: { id: doctorId, name: 'Loading...', specialization: null, avatarUrl: null },
        doctorName: 'Loading...',
        status: 'PENDING',
        createdAt: new Date().toISOString()
    };
    set({ pendingRequests: [...previousPending, optimisticRequest] });

    try {
      await requestDoctorLink({ doctorId });
      // Re-fetch to get actual data
      await get().fetchPendingDoctorRequests();
      set({ loading: false });
    } catch (error) {
      console.error('Failed to send doctor request:', error);
      // Rollback
      set({ pendingRequests: previousPending, error: 'Failed to send doctor request', loading: false });
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
