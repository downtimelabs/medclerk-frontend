// A minimal doctor returned from /available-doctors
export interface DoctorInfo {
  id: string;
  name: string;
  specialization: string | null;
  avatarUrl: string | null;
}

// Active linked doctor
export interface LinkedDoctor {
  id: string;
  doctorId: string;
  doctor: DoctorInfo;
  // Flattened properties for easier access in UI
  doctorName: string;
  doctorProfile?: {
    specialization: string;
    clinicName?: string;
    clinicAddress?: string;
    experienceYears?: number;
  };
  status: "ACTIVE";
}

// Pending request (patient → doctor)
export interface PatientDoctorRequest {
  id: string;
  doctor: DoctorInfo;
  // Flattened properties
  doctorName: string;
  doctorProfile?: {
    specialization: string;
  };
  status: "PENDING";
  createdAt: string;
}

// Pending request (doctor → patient)
export interface DoctorPatientRequest {
  id: string;
  patientId: string;
  patientName: string;
  status: "PENDING";
  createdAt: string;
}

// Request to initiate doctor link
export interface RequestDoctorLinkPayload {
  doctorId: string;
}
