export interface DoctorProfessionalInfo {
  specialization: string | null;
  experienceYears: number | null;
  clinicName: string | null;
  clinicAddress: string | null;
}

export interface DoctorPersonalInfo {
  name: string | null;
  phone: string | null;
  bio: string | null;
}

export interface DoctorProfile {
  id: string;
  name: string | null;
  email: string;
  role: "DOCTOR";
  doctorProfile: DoctorProfessionalInfo & DoctorPersonalInfo;
}

export interface UpdateDoctorPersonalPayload {
  name?: string;
  phone?: string | null;
  bio?: string | null;
}

export interface UpdateDoctorProfessionalPayload {
  specialization?: string | null;
  experienceYears?: number | null;
  clinicName?: string | null;
  clinicAddress?: string | null;
}

export interface DoctorStats {
  linkedPatients: number;
  pendingRequests: number;
  documentsAccessible: number;
}

export interface LinkedPatient {
  id: string;
  patientId: string;
  patientName: string;
  patientProfile: {
    age: number | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
  };
  status: "ACTIVE";
}

export interface PendingPatientRequest {
  id: string;
  patientId: string;
  patientName: string;
  createdAt: string;
  status: "PENDING";
}
