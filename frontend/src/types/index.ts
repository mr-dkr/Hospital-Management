export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'admin';
  password?: string; // Added for authentication
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  bloodGroup?: string;
  address?: string;
  allergies?: string[];
  createdAt: string;
}

export interface Visit {
  id: string;
  patientId: string;
  date: string;
  chiefComplaints: string;
  diagnosis: string;
  medications: Medication[];
  notes?: string;
  followUpDate?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
}

export type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' };

export interface PatientFormData extends Omit<Patient, 'id' | 'createdAt'> {
  allergies: string;
}

export interface VisitFormData extends Omit<Visit, 'id' | 'medications'> {
  medications: string;
}