export interface PatientHealthProfile {
  age: number | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  bloodGroup: string | null;
  height: number | null;
  weight: number | null;
  knownConditions: string[];
  // Added properties
  dateOfBirth?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: {
      name: string;
      phoneNumber: string;
      email?: string;
      relation?: string;
  };
}

export interface PatientProfile {
  id: string;
  name: string | null;
  email: string;
  role: "PATIENT";
  patientProfile: PatientHealthProfile;
  // Added properties
  phoneNumber?: string;
  avatar?: string;
  address?: {
      country: string;
      state: string;
  };
}

export interface UpdatePatientProfilePayload {
  age?: number | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  bloodGroup?: string | null;
  height?: number | null;
  weight?: number | null;
  knownConditions?: string[];
}

export interface PatientStats {
  totalDocuments: number;
  linkedDoctors: number;
  pendingRequests: number;
}
