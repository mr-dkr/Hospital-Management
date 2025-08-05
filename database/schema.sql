-- Hospital Management System Database Schema
-- SQLite Database

-- Users table for authentication and user management
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('doctor', 'admin')) NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Out-patients table
CREATE TABLE out_patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    gender TEXT CHECK(gender IN ('male', 'female', 'other')) NOT NULL,
    date_of_birth DATE NOT NULL,
    blood_group TEXT,
    address TEXT,
    allergies TEXT, -- JSON array stored as text
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    insurance_provider TEXT,
    insurance_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- In-patients table
CREATE TABLE in_patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    gender TEXT CHECK(gender IN ('male', 'female', 'other')) NOT NULL,
    date_of_birth DATE NOT NULL,
    blood_group TEXT,
    address TEXT,
    allergies TEXT, -- JSON array stored as text
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    insurance_provider TEXT,
    insurance_number TEXT,
    admission_date DATETIME NOT NULL,
    discharge_date DATETIME,
    room_number TEXT,
    bed_number TEXT,
    ward_type TEXT CHECK(ward_type IN ('general', 'semi-private', 'private', 'icu', 'emergency')),
    admitting_doctor_id TEXT,
    discharge_doctor_id TEXT,
    admission_diagnosis TEXT,
    discharge_diagnosis TEXT,
    status TEXT CHECK(status IN ('admitted', 'discharged', 'transferred', 'deceased')) DEFAULT 'admitted',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admitting_doctor_id) REFERENCES users(id),
    FOREIGN KEY (discharge_doctor_id) REFERENCES users(id)
);

-- General patients table (for backward compatibility and general patient records)
CREATE TABLE patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    gender TEXT CHECK(gender IN ('male', 'female', 'other')) NOT NULL,
    date_of_birth DATE NOT NULL,
    blood_group TEXT,
    address TEXT,
    allergies TEXT, -- JSON array stored as text
    patient_type TEXT CHECK(patient_type IN ('out-patient', 'in-patient', 'general')) DEFAULT 'general',
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    insurance_provider TEXT,
    insurance_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Out-patient visits table
CREATE TABLE out_patient_visits (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    date DATETIME NOT NULL,
    chief_complaints TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    notes TEXT,
    follow_up_date DATETIME,
    doctor_id TEXT,
    visit_type TEXT CHECK(visit_type IN ('consultation', 'follow-up', 'emergency', 'routine')) DEFAULT 'consultation',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES out_patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- In-patient visits/rounds table
CREATE TABLE in_patient_rounds (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    date DATETIME NOT NULL,
    chief_complaints TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    notes TEXT,
    doctor_id TEXT,
    round_type TEXT CHECK(round_type IN ('morning', 'evening', 'emergency', 'discharge')) DEFAULT 'morning',
    vital_signs TEXT, -- JSON object stored as text
    treatment_plan TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES in_patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- General visits table (for backward compatibility)
CREATE TABLE visits (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    date DATETIME NOT NULL,
    chief_complaints TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    notes TEXT,
    follow_up_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Out-patient medications table
CREATE TABLE out_patient_medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_id TEXT NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration TEXT NOT NULL,
    prescription_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES out_patient_visits(id) ON DELETE CASCADE
);

-- In-patient medications table
CREATE TABLE in_patient_medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    round_id TEXT NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration TEXT NOT NULL,
    route TEXT CHECK(route IN ('oral', 'iv', 'im', 'sc', 'topical', 'inhalation', 'sublingual')) DEFAULT 'oral',
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME,
    status TEXT CHECK(status IN ('active', 'discontinued', 'completed')) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (round_id) REFERENCES in_patient_rounds(id) ON DELETE CASCADE
);

-- General medications table (for backward compatibility)
CREATE TABLE medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_id TEXT NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE
);

