// Document list item
export interface PatientDocument {
  id: string;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
  documentType: string | null;
  secureUrl: string;
  objectKey: string;
}

// Detailed document (same as above)
export interface PatientDocumentDetails extends PatientDocument {}

// Multi-document RAG request
export interface RagMultiQueryRequest {
  query: string;
  documentIds?: string[]; // optional — backend supports querying all uploaded docs if not provided
}

// Multi-document RAG response
export interface RagQueryResponse {
  answer: string;
  sources: Array<{
    documentId: string;
    page: number | null;
    content: string;
    confidence: number;
  }>;
  meta: {
    model: string;
    durationMs: number;
  };
}
