import { create } from 'zustand';
import type { PatientDocument, PatientDocumentDetails } from '../interfaces/upload';
import {
  getPresignedUrl,
  confirmDocumentUpload,
  fetchPatientDocuments,
  fetchPatientDocument,
  getFileUrl,
} from '../api/upload';
import { usePatientStore } from './patientStore';

interface UploadState {
  uploading: boolean;
  loading: boolean;
  documents: PatientDocument[];
  selectedDocument: PatientDocumentDetails | null;
  viewingKey: string | null;
  error: string | null;

  fetchDocuments: () => Promise<void>;
  getDocument: (id: string) => Promise<void>;
  uploadDocument: (file: File, documentType?: string | null) => Promise<void>;
  viewDocument: (key: string) => Promise<void>;
  resetSelected: () => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  uploading: false,
  loading: false,
  documents: [],
  selectedDocument: null,
  viewingKey: null,
  error: null,

  fetchDocuments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchPatientDocuments();
      set({ documents: response.documents, loading: false });
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      set({ error: 'Failed to fetch documents', loading: false });
    }
  },

  getDocument: async (id: string) => {
    set({ error: null });
    try {
      const document = await fetchPatientDocument(id);
      set({ selectedDocument: document });
    } catch (error) {
      console.error('Failed to fetch document details:', error);
      set({ error: 'Failed to fetch document details' });
    }
  },

  uploadDocument: async (file: File, documentType?: string | null) => {
    set({ uploading: true, error: null });
    try {
      // 1. Get presigned URL
      const { presignedUrl, key } = await getPresignedUrl(file.name, file.type, file.size);

      // 2. Upload to R2
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to storage');
      }

      // 3. Confirm upload
      await confirmDocumentUpload({
        key,
        title: file.name,
        type: documentType || 'OTHER',
        mimeType: file.type,
        fileSize: file.size,
        tags: [], // Optional
        description: '', // Optional
      });

      // 4. Refresh documents list
      await get().fetchDocuments();
      
      // Cross-store sync
      usePatientStore.getState().fetchDocuments();
      
      set({ uploading: false });
    } catch (error) {
      console.error('Upload failed:', error);
      set({ error: 'Upload failed', uploading: false });
    }
  },

  viewDocument: async (key: string) => {
    set({ viewingKey: key, error: null });
    try {
      const url = await getFileUrl(key);
      if (url) {
        window.open(url, '_blank');
      } else {
        throw new Error('Received empty URL');
      }
    } catch (error) {
      console.error('Failed to get file URL:', error);
      set({ error: 'Failed to open document' });
    } finally {
      set({ viewingKey: null });
    }
  },

  resetSelected: () => {
    set({ selectedDocument: null, error: null });
  },
}));
