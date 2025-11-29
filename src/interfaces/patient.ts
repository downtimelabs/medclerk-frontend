export interface PatientHealthProfile {
  dob?: string;
  bloodGroup: string | null;
  heightCm: number | null;
  weightKg: number | null;
  allergies: string | null;
  chronicConditions: string[];
  emergencyContact?: {
      name: string;
      phone: string;
      email?: string;
  };
}

export interface PatientProfile {
  personal: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: "PATIENT";
    createdAt: string;
    updatedAt: string;
    phoneNumber?: string;
    avatarUrl?: string;
    country?: string;
    state?: string;
  };
  medical: {
    bloodGroup: string | null;
    chronicConditions: string[];
    profileCreatedAt: string;
    profileUpdatedAt: string;
    dob?: string;
    heightCm?: number;
    weightKg?: number;
    allergies?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      email?: string;
    };
  };
  careTeam: {
    doctors: any[];
    caregivers: any[];
  };
  documentStats: {
    totalDocuments: number;
    documentsByType: Record<string, number>;
    recentUploads: number;
    totalFileSize: number;
  };
}

export interface PatientPersonalUpdatePayload {
  name?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  avatarUrl?: string;
}

export interface PatientMedicalUpdatePayload {
  dob?: string; // ISO datetime string
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  heightCm?: number;
  weightKg?: number;
  allergies?: string;
  chronicConditions?: string[];
  emergencyContact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export interface PatientStats {
  totalDocuments: number;
  linkedDoctors: number;
  pendingRequests: number;
}
