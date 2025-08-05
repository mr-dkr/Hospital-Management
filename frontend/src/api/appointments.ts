import { API_BASE_URL, API_ENDPOINTS, getHeaders } from './config';

export interface OutPatientAppointment {
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

export interface InPatientAdmission {
  id: string;
  patient_id: string;
  admission_date: string;
  expected_discharge_date?: string;
  actual_discharge_date?: string;
  status: 'scheduled' | 'admitted' | 'discharged' | 'cancelled';
  admission_type: 'emergency' | 'elective' | 'transfer';
  room_number?: string;
  bed_number?: string;
  ward_type?: 'general' | 'semi-private' | 'private' | 'icu' | 'emergency';
  admitting_doctor_id?: string;
  notes?: string;
  created_at: string;
}

export interface CreateOutPatientAppointmentRequest {
  patient_id: string;
  date: string;
  type: 'walk-in' | 'phone-call' | 'video-call';
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reminder_sent?: boolean;
  notes?: string;
  doctor_id?: string;
  appointment_type?: 'consultation' | 'follow-up' | 'emergency' | 'routine';
}

export interface CreateInPatientAdmissionRequest {
  patient_id: string;
  admission_date: string;
  expected_discharge_date?: string;
  actual_discharge_date?: string;
  status?: 'scheduled' | 'admitted' | 'discharged' | 'cancelled';
  admission_type: 'emergency' | 'elective' | 'transfer';
  room_number?: string;
  bed_number?: string;
  ward_type?: 'general' | 'semi-private' | 'private' | 'icu' | 'emergency';
  admitting_doctor_id?: string;
  notes?: string;
}

class AppointmentsAPI {
  private baseUrl = API_BASE_URL;

  // Out Patient Appointments
  async getOutPatientAppointments(token: string): Promise<OutPatientAppointment[]> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.OUT_PATIENTS.LIST}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch out-patient appointments');
    }

    return response.json();
  }

  async getTodayOutPatientAppointments(token: string): Promise<OutPatientAppointment[]> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.OUT_PATIENTS.TODAY}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch today\'s out-patient appointments');
    }

    return response.json();
  }

  async getOutPatientAppointment(id: string, token: string): Promise<OutPatientAppointment> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.OUT_PATIENTS.DETAIL(id)}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch out-patient appointment');
    }

    return response.json();
  }

  async createOutPatientAppointment(data: CreateOutPatientAppointmentRequest, token: string): Promise<OutPatientAppointment> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.OUT_PATIENTS.CREATE}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create out-patient appointment');
    }

    return response.json();
  }

  async updateOutPatientAppointment(id: string, data: Partial<CreateOutPatientAppointmentRequest>, token: string): Promise<OutPatientAppointment> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.OUT_PATIENTS.UPDATE(id)}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update out-patient appointment');
    }

    return response.json();
  }

  async cancelOutPatientAppointment(id: string, token: string): Promise<OutPatientAppointment> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.OUT_PATIENTS.CANCEL(id)}`, {
      method: 'POST',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel out-patient appointment');
    }

    return response.json();
  }

  async deleteOutPatientAppointment(id: string, token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.OUT_PATIENTS.DELETE(id)}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to delete out-patient appointment');
    }
  }

  // In Patient Admissions
  async getInPatientAdmissions(token: string): Promise<InPatientAdmission[]> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.IN_PATIENTS.LIST}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch in-patient admissions');
    }

    return response.json();
  }

  async getActiveInPatientAdmissions(token: string): Promise<InPatientAdmission[]> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.IN_PATIENTS.ACTIVE}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch active in-patient admissions');
    }

    return response.json();
  }

  async getInPatientAdmission(id: string, token: string): Promise<InPatientAdmission> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.IN_PATIENTS.DETAIL(id)}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch in-patient admission');
    }

    return response.json();
  }

  async createInPatientAdmission(data: CreateInPatientAdmissionRequest, token: string): Promise<InPatientAdmission> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.IN_PATIENTS.CREATE}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create in-patient admission');
    }

    return response.json();
  }

  async updateInPatientAdmission(id: string, data: Partial<CreateInPatientAdmissionRequest>, token: string): Promise<InPatientAdmission> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.IN_PATIENTS.UPDATE(id)}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update in-patient admission');
    }

    return response.json();
  }

  async dischargeInPatientAdmission(id: string, token: string): Promise<InPatientAdmission> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.IN_PATIENTS.DISCHARGE(id)}`, {
      method: 'POST',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to discharge in-patient admission');
    }

    return response.json();
  }

  async deleteInPatientAdmission(id: string, token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.APPOINTMENTS.IN_PATIENTS.DELETE(id)}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to delete in-patient admission');
    }
  }
}

export const appointmentsAPI = new AppointmentsAPI();