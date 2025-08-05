-- Sample Data for Hospital Management System
-- This file contains sample data based on the mock data from the frontend

-- Insert sample users
INSERT INTO users (id, name, email, role, password) VALUES
('1', 'Dr. Murugesh Kumar', 'murugesh@example.com', 'doctor', 'password123'),
('2', 'Admin User', 'admin@example.com', 'admin', 'admin123');

-- Insert sample out-patients
INSERT INTO out_patients (id, name, phone, email, gender, date_of_birth, blood_group, address, allergies, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_number, created_at) VALUES
('op-1', 'Murugesh Kumar', '7708787590', 'murugesh@example.com', 'male', '1982-03-20', 'B+', 'Chennai, Tamil Nadu', '[]', 'Lakshmi Kumar', '7708787591', 'Star Health', 'STAR123456', '2023-04-01T10:00:00Z'),
('op-2', 'Jeyaseelan V', '9944411950', 'jeyaseelan@example.com', 'male', '1975-08-12', 'O+', 'Coimbatore, Tamil Nadu', '["Aspirin"]', 'Meena Jeyaseelan', '9944411951', 'ICICI Lombard', 'ICICI789012', '2023-04-02T11:30:00Z'),
('op-3', 'Priya Lakshmi', '9876543215', 'priya.lakshmi@gmail.com', 'female', '1988-11-25', 'A+', '654 Mylapore, Chennai, Tamil Nadu', '["Latex"]', 'Ramesh Lakshmi', '9876543216', 'Bajaj Allianz', 'BAJAJ345678', '2023-05-12T00:00:00Z'),
('op-4', 'Rajesh Kannan', '8765432109', 'rajesh.kannan@gmail.com', 'male', '1995-09-30', 'O-', '987 Tambaram, Chennai, Tamil Nadu', '[]', 'Sita Kannan', '8765432110', 'HDFC ERGO', 'HDFC901234', '2023-06-18T00:00:00Z');

-- Insert sample in-patients
INSERT INTO in_patients (id, name, phone, email, gender, date_of_birth, blood_group, address, allergies, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_number, admission_date, discharge_date, room_number, bed_number, ward_type, admitting_doctor_id, discharge_doctor_id, admission_diagnosis, discharge_diagnosis, status, created_at) VALUES
('ip-1', 'Nirmal Raj', '9840116889', 'nirmal@example.com', 'male', '1988-12-05', 'A+', 'Madurai, Tamil Nadu', '[]', 'Kavitha Raj', '9840116890', 'Max Bupa', 'MAX567890', '2024-01-10T08:00:00Z', '2024-01-15T14:00:00Z', '101', 'A', 'semi-private', '1', '1', 'Acute appendicitis', 'Post-appendectomy recovery', 'discharged', '2023-04-03T14:20:00Z'),
('ip-2', 'Divakar Thambidurai', '8973983311', 'divakar@example.com', 'male', '1980-06-18', 'AB+', 'Salem, Tamil Nadu', '["Penicillin"]', 'Anjali Thambidurai', '8973983312', 'Reliance General', 'REL123789', '2024-01-12T10:30:00Z', NULL, '205', 'B', 'private', '1', NULL, 'Severe pneumonia', NULL, 'admitted', '2023-04-04T16:45:00Z'),
('ip-3', 'Sundar Raman', '9871234567', 'sundar.raman@gmail.com', 'male', '1970-05-15', 'B-', 'Trichy, Tamil Nadu', '["Sulfa drugs"]', 'Geetha Raman', '9871234568', 'New India Assurance', 'NIA456123', '2024-01-14T16:00:00Z', NULL, '301', 'A', 'icu', '1', NULL, 'Myocardial infarction', NULL, 'admitted', '2024-01-14T16:00:00Z');

