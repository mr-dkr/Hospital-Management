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
  date_of_birth: string;
  blood_group?: string;
  address?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  insurance_provider?: string;
  insurance_number?: string;
  created_at: string;
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
export interface Feedback {
  id: string;
  patient_id: string;
  patient_name: string;
  appointment_id: string;
  visit_date: string;
  rating: 'happy' | 'satisfied' | 'not-satisfied';
  comments: string;
  submitted_date: string;
  category: 'service' | 'wait-time' | 'treatment' | 'facilities' | 'overall';
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  date: string;
  type: 'walk-in' | 'phone-call' | 'video-call';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reminder_sent: boolean;
  notes?: string;
  doctor_id?: string;
  appointment_type: 'consultation' | 'follow-up' | 'emergency' | 'routine';
  created_at: string;
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

export interface AppointmentFormData {
  patientId?: string;
  newPatient?: {
    name: string;
    phone: string;
    email?: string;
  };
  date: string;
  time: string;
  type: 'walk-in' | 'phone-call';
  notes?: string;
}