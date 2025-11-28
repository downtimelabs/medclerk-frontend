import api from '../lib/axios';
import type { APIResponse } from '../interfaces/common';
import type {
  SearchDoctorsQuery,
  AdvancedSearchBody,
  DoctorSearchResponse,
  SpecializationsResponse,
  PopularSpecializationsResponse,
  PublicDoctorProfile,
} from '../interfaces/discovery';

// 1. Search doctors with filters
export async function searchDoctors(query: SearchDoctorsQuery): Promise<DoctorSearchResponse> {
  const response = await api.get<APIResponse<DoctorSearchResponse>>('/doctors', {
    params: query,
  });
  return response.data.data;
}

// 2. Get all available specializations
export async function getSpecializations(): Promise<SpecializationsResponse> {
  const response = await api.get<APIResponse<SpecializationsResponse>>('/available-doctors/specializations');
  return response.data.data;
}

// 3. Get popular specializations
export async function getPopularSpecializations(limit: number = 10): Promise<PopularSpecializationsResponse> {
  const response = await api.get<APIResponse<PopularSpecializationsResponse>>('/available-doctors/specializations/popular', {
    params: { limit },
  });
  return response.data.data;
}

// 4. Get doctors by specific specialization
export async function getDoctorsBySpecialization(
  specialization: string,
  limit: number = 20,
  offset: number = 0
): Promise<DoctorSearchResponse> {
  const response = await api.get<APIResponse<DoctorSearchResponse>>(`/available-doctors/specialization/${encodeURIComponent(specialization)}`, {
    params: { limit, offset },
  });
  return response.data.data;
}

// 5. Get doctors by location
export async function getDoctorsByLocation(
  location: string,
  limit: number = 20,
  offset: number = 0
): Promise<DoctorSearchResponse> {
  const response = await api.get<APIResponse<DoctorSearchResponse>>(`/available-doctors/location/${encodeURIComponent(location)}`, {
    params: { limit, offset },
  });
  return response.data.data;
}

// 6. Advanced search with complex filters
export async function advancedSearchDoctors(body: AdvancedSearchBody): Promise<DoctorSearchResponse> {
  const response = await api.post<APIResponse<DoctorSearchResponse>>('/available-doctors/search', body);
  return response.data.data;
}

// 7. Get detailed doctor profile
export async function getPublicDoctorProfile(doctorId: string): Promise<PublicDoctorProfile> {
  const response = await api.get<APIResponse<PublicDoctorProfile>>(`/available-doctors/${doctorId}`);
  return response.data.data;
}