-- Insert sample general patients (for backward compatibility)
INSERT INTO patients (id, name, phone, email, gender, date_of_birth, blood_group, address, allergies, patient_type, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_number, created_at) VALUES
('1', 'Murugesh Kumar', '7708787590', 'murugesh@example.com', 'male', '1982-03-20', 'B+', 'Chennai, Tamil Nadu', '[]', 'out-patient', 'Lakshmi Kumar', '7708787591', 'Star Health', 'STAR123456', '2023-04-01T10:00:00Z'),
('2', 'Jeyaseelan V', '9944411950', 'jeyaseelan@example.com', 'male', '1975-08-12', 'O+', 'Coimbatore, Tamil Nadu', '["Aspirin"]', 'out-patient', 'Meena Jeyaseelan', '9944411951', 'ICICI Lombard', 'ICICI789012', '2023-04-02T11:30:00Z'),
('3', 'Nirmal Raj', '9840116889', 'nirmal@example.com', 'male', '1988-12-05', 'A+', 'Madurai, Tamil Nadu', '[]', 'in-patient', 'Kavitha Raj', '9840116890', 'Max Bupa', 'MAX567890', '2023-04-03T14:20:00Z'),
('4', 'Divakar Thambidurai', '8973983311', 'divakar@example.com', 'male', '1980-06-18', 'AB+', 'Salem, Tamil Nadu', '["Penicillin"]', 'in-patient', 'Anjali Thambidurai', '8973983312', 'Reliance General', 'REL123789', '2023-04-04T16:45:00Z'),
('5', 'Priya Lakshmi', '9876543215', 'priya.lakshmi@gmail.com', 'female', '1988-11-25', NULL, '654 Mylapore, Chennai, Tamil Nadu', '["Latex"]', 'out-patient', 'Ramesh Lakshmi', '9876543216', 'Bajaj Allianz', 'BAJAJ345678', '2023-05-12T00:00:00Z'),
('6', 'Rajesh Kannan', '8765432109', 'rajesh.kannan@gmail.com', 'male', '1995-09-30', NULL, '987 Tambaram, Chennai, Tamil Nadu', '[]', 'out-patient', 'Sita Kannan', '8765432110', 'HDFC ERGO', 'HDFC901234', '2023-06-18T00:00:00Z');

-- Insert sample out-patient visits
INSERT INTO out_patient_visits (id, patient_id, date, chief_complaints, diagnosis, notes, follow_up_date, doctor_id, visit_type) VALUES
('opv-1', 'op-1', '2023-05-15T10:00:00Z', 'Persistent cough, mild fever for 3 days', 'Acute bronchitis', 'Patient advised to rest and increase fluid intake.', '2023-05-22T10:00:00Z', '1', 'consultation'),
('opv-2', 'op-1', '2023-05-22T10:30:00Z', 'Follow-up for bronchitis, cough improved', 'Resolving bronchitis', 'Patient showing improvement. Advised to complete antibiotic course.', NULL, '1', 'follow-up'),
('opv-3', 'op-2', '2023-06-10T14:00:00Z', 'Headache, dizziness for 2 days', 'Migraine', 'Patient advised to keep migraine diary and identify triggers.', '2023-07-10T14:00:00Z', '1', 'consultation'),
('opv-4', 'op-3', '2024-01-10T09:00:00Z', 'Skin rash and itching', 'Allergic dermatitis', 'Patient has latex allergy. Prescribed antihistamines.', '2024-01-17T09:00:00Z', '1', 'consultation');

-- Insert sample in-patient rounds
INSERT INTO in_patient_rounds (id, patient_id, date, chief_complaints, diagnosis, notes, doctor_id, round_type, vital_signs, treatment_plan) VALUES
('ipr-1', 'ip-1', '2024-01-10T08:30:00Z', 'Acute abdominal pain', 'Acute appendicitis', 'Patient admitted for emergency appendectomy', '1', 'morning', '{"bp": "120/80", "pulse": "88", "temp": "99.2", "spo2": "98"}', 'Emergency surgery scheduled'),
('ipr-2', 'ip-1', '2024-01-11T08:00:00Z', 'Post-operative pain', 'Post-appendectomy recovery', 'Patient recovering well. Pain controlled with medications.', '1', 'morning', '{"bp": "118/78", "pulse": "82", "temp": "98.8", "spo2": "99"}', 'Continue pain management and monitor for complications'),
('ipr-3', 'ip-2', '2024-01-12T10:30:00Z', 'Severe cough, difficulty breathing', 'Severe pneumonia', 'Patient admitted with severe pneumonia. Started on IV antibiotics.', '1', 'emergency', '{"bp": "140/90", "pulse": "110", "temp": "102.5", "spo2": "92"}', 'IV antibiotics, oxygen therapy, chest physiotherapy'),
('ipr-4', 'ip-3', '2024-01-14T16:30:00Z', 'Chest pain, shortness of breath', 'Myocardial infarction', 'Patient admitted to ICU with suspected MI. ECG and cardiac markers ordered.', '1', 'emergency', '{"bp": "160/100", "pulse": "95", "temp": "98.6", "spo2": "94"}', 'Cardiac monitoring, aspirin, nitroglycerin, cardiology consult');

