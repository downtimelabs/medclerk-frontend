import api from '../lib/axios';
import type {
  DoctorInfo,
  LinkedDoctor,
  PatientDoctorRequest,
  DoctorPatientRequest,
  RequestDoctorLinkPayload,
} from '../interfaces/linking';

// PATIENT SIDE

export async function requestDoctorLink(payload: RequestDoctorLinkPayload): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>('/patient/doctor/request', payload);
  return response.data;
}

export async function getPatientPendingDoctorRequests(): Promise<PatientDoctorRequest[]> {
  const response = await api.get<PatientDoctorRequest[]>('/patient/doctor/requests');
  return response.data;
}

export async function getActiveDoctorsForPatient(): Promise<LinkedDoctor[]> {
  const response = await api.get<LinkedDoctor[]>('/patient/doctors/active');
  return response.data;
}

export async function discoverDoctors(search?: string): Promise<DoctorInfo[]> {
  const response = await api.get<{ data: { doctors: DoctorInfo[] } }>('/doctors', {
    params: { name: search }, // Backend uses 'name' for search
  });
  return response.data.data.doctors;
}

// DOCTOR SIDE

export async function getDoctorPatientRequests(): Promise<DoctorPatientRequest[]> {
  const response = await api.get<DoctorPatientRequest[]>('/doctor/patients/requests');
  return response.data;
}

export async function approvePatientRequest(patientId: string): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(`/doctor/patients/${patientId}/approve`);
  return response.data;
}

export async function rejectPatientRequest(patientId: string): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(`/doctor/patients/${patientId}/reject`);
  return response.data;
}

export async function revokePatientLink(patientId: string): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(`/doctor/patients/${patientId}/revoke`);
  return response.data;
}
