import { Patient, Visit, User, Appointment, Feedback } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Murugesh Kumar',
    email: 'murugesh@example.com',
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
    name: 'Murugesh Kumar',
    phone: '7708787590',
    email: 'murugesh@example.com',
    gender: 'male',
    dateOfBirth: '1982-03-20',
    bloodGroup: 'B+',
    address: 'Chennai, Tamil Nadu',
    allergies: [],
    createdAt: '2023-04-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Jeyaseelan V',
    phone: '9944411950',
    email: 'jeyaseelan@example.com',
    gender: 'male',
    dateOfBirth: '1975-08-12',
    bloodGroup: 'O+',
    address: 'Coimbatore, Tamil Nadu',
    allergies: ['Aspirin'],
    createdAt: '2023-04-02T11:30:00Z',
  },
  {
    id: '3',
    name: 'Nirmal Raj',
    phone: '9840116889',
    email: 'nirmal@example.com',
    gender: 'male',
    dateOfBirth: '1988-12-05',
    bloodGroup: 'A+',
    address: 'Madurai, Tamil Nadu',
    allergies: [],
    createdAt: '2023-04-03T14:20:00Z',
  },
  {
    id: '4',
    name: 'Divakar Thambidurai',
    phone: '8973983311',
    email: 'divakar@example.com',
    gender: 'male',
    dateOfBirth: '1980-06-18',
    bloodGroup: 'AB+',
    address: 'Salem, Tamil Nadu',
    allergies: ['Penicillin'],
    createdAt: '2023-04-04T16:45:00Z',
  },
    {
    id: '5',
    name: 'Priya Lakshmi',
    phone: '9876543215',
    email: 'priya.lakshmi@gmail.com',
    dateOfBirth: '1988-11-25',
    gender: 'female',
    address: '654 Mylapore, Chennai, Tamil Nadu',
    allergies: ['Latex'],
    createdAt: '2023-05-12'
  },
  {
    id: '6',
    name: 'Rajesh Kannan',
    phone: '8765432109',
    email: 'rajesh.kannan@gmail.com',
    dateOfBirth: '1995-09-30',
    gender: 'male',
    address: '987 Tambaram, Chennai, Tamil Nadu',
    createdAt: '2023-06-18'
  }
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

// Generate appointments for yesterday, today, and tomorrow
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const mockAppointments: Appointment[] = [
  // Yesterday's appointments
  {
    id: 'apt-1',
    patientId: '4',
    date: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 9, 0).toISOString(),
    type: 'walk-in',
    status: 'completed',
    reminderSent: true,
    notes: 'Regular checkup',
  },
  {
    id: 'apt-2',
    patientId: '5',
    date: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 11, 30).toISOString(),
    type: 'phone-call',
    status: 'completed',
    reminderSent: true,
    notes: 'Follow-up consultation',
  },
  {
    id: 'apt-3',
    patientId: '6',
    date: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 14, 0).toISOString(),
    type: 'walk-in',
    status: 'completed',
    reminderSent: false,
    notes: 'Emergency visit',
  },

  // Today's appointments

  {
    id: 'apt-5',
    patientId: '1',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0).toISOString(),
    type: 'phone-call',
    status: 'scheduled',
    reminderSent: false,
    notes: 'Medication review',
  },
  {
    id: 'apt-6',
    patientId: '2',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30).toISOString(),
    type: 'walk-in',
    status: 'scheduled',
    reminderSent: true,
    notes: 'Follow-up visit',
  },
  {
    id: 'apt-7',
    patientId: '4',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 45).toISOString(),
    type: 'phone-call',
    status: 'scheduled',
    reminderSent: false,
    notes: 'Consultation',
  },
    {
    id: 'apt-8',
    patientId: '3',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 45).toISOString(),
    type: 'walk-in',
    status: 'scheduled',
    reminderSent: false,
    notes: 'Consultation',
  },


  // Tomorrow's appointments
  {
    id: 'apt-8',
    patientId: '4',
    date: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 0).toISOString(),
    type: 'walk-in',
    status: 'scheduled',
    reminderSent: false,
    notes: 'Blood test results review',
  },
  {
    id: 'apt-9',
    patientId: '2',
    date: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 13, 30).toISOString(),
    type: 'phone-call',
    status: 'scheduled',
    reminderSent: false,
    notes: 'Prescription renewal',
  },
  {
    id: 'apt-10',
    patientId: '6',
    date: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 16, 0).toISOString(),
    type: 'walk-in',
    status: 'scheduled',
    reminderSent: false,
    notes: 'Physical therapy consultation',
  },
];

export const mockFeedback: Feedback[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Murugesh Kumar',
    appointmentId: '1',
    visitDate: '2024-01-15',
    rating: 'happy',
    comments: 'Dr. Murugesh Kumar was very thorough and explained everything clearly. The treatment has been very effective.',
    submittedDate: '2024-01-16',
    category: 'treatment'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Jeyaseelan V',
    appointmentId: '2',
    visitDate: '2024-01-10',
    rating: 'satisfied',
    comments: 'Good consultation, but had to wait longer than expected. The phone consultation was convenient.',
    submittedDate: '2024-01-11',
    category: 'wait-time'
  },
  {
    id: '3',
    patientId: '4',
    patientName: 'Divakar Thambidurai',
    appointmentId: '4',
    visitDate: '2024-01-08',
    rating: 'happy',
    comments: 'Excellent service and very professional staff. The migraine treatment worked perfectly.',
    submittedDate: '2024-01-09',
    category: 'overall'
  },
  {
    id: '4',
    patientId: '3',
    patientName: 'Nirmal Raj',
    appointmentId: '3',
    visitDate: '2024-01-05',
    rating: 'not-satisfied',
    comments: 'The waiting area was crowded and the appointment was delayed by 45 minutes. Need better time management.',
    submittedDate: '2024-01-06',
    category: 'service'
  }
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

export const getFeedback = (): Feedback[] => {
  return [...mockFeedback];
};

// Function to get appointments
export const getAppointments = (): Appointment[] => {
  return [...mockAppointments];
};

// Function to get appointments by date
export const getAppointmentsByDate = (date: Date): Appointment[] => {
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return mockAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const appointmentDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());
    return appointmentDateOnly.getTime() === targetDate.getTime();
  });
};

// Function to add appointment
export const addAppointment = (appointment: Omit<Appointment, 'id'>): Appointment => {
  const newAppointment: Appointment = {
    ...appointment,
    id: `apt-${mockAppointments.length + 1}`,
  };
  mockAppointments.push(newAppointment);
  return newAppointment;
};

// Function to update appointment reminder status
export const updateAppointmentReminderStatus = (appointmentId: string): void => {
  const appointment = mockAppointments.find(apt => apt.id === appointmentId);
  if (appointment) {
    appointment.reminderSent = true;
  }
};

// Function to get today's appointments
export const getTodaysAppointments = (): Appointment[] => {
  return getAppointmentsByDate(new Date());
};