-- Insert sample out-patient medications
INSERT INTO out_patient_medications (visit_id, name, dosage, frequency, duration) VALUES
('opv-1', 'Amoxicillin', '500mg', 'Twice daily', '7 days'),
('opv-1', 'Guaifenesin', '400mg', 'Every 4 hours as needed', '5 days'),
('opv-2', 'Guaifenesin', '400mg', 'Every 6 hours as needed', '3 days'),
('opv-3', 'Sumatriptan', '50mg', 'As needed for migraine, max 2 doses per day', 'PRN'),
('opv-3', 'Ibuprofen', '600mg', 'Every 6 hours as needed for pain', '3 days'),
('opv-4', 'Cetirizine', '10mg', 'Once daily', '7 days'),
('opv-4', 'Hydrocortisone cream', '1%', 'Apply twice daily', '5 days');

-- Insert sample in-patient medications
INSERT INTO in_patient_medications (round_id, name, dosage, frequency, duration, route, start_date, end_date, status) VALUES
('ipr-1', 'Morphine', '5mg', 'Every 4 hours as needed', 'PRN', 'iv', '2024-01-10T08:30:00Z', NULL, 'active'),
('ipr-2', 'Paracetamol', '500mg', 'Every 6 hours', '3 days', 'oral', '2024-01-11T08:00:00Z', '2024-01-14T08:00:00Z', 'completed'),
('ipr-3', 'Ceftriaxone', '1g', 'Every 12 hours', '7 days', 'iv', '2024-01-12T10:30:00Z', NULL, 'active'),
('ipr-3', 'Azithromycin', '500mg', 'Once daily', '5 days', 'oral', '2024-01-12T10:30:00Z', NULL, 'active'),
('ipr-4', 'Aspirin', '325mg', 'Once daily', 'Lifetime', 'oral', '2024-01-14T16:30:00Z', NULL, 'active'),
('ipr-4', 'Nitroglycerin', '0.4mg', 'Every 5 minutes as needed', 'PRN', 'sublingual', '2024-01-14T16:30:00Z', NULL, 'active');

-- Insert sample general visits (for backward compatibility)
INSERT INTO visits (id, patient_id, date, chief_complaints, diagnosis, notes, follow_up_date) VALUES
('1', '1', '2023-05-15T10:00:00Z', 'Persistent cough, mild fever for 3 days', 'Acute bronchitis', 'Patient advised to rest and increase fluid intake.', '2023-05-22T10:00:00Z'),
('2', '1', '2023-05-22T10:30:00Z', 'Follow-up for bronchitis, cough improved', 'Resolving bronchitis', 'Patient showing improvement. Advised to complete antibiotic course.', NULL),
('3', '2', '2023-06-10T14:00:00Z', 'Headache, dizziness for 2 days', 'Migraine', 'Patient advised to keep migraine diary and identify triggers.', '2023-07-10T14:00:00Z');

-- Insert sample general medications (for backward compatibility)
INSERT INTO medications (visit_id, name, dosage, frequency, duration) VALUES
('1', 'Amoxicillin', '500mg', 'Twice daily', '7 days'),
('1', 'Guaifenesin', '400mg', 'Every 4 hours as needed', '5 days'),
('2', 'Guaifenesin', '400mg', 'Every 6 hours as needed', '3 days'),
('3', 'Sumatriptan', '50mg', 'As needed for migraine, max 2 doses per day', 'PRN'),
('3', 'Ibuprofen', '600mg', 'Every 6 hours as needed for pain', '3 days');

-- Insert sample out-patient appointments
-- Yesterday's appointments
INSERT INTO out_patient_appointments (id, patient_id, date, type, status, reminder_sent, notes, doctor_id, appointment_type) VALUES
('op-apt-1', 'op-1', '2024-01-14T09:00:00Z', 'walk-in', 'completed', 1, 'Regular checkup', '1', 'consultation'),
('op-apt-2', 'op-3', '2024-01-14T11:30:00Z', 'phone-call', 'completed', 1, 'Follow-up consultation', '1', 'follow-up'),
('op-apt-3', 'op-4', '2024-01-14T14:00:00Z', 'walk-in', 'completed', 0, 'Emergency visit', '1', 'emergency');

-- Today's appointments
INSERT INTO out_patient_appointments (id, patient_id, date, type, status, reminder_sent, notes, doctor_id, appointment_type) VALUES
('op-apt-5', 'op-1', '2024-01-15T11:00:00Z', 'phone-call', 'scheduled', 0, 'Medication review', '1', 'follow-up'),
('op-apt-6', 'op-2', '2024-01-15T15:30:00Z', 'walk-in', 'scheduled', 1, 'Follow-up visit', '1', 'follow-up'),
('op-apt-7', 'op-3', '2024-01-15T16:45:00Z', 'phone-call', 'scheduled', 0, 'Consultation', '1', 'consultation'),
('op-apt-8', 'op-4', '2024-01-15T17:45:00Z', 'walk-in', 'scheduled', 0, 'Consultation', '1', 'consultation');

