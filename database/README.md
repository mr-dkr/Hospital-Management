# Hospital Management System Database

This directory contains the SQLite database setup for the Hospital Management System.

## Database Structure

The database consists of multiple tables organized by patient type:

### Core Tables

#### 1. `users` - User Authentication
- Stores doctor and admin user accounts
- Fields: id, name, email, role, password, created_at

#### 2. `feedback` - Patient Feedback
- Stores patient feedback and ratings
- Fields: id, patient_id, patient_name, appointment_id, visit_date, rating, comments, submitted_date, category, created_at

### Out-Patient Tables

#### 3. `out_patients` - Out-Patient Information
- Stores out-patient demographic and medical information
- Fields: id, name, phone, email, gender, date_of_birth, blood_group, address, allergies, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_number, created_at

#### 4. `out_patient_visits` - Out-Patient Visits
- Stores out-patient visit records with diagnoses
- Fields: id, patient_id, date, chief_complaints, diagnosis, notes, follow_up_date, doctor_id, visit_type, created_at

#### 5. `out_patient_medications` - Out-Patient Medications
- Stores medications prescribed during out-patient visits
- Fields: id, visit_id, name, dosage, frequency, duration, prescription_date, created_at

#### 6. `out_patient_appointments` - Out-Patient Appointments
- Stores out-patient appointments
- Fields: id, patient_id, date, type, status, reminder_sent, notes, doctor_id, appointment_type, created_at

### In-Patient Tables

#### 7. `in_patients` - In-Patient Information
- Stores in-patient demographic, medical, and admission information
- Fields: id, name, phone, email, gender, date_of_birth, blood_group, address, allergies, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_number, admission_date, discharge_date, room_number, bed_number, ward_type, admitting_doctor_id, discharge_doctor_id, admission_diagnosis, discharge_diagnosis, status, created_at

#### 8. `in_patient_rounds` - In-Patient Rounds
- Stores in-patient daily rounds and progress notes
- Fields: id, patient_id, date, chief_complaints, diagnosis, notes, doctor_id, round_type, vital_signs, treatment_plan, created_at

#### 9. `in_patient_medications` - In-Patient Medications
- Stores medications for in-patients with detailed administration info
- Fields: id, round_id, name, dosage, frequency, duration, route, start_date, end_date, status, created_at

#### 10. `in_patient_admissions` - In-Patient Admissions
- Stores in-patient admission and discharge information
- Fields: id, patient_id, admission_date, expected_discharge_date, actual_discharge_date, status, admission_type, room_number, bed_number, ward_type, admitting_doctor_id, notes, created_at

### Legacy Tables (for backward compatibility)

#### 11. `patients` - General Patient Information
- Legacy table for general patient records
- Fields: id, name, phone, email, gender, date_of_birth, blood_group, address, allergies, patient_type, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_number, created_at

#### 12. `visits` - General Visits
- Legacy table for general visit records
- Fields: id, patient_id, date, chief_complaints, diagnosis, notes, follow_up_date, created_at

#### 13. `medications` - General Medications
- Legacy table for general medication records
- Fields: id, visit_id, name, dosage, frequency, duration, created_at

#### 14. `appointments` - General Appointments
- Legacy table for general appointment records
- Fields: id, patient_id, date, type, status, reminder_sent, notes, created_at

## Setup Instructions

### Prerequisites
- Python 3.6 or higher
- SQLite3 (usually comes with Python)

### Creating the Database

1. Navigate to the database directory:
   ```bash
   cd database
   ```

2. Run the initialization script:
   ```bash
   python init_database.py
   ```

This will:
- Create a new SQLite database file: `hospital_management.db`
- Create all tables with proper relationships
- Insert sample data based on your frontend mock data
- Verify the database contents

### Manual Setup (Alternative)

If you prefer to set up manually:

1. Create the database:
   ```bash
   sqlite3 hospital_management.db
   ```

2. Run the schema:
   ```sql
   .read schema.sql
   ```

3. Insert sample data:
   ```sql
   .read sample_data.sql
   ```

## Sample Data

The database comes pre-populated with:

- **2 Users**: Dr. Murugesh Kumar (doctor) and Admin User (admin)
- **4 Out-Patients**: Sample out-patients with demographics and insurance info
- **3 In-Patients**: Sample in-patients with admission details and ward assignments
- **6 General Patients**: Legacy patient records for backward compatibility
- **4 Out-Patient Visits**: Sample out-patient consultations and follow-ups
- **4 In-Patient Rounds**: Sample in-patient daily rounds with vital signs
- **7 Out-Patient Medications**: Sample prescriptions for out-patients
- **6 In-Patient Medications**: Sample medications with routes and status tracking
- **11 Out-Patient Appointments**: Sample out-patient appointments
- **3 In-Patient Admissions**: Sample admission records with room assignments
- **11 General Appointments**: Legacy appointment records
- **4 Feedback**: Sample patient feedback entries

## Database Relationships

