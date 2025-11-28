import api from '../lib/axios';
import type { APIResponse } from '../interfaces/common';
import type {
  CompleteDoctorProfile,
  UpdateDoctorPersonalInfo,
  UpdateDoctorProfessionalInfo,
  GetDoctorPatientsQuery,
  PatientsListResponse,
  SearchDoctorPatientsQuery,
  PatientInfo,
  DoctorStats,
  GetPatientDocumentsQuery,
  DocumentsResponse,
  Document,
  RAGQuery,
  RAGResponse,
  LinkRequest,
} from '../interfaces/doctor';

// 8. Get doctor's complete profile
export async function getDoctorProfile(): Promise<CompleteDoctorProfile> {
  const response = await api.get<APIResponse<CompleteDoctorProfile>>('/doctor/profile');
  return response.data.data;
}

// 9. Update doctor's personal information
export async function updateDoctorPersonal(
  payload: UpdateDoctorPersonalInfo
): Promise<Partial<CompleteDoctorProfile>> {
  const response = await api.patch<APIResponse<Partial<CompleteDoctorProfile>>>(
    '/doctor/profile/personal',
    payload
  );
  return response.data.data;
}

// 10. Update doctor's professional information
export async function updateDoctorProfessional(
  payload: UpdateDoctorProfessionalInfo
): Promise<CompleteDoctorProfile['profile']> {
  const response = await api.patch<APIResponse<CompleteDoctorProfile['profile']>>(
    '/doctor/profile/professional',
    payload
  );
  return response.data.data;
}

// 11. Get list of doctor's patients
export async function getDoctorPatients(query: GetDoctorPatientsQuery): Promise<PatientsListResponse> {
  const response = await api.get<APIResponse<PatientsListResponse>>('/doctor/patients', {
    params: query,
  });
  return response.data.data;
}

// 12. Search doctor's patients
export async function searchDoctorPatients(query: SearchDoctorPatientsQuery): Promise<{ patients: PatientInfo[], total: number, searchTerm: string }> {
  const response = await api.get<APIResponse<{ patients: PatientInfo[], total: number, searchTerm: string }>>('/doctor/patients/search', {
    params: query,
  });
  return response.data.data;
}

// 13. Get doctor statistics
export async function getDoctorStats(): Promise<DoctorStats> {
  const response = await api.get<APIResponse<DoctorStats>>('/doctor/stats');
  return response.data.data;
}

// 14. Get all documents for a specific patient
export async function getPatientDocuments(
  patientId: string,
  query: GetPatientDocumentsQuery
): Promise<DocumentsResponse> {
  const response = await api.get<APIResponse<DocumentsResponse>>(`/doctor/patients/${patientId}/documents`, {
    params: query,
  });
  return response.data.data;
}

// 15. Get specific document for a patient
export async function getPatientDocument(
  patientId: string,
  documentId: string
): Promise<Document> {
  const response = await api.get<APIResponse<Document>>(`/doctor/patients/${patientId}/documents/${documentId}`);
  return response.data.data;
}

// 16. Query patient documents using RAG/AI
export async function queryPatientDocuments(
  patientId: string,
  body: RAGQuery
): Promise<RAGResponse> {
  const response = await api.post<APIResponse<RAGResponse>>(`/doctor/patients/${patientId}/documents/query`, body);
  return response.data.data;
}

// 17. Get pending patient link requests
export async function getPendingPatientRequests(): Promise<{ requests: LinkRequest[], total: number }> {
  const response = await api.get<APIResponse<{ requests: LinkRequest[], total: number }>>('/doctor/patients/requests/pending');
  return response.data.data;
}

// 18. Approve a patient link request
export async function approvePatientRequest(linkId: string): Promise<LinkRequest> {
  const response = await api.patch<APIResponse<LinkRequest>>(`/doctor/patients/requests/${linkId}/approve`);
  return response.data.data;
}

// 19. Reject a patient link request
export async function rejectPatientRequest(linkId: string): Promise<null> {
  const response = await api.delete<APIResponse<null>>(`/doctor/patients/requests/${linkId}/reject`);
  return response.data.data;
}

// 20. Revoke an active patient link
export async function revokePatientLink(linkId: string): Promise<null> {
  const response = await api.delete<APIResponse<null>>(`/doctor/patients/links/${linkId}`);
  return response.data.data;
}
