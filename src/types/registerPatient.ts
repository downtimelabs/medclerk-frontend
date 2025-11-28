export interface RegisterPatientRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "PATIENT";
  patientProfile: {
    age: number | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    bloodGroup: string | null;
    height: number | null;
    weight: number | null;
    knownConditions: string[];
  };
}
