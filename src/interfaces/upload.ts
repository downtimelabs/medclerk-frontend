// Returned from /presign
export interface PresignResponse {
  uploadUrl: string;
  objectKey: string;
}

// Request to confirm upload
export interface ConfirmUploadRequest {
  objectKey: string;
  fileName: string;
  mimeType: string;
  documentType?: string | null;
}

// Response from confirm
export interface ConfirmUploadResponse {
  message: string;
  documentId: string;
}

// Patient document list item
export interface PatientDocument {
  id: string;
  fileName: string;
  mimeType: string;
  documentType: string | null;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  secureUrl: string;
  objectKey: string;
}

export interface PatientDocumentDetails extends PatientDocument {}