-- Tomorrow's appointments
INSERT INTO out_patient_appointments (id, patient_id, date, type, status, reminder_sent, notes, doctor_id, appointment_type) VALUES
('op-apt-9', 'op-1', '2024-01-16T10:00:00Z', 'walk-in', 'scheduled', 0, 'Blood test results review', '1', 'consultation'),
('op-apt-10', 'op-2', '2024-01-16T13:30:00Z', 'phone-call', 'scheduled', 0, 'Prescription renewal', '1', 'follow-up'),
('op-apt-11', 'op-4', '2024-01-16T16:00:00Z', 'walk-in', 'scheduled', 0, 'Physical therapy consultation', '1', 'consultation');

-- Insert sample in-patient admissions
INSERT INTO in_patient_admissions (id, patient_id, admission_date, expected_discharge_date, actual_discharge_date, status, admission_type, room_number, bed_number, ward_type, admitting_doctor_id, notes) VALUES
('ip-adm-1', 'ip-1', '2024-01-10T08:00:00Z', '2024-01-15T14:00:00Z', '2024-01-15T14:00:00Z', 'discharged', 'emergency', '101', 'A', 'semi-private', '1', 'Emergency appendectomy'),
('ip-adm-2', 'ip-2', '2024-01-12T10:30:00Z', '2024-01-19T10:30:00Z', NULL, 'admitted', 'emergency', '205', 'B', 'private', '1', 'Severe pneumonia requiring IV antibiotics'),
('ip-adm-3', 'ip-3', '2024-01-14T16:00:00Z', '2024-01-21T16:00:00Z', NULL, 'admitted', 'emergency', '301', 'A', 'icu', '1', 'Myocardial infarction - critical condition');

-- Insert sample general appointments (for backward compatibility)
-- Yesterday's appointments
INSERT INTO appointments (id, patient_id, date, type, status, reminder_sent, notes) VALUES
('apt-1', '4', '2024-01-14T09:00:00Z', 'walk-in', 'completed', 1, 'Regular checkup'),
('apt-2', '5', '2024-01-14T11:30:00Z', 'phone-call', 'completed', 1, 'Follow-up consultation'),
('apt-3', '6', '2024-01-14T14:00:00Z', 'walk-in', 'completed', 0, 'Emergency visit');

-- Today's appointments
INSERT INTO appointments (id, patient_id, date, type, status, reminder_sent, notes) VALUES
('apt-5', '1', '2024-01-15T11:00:00Z', 'phone-call', 'scheduled', 0, 'Medication review'),
('apt-6', '2', '2024-01-15T15:30:00Z', 'walk-in', 'scheduled', 1, 'Follow-up visit'),
('apt-7', '4', '2024-01-15T16:45:00Z', 'phone-call', 'scheduled', 0, 'Consultation'),
('apt-8', '3', '2024-01-15T17:45:00Z', 'walk-in', 'scheduled', 0, 'Consultation');

-- Tomorrow's appointments
INSERT INTO appointments (id, patient_id, date, type, status, reminder_sent, notes) VALUES
('apt-9', '4', '2024-01-16T10:00:00Z', 'walk-in', 'scheduled', 0, 'Blood test results review'),
('apt-10', '2', '2024-01-16T13:30:00Z', 'phone-call', 'scheduled', 0, 'Prescription renewal'),
('apt-11', '6', '2024-01-16T16:00:00Z', 'walk-in', 'scheduled', 0, 'Physical therapy consultation');

-- Insert sample feedback
INSERT INTO feedback (id, patient_id, patient_name, appointment_id, visit_date, rating, comments, submitted_date, category) VALUES
('1', '1', 'Murugesh Kumar', 'apt-1', '2024-01-15', 'happy', 'Dr. Murugesh Kumar was very thorough and explained everything clearly. The treatment has been very effective.', '2024-01-16', 'treatment'),
('2', '2', 'Jeyaseelan V', 'apt-2', '2024-01-10', 'satisfied', 'Good consultation, but had to wait longer than expected. The phone consultation was convenient.', '2024-01-11', 'wait-time'),
('3', '4', 'Divakar Thambidurai', 'apt-4', '2024-01-08', 'happy', 'Excellent service and very professional staff. The migraine treatment worked perfectly.', '2024-01-09', 'overall'),
('4', '3', 'Nirmal Raj', 'apt-3', '2024-01-05', 'not-satisfied', 'The waiting area was crowded and the appointment was delayed by 45 minutes. Need better time management.', '2024-01-06', 'service'); 