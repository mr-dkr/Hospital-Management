 // API Configuration
export const API_BASE_URL = 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/token',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  // Users
  USERS: {
    LIST: '/users/',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users/',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  // Out Patients
  OUT_PATIENTS: {
    LIST: '/out-patients/',
    DETAIL: (id: string) => `/out-patients/${id}`,
    CREATE: '/out-patients/',
    UPDATE: (id: string) => `/out-patients/${id}`,
    DELETE: (id: string) => `/out-patients/${id}`,
  },
  // In Patients
  IN_PATIENTS: {
    LIST: '/in-patients/',
    ADMITTED: '/in-patients/admitted',
    DETAIL: (id: string) => `/in-patients/${id}`,
    CREATE: '/in-patients/',
    UPDATE: (id: string) => `/in-patients/${id}`,
    DISCHARGE: (id: string) => `/in-patients/${id}/discharge`,
    DELETE: (id: string) => `/in-patients/${id}`,
  },
  // Appointments
  APPOINTMENTS: {
    OUT_PATIENTS: {
      LIST: '/appointments/out-patients',
      TODAY: '/appointments/out-patients/today',
      DETAIL: (id: string) => `/appointments/out-patients/${id}`,
      CREATE: '/appointments/out-patients',
      UPDATE: (id: string) => `/appointments/out-patients/${id}`,
      CANCEL: (id: string) => `/appointments/out-patients/${id}/cancel`,
      DELETE: (id: string) => `/appointments/out-patients/${id}`,
    },
    IN_PATIENTS: {
      LIST: '/appointments/in-patients',
      ACTIVE: '/appointments/in-patients/active',
      DETAIL: (id: string) => `/appointments/in-patients/${id}`,
      CREATE: '/appointments/in-patients',
      UPDATE: (id: string) => `/appointments/in-patients/${id}`,
      DISCHARGE: (id: string) => `/appointments/in-patients/${id}/discharge`,
      DELETE: (id: string) => `/appointments/in-patients/${id}`,
    },
  },
  // Feedback
  FEEDBACK: {
    LIST: '/feedback/',
    DETAIL: (id: string) => `/feedback/${id}`,
    CREATE: '/feedback/',
    UPDATE: (id: string) => `/feedback/${id}`,
    DELETE: (id: string) => `/feedback/${id}`,
  },
};

// Common headers
export const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}