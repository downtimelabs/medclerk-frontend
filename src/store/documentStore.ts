import { create } from 'zustand';
import type { PatientDocument, PatientDocumentDetails, RagQueryResponse } from '../interfaces/rag';
import { getPatientDocuments, getPatientDocument, runMultiRagQuery } from '../api/rag';

interface DocumentState {
  documents: PatientDocument[];
  selectedDocument: PatientDocumentDetails | null;
  ragAnswer: string | null;
  ragSources: RagQueryResponse['sources'];
  loading: boolean;
  error: string | null;

  fetchDocuments: () => Promise<void>;
  fetchDocument: (documentId: string) => Promise<void>;
  queryDocuments: (query: string, documentIds?: string[]) => Promise<void>;
  resetRag: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  selectedDocument: null,
  ragAnswer: null,
  ragSources: [],
  loading: false,
  error: null,

  fetchDocuments: async () => {
    set({ loading: true, error: null });
    try {
      const documents = await getPatientDocuments();
      set({ documents, loading: false });
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      set({ error: 'Failed to fetch documents', loading: false });
    }
  },

  fetchDocument: async (documentId: string) => {
    set({ loading: true, error: null });
    try {
      const document = await getPatientDocument(documentId);
      set({ selectedDocument: document, loading: false });
    } catch (error) {
      console.error('Failed to fetch document details:', error);
      set({ error: 'Failed to fetch document details', loading: false });
    }
  },

  queryDocuments: async (query: string, documentIds?: string[]) => {
    set({ loading: true, error: null, ragAnswer: null, ragSources: [] });
    try {
      const response = await runMultiRagQuery({ query, documentIds });
      set({
        ragAnswer: response.answer,
        ragSources: response.sources,
        loading: false,
      });
    } catch (error) {
      console.error('RAG query failed:', error);
      set({ error: 'Failed to perform RAG query', loading: false });
    }
  },

  resetRag: () => {
    set({ ragAnswer: null, ragSources: [], error: null });
  },
}));
