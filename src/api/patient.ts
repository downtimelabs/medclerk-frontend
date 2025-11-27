import api from '../lib/axios';
import type {
  PatientProfile,
  PatientStats,
} from '../interfaces/patient';
import type { LinkedDoctor, PatientDoctorRequest } from '../interfaces/linking';
import type { PatientDocument } from '../interfaces/upload';

export async function getPatientProfile(): Promise<PatientProfile> {
  const response = await api.get<{ data: any }>('/patient/details');
  // Map backend response to frontend interface if needed, or assume it matches
  // The backend returns { data: { personalInfo: ..., medicalInfo: ... } }
  // We might need to adapt this to match PatientProfile interface
  return response.data as any; 
}

export async function updatePatientPersonal(
  payload: any
): Promise<{ message: string; profile: PatientProfile }> {
  const response = await api.patch<{ message: string; profile: PatientProfile }>(
    '/patient/personal',
    payload
  );
  return response.data;
}

export async function updatePatientMedical(
  payload: any
): Promise<{ message: string; profile: PatientProfile }> {
  const response = await api.patch<{ message: string; profile: PatientProfile }>(
    '/patient/medical',
    payload
  );
  return response.data;
}

export async function getPatientStats(): Promise<PatientStats> {
  const response = await api.get<PatientStats>('/patient/stats');
  return response.data;
}

export async function getPatientActiveDoctors(): Promise<LinkedDoctor[]> {
  const response = await api.get<LinkedDoctor[]>('/patient/doctors/active');
  return response.data;
}

export async function getPatientPendingDoctorRequests(): Promise<PatientDoctorRequest[]> {
  const response = await api.get<PatientDoctorRequest[]>('/patient/doctor/requests');
  return response.data;
}

export async function getPatientDocuments(): Promise<PatientDocument[]> {
  const response = await api.get<PatientDocument[]>('/patient/documents');
  return response.data;
}