-- Out-patient appointments table
CREATE TABLE out_patient_appointments (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    date DATETIME NOT NULL,
    type TEXT CHECK(type IN ('walk-in', 'phone-call', 'video-call')) NOT NULL,
    status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled', 'no-show')) NOT NULL,
    reminder_sent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    doctor_id TEXT,
    appointment_type TEXT CHECK(appointment_type IN ('consultation', 'follow-up', 'emergency', 'routine')) DEFAULT 'consultation',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES out_patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- In-patient admissions table
CREATE TABLE in_patient_admissions (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    admission_date DATETIME NOT NULL,
    expected_discharge_date DATETIME,
    actual_discharge_date DATETIME,
    status TEXT CHECK(status IN ('scheduled', 'admitted', 'discharged', 'cancelled')) NOT NULL,
    admission_type TEXT CHECK(admission_type IN ('emergency', 'elective', 'transfer')) NOT NULL,
    room_number TEXT,
    bed_number TEXT,
    ward_type TEXT CHECK(ward_type IN ('general', 'semi-private', 'private', 'icu', 'emergency')),
    admitting_doctor_id TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES in_patients(id) ON DELETE CASCADE,
    FOREIGN KEY (admitting_doctor_id) REFERENCES users(id)
);

-- General appointments table (for backward compatibility)
CREATE TABLE appointments (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    date DATETIME NOT NULL,
    type TEXT CHECK(type IN ('walk-in', 'phone-call')) NOT NULL,
    status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled')) NOT NULL,
    reminder_sent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Feedback table
CREATE TABLE feedback (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    appointment_id TEXT NOT NULL,
    visit_date DATE NOT NULL,
    rating TEXT CHECK(rating IN ('happy', 'satisfied', 'not-satisfied')) NOT NULL,
    comments TEXT NOT NULL,
    submitted_date DATE NOT NULL,
    category TEXT CHECK(category IN ('service', 'wait-time', 'treatment', 'facilities', 'overall')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

-- Create indexes for better performance

-- Out-patients indexes
CREATE INDEX idx_out_patients_email ON out_patients(email);
CREATE INDEX idx_out_patients_phone ON out_patients(phone);
CREATE INDEX idx_out_patient_visits_patient_id ON out_patient_visits(patient_id);
CREATE INDEX idx_out_patient_visits_date ON out_patient_visits(date);
CREATE INDEX idx_out_patient_medications_visit_id ON out_patient_medications(visit_id);
CREATE INDEX idx_out_patient_appointments_patient_id ON out_patient_appointments(patient_id);
CREATE INDEX idx_out_patient_appointments_date ON out_patient_appointments(date);
CREATE INDEX idx_out_patient_appointments_status ON out_patient_appointments(status);

-- In-patients indexes
CREATE INDEX idx_in_patients_email ON in_patients(email);
CREATE INDEX idx_in_patients_phone ON in_patients(phone);
CREATE INDEX idx_in_patients_admission_date ON in_patients(admission_date);
CREATE INDEX idx_in_patients_status ON in_patients(status);
CREATE INDEX idx_in_patient_rounds_patient_id ON in_patient_rounds(patient_id);
CREATE INDEX idx_in_patient_rounds_date ON in_patient_rounds(date);
CREATE INDEX idx_in_patient_medications_round_id ON in_patient_medications(round_id);
CREATE INDEX idx_in_patient_admissions_patient_id ON in_patient_admissions(patient_id);
CREATE INDEX idx_in_patient_admissions_admission_date ON in_patient_admissions(admission_date);
CREATE INDEX idx_in_patient_admissions_status ON in_patient_admissions(status);

-- General patients indexes (for backward compatibility)
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_visits_patient_id ON visits(patient_id);
CREATE INDEX idx_visits_date ON visits(date);
CREATE INDEX idx_medications_visit_id ON medications(visit_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_feedback_patient_id ON feedback(patient_id);
CREATE INDEX idx_feedback_appointment_id ON feedback(appointment_id); 