// Returned from /presign
export interface PresignResponse {
  presignedUrl: string;
  key: string;
}

export interface GetFileUrlResponse {
  presignedUrl: string;
}

// Request to confirm upload
export interface ConfirmUploadRequest {
  key: string;
  title: string;
  type: string; // 'LAB_REPORT' | 'PRESCRIPTION' | ...
  mimeType: string;
  fileSize: number;
  tags?: string[];
  description?: string;
}

// Response from confirm
export interface ConfirmUploadResponse {
  id: string;
  title: string;
  type: string;
  description: string | null;
  tags: string[];
  mimeType: string;
  fileSize: number;
  objectKey: string;
  createdAt: string;
  ocrProcessing: boolean;
}

// Patient document list item
// Patient document list item
export interface PatientDocument {
  id: string;
  title: string;
  type: string;
  description: string | null;
  tags: string[];
  mimeType: string;
  fileSize: number;
  objectKey: string;
  createdAt: string;
  updatedAt: string;
  fileUrl: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  uploader?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  ocrJobs?: Array<{
    id: string;
    status: string;
    extractedAt: string | null;
    text: string | null;
    error: string | null;
  }>;
}

export interface DocumentsResponse {
  documents: PatientDocument[];
  total: number;
  hasMore: boolean;
}

export interface PatientDocumentDetails extends PatientDocument {}
