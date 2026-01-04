import api from '../lib/axios';
import type { APIResponse } from '../interfaces/common';
import type {
  PresignResponse,
  ConfirmUploadRequest,
  ConfirmUploadResponse,
  PatientDocumentDetails,
  DocumentsResponse,
  GetFileUrlResponse,
  AvatarUploadResponse,
} from '../interfaces/upload';

export async function getPresignedUrl(
  fileName: string,
  contentType: string,
  size: number
): Promise<PresignResponse> {
  const response = await api.post<APIResponse<PresignResponse>>('/upload/presigned-url', {
    fileName,
    contentType,
    size,
  });
  return response.data.data;
}

export async function confirmDocumentUpload(
  payload: ConfirmUploadRequest
): Promise<ConfirmUploadResponse> {
  const response = await api.post<APIResponse<ConfirmUploadResponse>>(
    '/upload/confirm',
    payload
  );
  return response.data.data;
}

export async function fetchPatientDocuments(): Promise<DocumentsResponse> {
  const response = await api.get<APIResponse<DocumentsResponse>>('/patient/documents');
  return response.data.data;
}

export async function fetchPatientDocument(
  documentId: string
): Promise<PatientDocumentDetails> {
  const response = await api.get<PatientDocumentDetails>(
    `/patient/documents/${documentId}`
  );
  return response.data;
}

export async function getFileUrl(key: string): Promise<string> {
  const response = await api.get<APIResponse<GetFileUrlResponse>>(`/upload/file-url`, {
    params: { key }
  });
  return response.data.data.presignedUrl;
}

// Avatar upload via multipart form data
export async function uploadAvatar(file: File): Promise<AvatarUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<APIResponse<AvatarUploadResponse>>(
    '/upload/avatar',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data.data;
}

// Get patient's current avatar URL
export async function getPatientAvatarUrl(): Promise<string> {
  const response = await api.get<APIResponse<string>>('/patient/avatar');
  return response.data.data;
}