### Out-Patient Relationships
- `out_patient_visits.patient_id` → `out_patients.id`
- `out_patient_medications.visit_id` → `out_patient_visits.id`
- `out_patient_appointments.patient_id` → `out_patients.id`
- `out_patient_visits.doctor_id` → `users.id`
- `out_patient_appointments.doctor_id` → `users.id`

### In-Patient Relationships
- `in_patient_rounds.patient_id` → `in_patients.id`
- `in_patient_medications.round_id` → `in_patient_rounds.id`
- `in_patient_admissions.patient_id` → `in_patients.id`
- `in_patients.admitting_doctor_id` → `users.id`
- `in_patients.discharge_doctor_id` → `users.id`
- `in_patient_rounds.doctor_id` → `users.id`
- `in_patient_admissions.admitting_doctor_id` → `users.id`

### Legacy Relationships (for backward compatibility)
- `visits.patient_id` → `patients.id`
- `medications.visit_id` → `visits.id`
- `appointments.patient_id` → `patients.id`
- `feedback.patient_id` → `patients.id`
- `feedback.appointment_id` → `appointments.id`

## Important Notes

1. **Allergies**: Stored as JSON strings in the `patients.allergies` field
2. **Passwords**: In production, passwords should be hashed, not stored as plain text
3. **Dates**: All dates are stored in ISO format (YYYY-MM-DDTHH:MM:SSZ)
4. **Foreign Keys**: Proper foreign key constraints are enforced with CASCADE delete

## Query Examples

### Out-Patient Queries

#### Get all out-patients with their visit count:
```sql
SELECT op.name, op.email, COUNT(opv.id) as visit_count
FROM out_patients op
LEFT JOIN out_patient_visits opv ON op.id = opv.patient_id
GROUP BY op.id;
```

#### Get today's out-patient appointments:
```sql
SELECT oa.id, op.name, oa.date, oa.type, oa.status, u.name as doctor_name
FROM out_patient_appointments oa
JOIN out_patients op ON oa.patient_id = op.id
LEFT JOIN users u ON oa.doctor_id = u.id
WHERE DATE(oa.date) = DATE('now');
```

#### Get out-patient visits with medications:
```sql
SELECT opv.date, opv.diagnosis, opm.name, opm.dosage, opm.frequency
FROM out_patient_visits opv
JOIN out_patient_medications opm ON opv.id = opm.visit_id
WHERE opv.patient_id = 'op-1'
ORDER BY opv.date DESC;
```

### In-Patient Queries

#### Get all currently admitted in-patients:
```sql
SELECT ip.name, ip.room_number, ip.bed_number, ip.ward_type, 
       ip.admission_date, u.name as admitting_doctor
FROM in_patients ip
LEFT JOIN users u ON ip.admitting_doctor_id = u.id
WHERE ip.status = 'admitted';
```

#### Get in-patient rounds with vital signs:
```sql
SELECT ipr.date, ipr.round_type, ipr.vital_signs, ipr.treatment_plan,
       u.name as doctor_name
FROM in_patient_rounds ipr
JOIN users u ON ipr.doctor_id = u.id
WHERE ipr.patient_id = 'ip-2'
ORDER BY ipr.date DESC;
```

#### Get active medications for in-patients:
```sql
SELECT ip.name, ipm.name as medication, ipm.dosage, ipm.route, 
       ipm.start_date, ipm.status
FROM in_patient_medications ipm
JOIN in_patient_rounds ipr ON ipm.round_id = ipr.id
JOIN in_patients ip ON ipr.patient_id = ip.id
WHERE ipm.status = 'active'
ORDER BY ip.name, ipm.start_date;
```

### Combined Queries

#### Get patient count by type:
```sql
SELECT 'Out-Patients' as patient_type, COUNT(*) as count FROM out_patients
UNION ALL
SELECT 'In-Patients' as patient_type, COUNT(*) as count FROM in_patients WHERE status = 'admitted'
UNION ALL
SELECT 'General Patients' as patient_type, COUNT(*) as count FROM patients;
```

#### Get today's activities (appointments + rounds):
```sql
SELECT 'Out-Patient Appointment' as activity_type, op.name, oa.date, oa.status
FROM out_patient_appointments oa
JOIN out_patients op ON oa.patient_id = op.id
WHERE DATE(oa.date) = DATE('now')
UNION ALL
SELECT 'In-Patient Round' as activity_type, ip.name, ipr.date, ipr.round_type
FROM in_patient_rounds ipr
JOIN in_patients ip ON ipr.patient_id = ip.id
WHERE DATE(ipr.date) = DATE('now')
ORDER BY date;
```

## Integration with Frontend

To integrate this database with your React frontend, you'll need to:

1. Create a backend API (Node.js/Express, Python/Flask, etc.)
2. Replace the mock data functions in `src/data/mockData.ts` with API calls
3. Use the database schema as a reference for your API endpoints

The database structure matches your frontend TypeScript interfaces, making integration straightforward. 