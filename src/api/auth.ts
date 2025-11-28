import api from '../lib/axios';
import type { APIResponse } from '../interfaces/common';
import type {
  LoginRequest,
  LoginResponse,
  RegisterPatientResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  AuthStatusResponse,
  RegisterDoctorRequest,
  RegisterDoctorResponse,
} from '../interfaces/auth';
import type { RegisterPatientRequest } from '../types/registerPatient';

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<APIResponse<LoginResponse>>('/auth/login', data);
  return response.data.data;
}

export async function registerDoctorApi(data: RegisterDoctorRequest): Promise<RegisterDoctorResponse> {
  const response = await api.post<RegisterDoctorResponse>('/auth/register', data);
  // The register endpoint seems to return the wrapper too based on the user's previous message
  // "Success Response (201) ... data: { ... }"
  // But wait, the user's previous message for register showed:
  // { "statusCode": 201, "message": ..., "data": { ... } }
  // And RegisterDoctorResponse in interfaces/auth.ts was defined to MATCH that wrapper structure?
  // Let's check interfaces/auth.ts content from previous steps.
  // If RegisterDoctorResponse ALREADY includes statusCode/message/data, then we DON'T unwrap it if we want to return that whole object.
  // BUT, consistency suggests we should probably return the inner data or the wrapper consistently.
  // However, the interface RegisterDoctorResponse was defined as:
  // export interface RegisterDoctorResponse { statusCode: number; message: string; data: { ... } }
  // So for registerDoctorApi, returning response.data is correct IF RegisterDoctorResponse is the wrapper.
  return response.data;
}

export async function registerPatientApi(data: RegisterPatientRequest): Promise<RegisterPatientResponse> {
  const response = await api.post<RegisterPatientResponse>('/auth/register', data);
  return response.data;
}

export async function refreshTokenApi(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  const response = await api.post<RefreshTokenResponse>('/auth/refresh-token', data);
  return response.data;
}

export async function logoutApi(data: LogoutRequest): Promise<LogoutResponse> {
  const response = await api.post<LogoutResponse>('/auth/logout', data);
  return response.data;
}

export async function getAuthStatusApi(): Promise<AuthStatusResponse> {
  const response = await api.get<AuthStatusResponse>('/auth/profile');
  return response.data;
}
