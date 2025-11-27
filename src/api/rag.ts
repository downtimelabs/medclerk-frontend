import api from '../lib/axios';
import type {
  PatientDocument,
  PatientDocumentDetails,
  RagMultiQueryRequest,
  RagQueryResponse,
} from '../interfaces/rag';

export async function getPatientDocuments(): Promise<PatientDocument[]> {
  const response = await api.get<PatientDocument[]>('/patient/documents');
  return response.data;
}

export async function getPatientDocument(documentId: string): Promise<PatientDocumentDetails> {
  const response = await api.get<PatientDocumentDetails>(`/patient/documents/${documentId}`);
  return response.data;
}

export async function runMultiRagQuery(payload: RagMultiQueryRequest): Promise<RagQueryResponse> {
  const response = await api.post<RagQueryResponse>('/patient/documents/query', payload);
  return response.data;
}
