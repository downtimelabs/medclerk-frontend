import api from '../lib/axios';
import type {
  LinkedDoctor,
  PatientDoctorRequest,
  DoctorPatientRequest,
  RequestDoctorLinkPayload,
} from '../interfaces/linking';

// --- Patient Side APIs ---

export async function getActiveDoctorsForPatient(): Promise<LinkedDoctor[]> {
  const response = await api.get<{ data: { doctors: LinkedDoctor[] } }>('/patient/care-team');
  return response.data.data.doctors;
}

export async function requestDoctorLink(payload: RequestDoctorLinkPayload): Promise<PatientDoctorRequest> {
  console.log('Sending requestDoctorLink with payload:', payload);
  const response = await api.post<{ data: PatientDoctorRequest }>('/patient/doctors/link', payload);
  return response.data.data;
}

export async function getPatientPendingDoctorRequests(): Promise<PatientDoctorRequest[]> {
  const response = await api.get<{ data: { requests: PatientDoctorRequest[] } }>('/patient/doctors/requests/pending');
  return response.data.data.requests;
}

export async function cancelLinkRequest(linkId: string): Promise<void> {
  await api.delete(`/patient/doctors/requests/${linkId}`);
}

export async function revokeDoctorLink(linkId: string): Promise<void> {
  await api.delete(`/patient/doctors/links/${linkId}`);
}

// --- Doctor Side APIs (Keeping existing placeholders or updates if needed) ---

export async function getDoctorPatientRequests(): Promise<DoctorPatientRequest[]> {
  // Assuming a similar structure for doctor side, but focusing on patient side for now
  // This might need update if doctor side API changes
  const response = await api.get<DoctorPatientRequest[]>('/doctor/patient/requests');
  return response.data;
}

export async function approvePatientRequest(patientId: string): Promise<void> {
  await api.post(`/doctor/patient/requests/${patientId}/approve`);
}

export async function rejectPatientRequest(patientId: string): Promise<void> {
  await api.post(`/doctor/patient/requests/${patientId}/reject`);
}

export async function revokePatientLink(patientId: string): Promise<void> {
  await api.delete(`/doctor/patients/${patientId}/revoke`);
}
