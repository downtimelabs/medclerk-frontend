export interface Address {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  latitude?: number | null;  // -90 to 90
  longitude?: number | null; // -180 to 180
}

export interface APIResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
}
