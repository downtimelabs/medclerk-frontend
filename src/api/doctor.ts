import api from '../lib/axios';
import type {
  DoctorProfile,
  UpdateDoctorPersonalPayload,
  UpdateDoctorProfessionalPayload,
  DoctorStats,
  LinkedPatient,
  PendingPatientRequest,
} from '../interfaces/doctor';

export async function getDoctorProfile(): Promise<DoctorProfile> {
  const response = await api.get<DoctorProfile>('/doctor/profile');
  return response.data;
}

export async function updateDoctorPersonal(
  payload: UpdateDoctorPersonalPayload
): Promise<{ message: string; profile: DoctorProfile }> {
  const response = await api.patch<{ message: string; profile: DoctorProfile }>(
    '/doctor/profile/personal',
    payload
  );
  return response.data;
}

export async function updateDoctorProfessional(
  payload: UpdateDoctorProfessionalPayload
): Promise<{ message: string; profile: DoctorProfile }> {
  const response = await api.patch<{ message: string; profile: DoctorProfile }>(
    '/doctor/profile/professional',
    payload
  );
  return response.data;
}

export async function getDoctorStats(): Promise<DoctorStats> {
  const response = await api.get<DoctorStats>('/doctor/stats');
  return response.data;
}

export async function getDoctorPendingRequests(): Promise<PendingPatientRequest[]> {
  const response = await api.get<{ data: { patients: PendingPatientRequest[] } }>('/doctor/patients', {
    params: { status: 'PENDING' }
  });
  return response.data.data.patients;
}

export async function getDoctorActivePatients(): Promise<LinkedPatient[]> {
  const response = await api.get<{ data: { patients: LinkedPatient[] } }>('/doctor/patients', {
    params: { status: 'ACTIVE' }
  });
  return response.data.data.patients;
}

export async function approvePatient(patientId: string): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(`/doctor/patients/${patientId}/approve`);
  return response.data;
}

export async function rejectPatient(patientId: string): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(`/doctor/patients/${patientId}/reject`);
  return response.data;
}

export async function revokePatient(patientId: string): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(`/doctor/patients/${patientId}/revoke`);
  return response.data;
}
