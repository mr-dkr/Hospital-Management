import { API_BASE_URL, API_ENDPOINTS, getHeaders } from './config';

export interface OutPatient {
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

export interface InPatient {
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
  admission_date: string;
  discharge_date?: string;
  room_number?: string;
  bed_number?: string;
  ward_type?: 'general' | 'semi-private' | 'private' | 'icu' | 'emergency';
  admitting_doctor_id?: string;
  discharge_doctor_id?: string;
  admission_diagnosis?: string;
  discharge_diagnosis?: string;
  status: 'admitted' | 'discharged' | 'transferred' | 'deceased';
  created_at: string;
}

export interface CreateOutPatientRequest {
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
}

export interface CreateInPatientRequest {
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
  admission_date: string;
  discharge_date?: string;
  room_number?: string;
  bed_number?: string;
  ward_type?: 'general' | 'semi-private' | 'private' | 'icu' | 'emergency';
  admitting_doctor_id?: string;
  discharge_doctor_id?: string;
  admission_diagnosis?: string;
  discharge_diagnosis?: string;
  status?: 'admitted' | 'discharged' | 'transferred' | 'deceased';
}

class PatientsAPI {
  private baseUrl = API_BASE_URL;

  // Out Patients
  async getOutPatients(token: string): Promise<OutPatient[]> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.OUT_PATIENTS.LIST}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch out-patients');
    }

    return response.json();
  }

  async getOutPatient(id: string, token: string): Promise<OutPatient> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.OUT_PATIENTS.DETAIL(id)}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch out-patient');
    }

    return response.json();
  }

  async createOutPatient(data: CreateOutPatientRequest, token: string): Promise<OutPatient> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.OUT_PATIENTS.CREATE}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create out-patient');
    }

    return response.json();
  }

  async updateOutPatient(id: string, data: Partial<CreateOutPatientRequest>, token: string): Promise<OutPatient> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.OUT_PATIENTS.UPDATE(id)}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update out-patient');
    }

    return response.json();
  }

  async deleteOutPatient(id: string, token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.OUT_PATIENTS.DELETE(id)}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to delete out-patient');
    }
  }

  // In Patients
  async getInPatients(token: string): Promise<InPatient[]> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.IN_PATIENTS.LIST}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch in-patients');
    }

    return response.json();
  }

  async getAdmittedPatients(token: string): Promise<InPatient[]> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.IN_PATIENTS.ADMITTED}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch admitted patients');
    }

    return response.json();
  }

  async getInPatient(id: string, token: string): Promise<InPatient> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.IN_PATIENTS.DETAIL(id)}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch in-patient');
    }

    return response.json();
  }

  async createInPatient(data: CreateInPatientRequest, token: string): Promise<InPatient> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.IN_PATIENTS.CREATE}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create in-patient');
    }

    return response.json();
  }

  async updateInPatient(id: string, data: Partial<CreateInPatientRequest>, token: string): Promise<InPatient> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.IN_PATIENTS.UPDATE(id)}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update in-patient');
    }

    return response.json();
  }

  async dischargeInPatient(id: string, token: string): Promise<InPatient> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.IN_PATIENTS.DISCHARGE(id)}`, {
      method: 'POST',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to discharge in-patient');
    }

    return response.json();
  }

  async deleteInPatient(id: string, token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.IN_PATIENTS.DELETE(id)}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to delete in-patient');
    }
  }
}

export const patientsAPI = new PatientsAPI();