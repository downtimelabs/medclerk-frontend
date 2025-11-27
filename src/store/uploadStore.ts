import { create } from 'zustand';
import type { PatientDocument, PatientDocumentDetails } from '../interfaces/upload';
import {
  getPresignedUrl,
  confirmDocumentUpload,
  fetchPatientDocuments,
  fetchPatientDocument,
} from '../api/upload';
import { usePatientStore } from './patientStore';

interface UploadState {
  uploading: boolean;
  loading: boolean;
  documents: PatientDocument[];
  selectedDocument: PatientDocumentDetails | null;
  error: string | null;

  fetchDocuments: () => Promise<void>;
  getDocument: (id: string) => Promise<void>;
  uploadDocument: (file: File, documentType?: string | null) => Promise<void>;
  resetSelected: () => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  uploading: false,
  loading: false,
  documents: [],
  selectedDocument: null,
  error: null,

  fetchDocuments: async () => {
    set({ loading: true, error: null });
    try {
      const documents = await fetchPatientDocuments();
      // Mock file size and type if missing from API
      const mappedDocs = documents.map((d: any) => ({
          ...d,
          fileSize: d.fileSize || 1024 * 1024, // 1MB mock
          fileType: d.fileType || d.mimeType || 'application/pdf'
      }));
      set({ documents: mappedDocs, loading: false });
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
      const { uploadUrl, objectKey } = await getPresignedUrl(file.name, file.type);

      // 2. Upload to R2
      const uploadResponse = await fetch(uploadUrl, {
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
        objectKey,
        fileName: file.name,
        mimeType: file.type,
        documentType,
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

  resetSelected: () => {
    set({ selectedDocument: null, error: null });
  },
}));
