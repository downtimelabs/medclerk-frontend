import api from '../lib/axios';
import type {
  LoginRequest,
  LoginResponse,
  RegisterPatientResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  AuthStatusResponse,
} from '../interfaces/auth';
import type { RegisterPatientRequest } from '../types/registerPatient';

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', data);
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
