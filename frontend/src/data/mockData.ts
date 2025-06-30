import { Patient, Visit, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah@example.com',
    role: 'doctor',
    password: 'password123', // In a real app, this would be hashed
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    password: 'admin123', // In a real app, this would be hashed
  }
];

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '(555) 123-4567',
    email: 'john@example.com',
    gender: 'male',
    dateOfBirth: '1985-05-15',
    bloodGroup: 'O+',
    address: '123 Main St, Anytown, CA 94583',
    allergies: ['Penicillin', 'Peanuts'],
    createdAt: '2023-01-15T09:30:00Z',
  },
  {
    id: '2',
    name: 'Emily Davis',
    phone: '(555) 987-6543',
    email: 'emily@example.com',
    gender: 'female',
    dateOfBirth: '1990-11-28',
    bloodGroup: 'A-',
    address: '456 Oak Ave, Somewhere, NY 10001',
    allergies: [],
    createdAt: '2023-02-20T14:15:00Z',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    phone: '(555) 555-5555',
    email: 'michael@example.com',
    gender: 'male',
    dateOfBirth: '1978-08-03',
    bloodGroup: 'B+',
    address: '789 Pine St, Elsewhere, TX 75001',
    allergies: ['Sulfa drugs'],
    createdAt: '2023-03-10T11:00:00Z',
  },
];

export const mockVisits: Visit[] = [
  {
    id: '1',
    patientId: '1',
    date: '2023-05-15T10:00:00Z',
    chiefComplaints: 'Persistent cough, mild fever for 3 days',
    diagnosis: 'Acute bronchitis',
    medications: [
      {
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '7 days',
      },
      {
        name: 'Guaifenesin',
        dosage: '400mg',
        frequency: 'Every 4 hours as needed',
        duration: '5 days',
      },
    ],
    notes: 'Patient advised to rest and increase fluid intake.',
    followUpDate: '2023-05-22T10:00:00Z',
  },
  {
    id: '2',
    patientId: '1',
    date: '2023-05-22T10:30:00Z',
    chiefComplaints: 'Follow-up for bronchitis, cough improved',
    diagnosis: 'Resolving bronchitis',
    medications: [
      {
        name: 'Guaifenesin',
        dosage: '400mg',
        frequency: 'Every 6 hours as needed',
        duration: '3 days',
      },
    ],
    notes: 'Patient showing improvement. Advised to complete antibiotic course.',
  },
  {
    id: '3',
    patientId: '2',
    date: '2023-06-10T14:00:00Z',
    chiefComplaints: 'Headache, dizziness for 2 days',
    diagnosis: 'Migraine',
    medications: [
      {
        name: 'Sumatriptan',
        dosage: '50mg',
        frequency: 'As needed for migraine, max 2 doses per day',
        duration: 'PRN',
      },
      {
        name: 'Ibuprofen',
        dosage: '600mg',
        frequency: 'Every 6 hours as needed for pain',
        duration: '3 days',
      },
    ],
    notes: 'Patient advised to keep migraine diary and identify triggers.',
    followUpDate: '2023-07-10T14:00:00Z',
  },
];

// Function to simulate authentication
export const authenticate = (email: string, password: string): User | null => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  return user ? { ...user, password: undefined } : null;
};

// Function to simulate getting patients
export const getPatients = (): Patient[] => {
  return [...mockPatients];
};

// Function to simulate getting a patient by ID
export const getPatientById = (id: string): Patient | undefined => {
  return mockPatients.find(patient => patient.id === id);
};

// Function to simulate getting visits for a patient
export const getVisitsByPatientId = (patientId: string): Visit[] => {
  return mockVisits.filter(visit => visit.patientId === patientId);
};

// Function to simulate adding a new patient
export const addPatient = (patient: Omit<Patient, 'id' | 'createdAt'>): Patient => {
  const newPatient: Patient = {
    ...patient,
    id: String(mockPatients.length + 1),
    createdAt: new Date().toISOString(),
  };
  mockPatients.push(newPatient);
  return newPatient;
};

// Function to simulate adding a visit
export const addVisit = (visit: Omit<Visit, 'id'>): Visit => {
  const newVisit: Visit = {
    ...visit,
    id: String(mockVisits.length + 1),
  };
  mockVisits.push(newVisit);
  return newVisit;
};