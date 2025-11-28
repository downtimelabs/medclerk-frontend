import type { Address } from './common';

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: "PATIENT" | "DOCTOR";
  emailVerified: boolean;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterDoctorRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: 'DOCTOR';
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  };
  doctorProfile: {
    licenseNumber: string;
    specialization: string;
    clinicName?: string;
    yearsOfExperience?: number;
    clinicAddress?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      latitude?: number;
      longitude?: number;
    };
  };
}

export interface RegisterDoctorResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    role: 'DOCTOR';
    plan: string;
    createdAt: string;
    updatedAt: string;
    address?: Address;
    doctorProfile: {
      userId: string;
      licenseNumber: string;
      specialization: string;
      clinicName?: string;
      yearsOfExperience?: number;
      clinicAddress?: Address;
    };
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends Tokens {
  user: AuthUser;
}

export interface RegisterPatientResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    role: 'PATIENT';
    plan: string;
    createdAt: string;
    updatedAt: string;
    patientProfile: {
      id: string;
      userId: string;
      age: number | null;
      gender: "MALE" | "FEMALE" | "OTHER" | null;
      bloodGroup: string | null;
      height: number | null;
      weight: number | null;
      knownConditions: string[];
    };
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse extends Tokens {}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    emailVerified: boolean;
  };
}
