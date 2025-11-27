import api from '../lib/axios';
import type {
  PresignResponse,
  ConfirmUploadRequest,
  ConfirmUploadResponse,
  PatientDocument,
  PatientDocumentDetails,
} from '../interfaces/upload';

export async function getPresignedUrl(
  fileName: string,
  contentType: string
): Promise<PresignResponse> {
  const response = await api.post<PresignResponse>('/upload/presigned-url', {
    fileName,
    contentType,
  });
  return response.data;
}

export async function confirmDocumentUpload(
  payload: ConfirmUploadRequest
): Promise<ConfirmUploadResponse> {
  const response = await api.post<ConfirmUploadResponse>(
    '/upload/confirm',
    payload
  );
  return response.data;
}

export async function fetchPatientDocuments(): Promise<PatientDocument[]> {
  const response = await api.get<PatientDocument[]>('/patient/documents');
  return response.data;
}

export async function fetchPatientDocument(
  documentId: string
): Promise<PatientDocumentDetails> {
  const response = await api.get<PatientDocumentDetails>(
    `/patient/documents/${documentId}`
  );
  return response.data;
}
