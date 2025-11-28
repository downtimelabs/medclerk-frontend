import type { Address } from './common';

export interface PublicDoctorProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  country?: string;
  state?: string;
  address?: Address;
  profile: {
    specialization: string;
    licenseNumber: string;
    clinicName?: string;
    yearsOfExperience?: number;
    clinicAddress?: Address;
  };
}

export interface SearchDoctorsQuery {
  specialization?: string;
  location?: string;
  name?: string;
  sortBy?: 'name' | 'specialization' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface AdvancedSearchBody {
  specialization?: string;
  location?: string;
  name?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'specialization' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface DoctorSearchResponse {
  doctors: PublicDoctorProfile[];
  total: number;
  hasMore: boolean;
}

export interface SpecializationsResponse {
  specializations: string[];
  total: number;
}

export interface PopularSpecializationsResponse {
  specializations: Array<{
    name: string;
    count: number;
  }>;
  total: number;
}
