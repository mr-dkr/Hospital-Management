from sqlalchemy import Column, String, DateTime, Text, Boolean, Integer, ForeignKey, Date, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    role = Column(String, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    out_patient_visits = relationship("OutPatientVisit", back_populates="doctor")
    out_patient_appointments = relationship("OutPatientAppointment", back_populates="doctor")
    in_patient_rounds = relationship("InPatientRound", back_populates="doctor")
    admitting_in_patients = relationship("InPatient", foreign_keys="InPatient.admitting_doctor_id", back_populates="admitting_doctor")
    discharging_in_patients = relationship("InPatient", foreign_keys="InPatient.discharge_doctor_id", back_populates="discharge_doctor")
    in_patient_admissions = relationship("InPatientAdmission", back_populates="admitting_doctor")

class OutPatient(Base):
    __tablename__ = "out_patients"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False, index=True)
    email = Column(String, nullable=False, index=True)
    gender = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    blood_group = Column(String)
    address = Column(Text)
    allergies = Column(Text)  # JSON array stored as text
    emergency_contact_name = Column(String)
    emergency_contact_phone = Column(String)
    insurance_provider = Column(String)
    insurance_number = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    visits = relationship("OutPatientVisit", back_populates="patient", cascade="all, delete-orphan")
    appointments = relationship("OutPatientAppointment", back_populates="patient", cascade="all, delete-orphan")
    medications = relationship("OutPatientMedication", back_populates="patient", cascade="all, delete-orphan")  # Ensure this line is present


class InPatient(Base):
    __tablename__ = "in_patients"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False, index=True)
    email = Column(String, nullable=False, index=True)
    gender = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    blood_group = Column(String)
    address = Column(Text)
    allergies = Column(Text)  # JSON array stored as text
    emergency_contact_name = Column(String)
    emergency_contact_phone = Column(String)
    insurance_provider = Column(String)
    insurance_number = Column(String)
    admission_date = Column(DateTime, nullable=False, index=True)
    discharge_date = Column(DateTime)
    room_number = Column(String)
    bed_number = Column(String)
    ward_type = Column(String)
    admitting_doctor_id = Column(String, ForeignKey("users.id"))
    discharge_doctor_id = Column(String, ForeignKey("users.id"))
    admission_diagnosis = Column(Text)
    discharge_diagnosis = Column(Text)
    status = Column(String, default="admitted", index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    rounds = relationship("InPatientRound", back_populates="patient", cascade="all, delete-orphan")
    admissions = relationship("InPatientAdmission", back_populates="patient", cascade="all, delete-orphan")
    admitting_doctor = relationship("User", foreign_keys=[admitting_doctor_id], back_populates="admitting_in_patients")
    discharge_doctor = relationship("User", foreign_keys=[discharge_doctor_id], back_populates="discharging_in_patients")

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False, index=True)
    email = Column(String, nullable=False, index=True)
    gender = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    blood_group = Column(String)
    address = Column(Text)
    allergies = Column(Text)  # JSON array stored as text
    patient_type = Column(String, default="general")
    emergency_contact_name = Column(String)
    emergency_contact_phone = Column(String)
    insurance_provider = Column(String)
    insurance_number = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    visits = relationship("Visit", back_populates="patient", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="patient", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="patient", cascade="all, delete-orphan")

class OutPatientVisit(Base):
    __tablename__ = "out_patient_visits"
    
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("out_patients.id"), nullable=False, index=True)
    date = Column(DateTime, nullable=False, index=True)
    chief_complaints = Column(Text, nullable=False)
    diagnosis = Column(Text, nullable=False)
    notes = Column(Text)
    follow_up_date = Column(DateTime)
    doctor_id = Column(String, ForeignKey("users.id"))
    visit_type = Column(String, default="consultation")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    patient = relationship("OutPatient", back_populates="visits")
    doctor = relationship("User", back_populates="out_patient_visits")
    medications = relationship("OutPatientMedication", back_populates="visit", cascade="all, delete-orphan")

