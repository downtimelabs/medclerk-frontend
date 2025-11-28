import type { Address } from './common';

export interface UpdateDoctorPersonalInfo {
  name?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  avatarUrl?: string;
  countryCode?: string;
  address?: Address;
}

export interface UpdateDoctorProfessionalInfo {
  specialization?: string;
  licenseNumber?: string;
  clinicName?: string;
  yearsOfExperience?: number;
  clinicAddress?: Address;
}

export interface CompleteDoctorProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: 'DOCTOR';
  plan: string;
  avatarUrl?: string;
  countryCode?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  address?: Address;
  createdAt: string; // Changed to string for frontend compatibility
  updatedAt: string; // Changed to string for frontend compatibility
  profile: {
    specialization: string;
    licenseNumber: string;
    clinicName?: string;
    yearsOfExperience?: number;
    clinicAddress?: Address;
    profileCreatedAt: string; // Changed to string for frontend compatibility
    profileUpdatedAt: string; // Changed to string for frontend compatibility
  };
}

export interface GetDoctorPatientsQuery {
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  sortBy?: 'linkedAt' | 'name' | 'status';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface SearchDoctorPatientsQuery {
  q: string;
  limit?: number;
  offset?: number;
}

export interface PatientInfo {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  country?: string;
  state?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  linkedAt: string; // Changed to string
}

export interface PatientsListResponse {
  patients: PatientInfo[];
  total: number;
  hasMore: boolean;
}

export interface DoctorStats {
  patients: {
    total: number;
    active: number;
  };
}

export interface Document {
  id: string;
  title: string;
  type: 'PRESCRIPTION' | 'LAB_RESULT' | 'MEDICAL_RECORD' | 'IMAGE' | 'OTHER';
  objectKey: string;
  fileUrl?: string;
  tags: string[];
  ownerId: string;
  uploaderId: string;
  createdAt: string; // Changed to string
  updatedAt: string; // Changed to string
  owner: {
    id: string;
    name: string;
    email: string;
  };
  uploader: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  ocrJobs?: Array<{
    id: string;
    status: string;
    extractedAt?: string; // Changed to string
    text?: string;
    error?: string;
  }>;
}

export interface DocumentsResponse {
  documents: Document[];
  total: number;
  hasMore: boolean;
}

export interface GetPatientDocumentsQuery {
  type?: 'PRESCRIPTION' | 'LAB_RESULT' | 'MEDICAL_RECORD' | 'IMAGE' | 'OTHER';
  tags?: string | string[];
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface RAGQuery {
  question: string;
}

export interface RAGResponse {
  answer: string;
  sources: string[];
}

export interface LinkRequest {
  id: string;
  patientId: string;
  doctorId: string;
  status: string;
  createdAt: string; // Changed to string
  updatedAt: string; // Changed to string
  patient?: {
    id: string;
    name: string;
    email: string;
  };
}
