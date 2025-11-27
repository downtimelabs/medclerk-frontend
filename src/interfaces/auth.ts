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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends Tokens {
  user: AuthUser;
}

export interface RegisterPatientResponse {
  message: string;
  user: AuthUser;
  verificationToken?: string;
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
