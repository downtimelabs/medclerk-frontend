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
  question: string;
  documentIds?: string[]; // optional — backend supports querying all uploaded docs if not provided
}

// Multi-document RAG response
export interface RagQueryResponse {
  success: boolean;
  answer: string;
  error: string | null;
  processing_time: number;
  sources: Array<{
    relevance_score: number;
    source_name: string;
    text_snippet: string;
  }>;
}