class InPatientRound(Base):
    __tablename__ = "in_patient_rounds"
    
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("in_patients.id"), nullable=False, index=True)
    date = Column(DateTime, nullable=False, index=True)
    chief_complaints = Column(Text, nullable=False)
    diagnosis = Column(Text, nullable=False)
    notes = Column(Text)
    doctor_id = Column(String, ForeignKey("users.id"))
    round_type = Column(String, default="morning")
    vital_signs = Column(Text)  # JSON object stored as text
    treatment_plan = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    patient = relationship("InPatient", back_populates="rounds")
    doctor = relationship("User", back_populates="in_patient_rounds")
    medications = relationship("InPatientMedication", back_populates="round", cascade="all, delete-orphan")

class Visit(Base):
    __tablename__ = "visits"
    
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False, index=True)
    date = Column(DateTime, nullable=False, index=True)
    chief_complaints = Column(Text, nullable=False)
    diagnosis = Column(Text, nullable=False)
    notes = Column(Text)
    follow_up_date = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    patient = relationship("Patient", back_populates="visits")
    medications = relationship("Medication", back_populates="visit", cascade="all, delete-orphan")

class OutPatientMedication(Base):
    __tablename__ = "out_patient_medications"

    id = Column(Integer, primary_key=True, index=True)
    visit_id = Column(String, ForeignKey("out_patient_visits.id"), nullable=False, index=True)
    patient_id = Column(String, ForeignKey("out_patients.id"), nullable=False, index=True)  # Ensure this line is present
    name = Column(String, nullable=False)
    dosage = Column(String, nullable=False)
    frequency = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    prescription_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    visit = relationship("OutPatientVisit", back_populates="medications")
    patient = relationship("OutPatient", back_populates="medications")
class InPatientMedication(Base):
    __tablename__ = "in_patient_medications"
    
    id = Column(Integer, primary_key=True, index=True)
    round_id = Column(String, ForeignKey("in_patient_rounds.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    dosage = Column(String, nullable=False)
    frequency = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    route = Column(String, default="oral")
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    round = relationship("InPatientRound", back_populates="medications")

class Medication(Base):
    __tablename__ = "medications"
    
    id = Column(Integer, primary_key=True, index=True)
    visit_id = Column(String, ForeignKey("visits.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    dosage = Column(String, nullable=False)
    frequency = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    visit = relationship("Visit", back_populates="medications")

class OutPatientAppointment(Base):
    __tablename__ = "out_patient_appointments"
    
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("out_patients.id"), nullable=False, index=True)
    date = Column(DateTime, nullable=False, index=True)
    type = Column(String, nullable=False)
    status = Column(String, nullable=False, index=True)
    reminder_sent = Column(Boolean, default=False)
    notes = Column(Text)
    doctor_id = Column(String, ForeignKey("users.id"))
    appointment_type = Column(String, default="consultation")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    patient = relationship("OutPatient", back_populates="appointments")
    doctor = relationship("User", back_populates="out_patient_appointments")

class InPatientAdmission(Base):
    __tablename__ = "in_patient_admissions"
    
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("in_patients.id"), nullable=False, index=True)
    admission_date = Column(DateTime, nullable=False, index=True)
    expected_discharge_date = Column(DateTime)
    actual_discharge_date = Column(DateTime)
    status = Column(String, nullable=False, index=True)
    admission_type = Column(String, nullable=False)
    room_number = Column(String)
    bed_number = Column(String)
    ward_type = Column(String)
    admitting_doctor_id = Column(String, ForeignKey("users.id"))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    patient = relationship("InPatient", back_populates="admissions")
    admitting_doctor = relationship("User", back_populates="in_patient_admissions")

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False, index=True)
    date = Column(DateTime, nullable=False, index=True)
    type = Column(String, nullable=False)
    status = Column(String, nullable=False, index=True)
    reminder_sent = Column(Boolean, default=False)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    patient = relationship("Patient", back_populates="appointments")
    feedback = relationship("Feedback", back_populates="appointment", cascade="all, delete-orphan")

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False, index=True)
    patient_name = Column(String, nullable=False)
    appointment_id = Column(String, ForeignKey("appointments.id"), nullable=False, index=True)
    visit_date = Column(Date, nullable=False)
    rating = Column(String, nullable=False)
    comments = Column(Text, nullable=False)
    submitted_date = Column(Date, nullable=False)
    category = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    patient = relationship("Patient", back_populates="feedback")
    appointment = relationship("Appointment", back_populates="feedback") 