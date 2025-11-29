// A minimal doctor returned from /available-doctors
export interface DoctorInfo {
  id: string;
  name: string;
  specialization: string | null;
  avatarUrl: string | null;
}

// Active linked doctor
export interface LinkedDoctor {
  id: string; // Doctor ID
  linkId: string;
  name: string;
  email: string;
  specialization: string;
  licenseNumber?: string;
  clinicName?: string;
  yearsOfExperience?: number;
  status: "ACTIVE";
  linkedAt: string;
}

// Pending request (patient → doctor)
// Pending request (patient → doctor)
export interface PatientDoctorRequest {
  id: string; // Link ID
  patientId: string;
  doctorId: string;
  status: "PENDING";
  createdAt: string;
  doctor: {
    name: string;
    email: string;
    specialization: string;
    clinicName?: string;
  };
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
