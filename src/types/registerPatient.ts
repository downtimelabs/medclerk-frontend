export interface RegisterPatientRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "PATIENT";
  patientProfile: {
    dob?: Date;
    bloodGroup?: string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    chronicConditions: string[];
  };
}
