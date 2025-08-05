import { API_BASE_URL, API_ENDPOINTS, getHeaders } from './config';

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

export interface CreateFeedbackRequest {
  patient_id: string;
  patient_name: string;
  appointment_id: string;
  visit_date: string;
  rating: 'happy' | 'satisfied' | 'not-satisfied';
  comments: string;
  submitted_date: string;
  category: 'service' | 'wait-time' | 'treatment' | 'facilities' | 'overall';
}

export interface UpdateFeedbackRequest {
  patient_name?: string;
  visit_date?: string;
  rating?: 'happy' | 'satisfied' | 'not-satisfied';
  comments?: string;
  submitted_date?: string;
  category?: 'service' | 'wait-time' | 'treatment' | 'facilities' | 'overall';
}

class FeedbackAPI {
  private baseUrl = API_BASE_URL;

  async getFeedbacks(token: string): Promise<Feedback[]> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.FEEDBACK.LIST}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedbacks');
    }

    return response.json();
  }

  async getFeedback(id: string, token: string): Promise<Feedback> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.FEEDBACK.DETAIL(id)}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    return response.json();
  }

  async createFeedback(data: CreateFeedbackRequest, token: string): Promise<Feedback> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.FEEDBACK.CREATE}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create feedback');
    }

    return response.json();
  }

  async updateFeedback(id: string, data: UpdateFeedbackRequest, token: string): Promise<Feedback> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.FEEDBACK.UPDATE(id)}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update feedback');
    }

    return response.json();
  }

  async deleteFeedback(id: string, token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.FEEDBACK.DELETE(id)}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to delete feedback');
    }
  }
}

export const feedbackAPI = new FeedbackAPI();