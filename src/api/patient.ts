import api from '../lib/axios';
import type {
  PatientProfile,
  DocumentStats,
} from '../interfaces/patient';
import type { LinkedDoctor, PatientDoctorRequest } from '../interfaces/linking';
import type { PatientDocument } from '../interfaces/upload';

export async function getPatientProfile(): Promise<PatientProfile> {
  const response = await api.get<{ data: PatientProfile }>('/patient/details');
  return response.data.data;
}

export async function updatePatientPersonal(
  payload: any
): Promise<{ message: string; data: any }> {
  const response = await api.patch<{ message: string; data: any }>(
    '/patient/personal',
    payload
  );
  return response.data;
}

export async function updatePatientMedical(
  payload: any
): Promise<{ message: string; data: any }> {
  const response = await api.patch<{ message: string; data: any }>(
    '/patient/medical',
    payload
  );
  return response.data;
}

export async function getPatientDocumentStats(): Promise<DocumentStats> {
  const response = await api.get<{ statusCode: number; message: string; data: DocumentStats }>('/patient/documents/stats');
  return response.data.data;
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


