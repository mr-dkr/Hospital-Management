from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

# Enums for validation
class UserRole(str, Enum):
    doctor = "doctor"
    admin = "admin"

class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"

class WardType(str, Enum):
    general = "general"
    semi_private = "semi-private"
    private = "private"
    icu = "icu"
    emergency = "emergency"

class PatientStatus(str, Enum):
    admitted = "admitted"
    discharged = "discharged"
    transferred = "transferred"
    deceased = "deceased"

class VisitType(str, Enum):
    consultation = "consultation"
    follow_up = "follow-up"
    emergency = "emergency"
    routine = "routine"

class RoundType(str, Enum):
    morning = "morning"
    evening = "evening"
    emergency = "emergency"
    discharge = "discharge"

class MedicationRoute(str, Enum):
    oral = "oral"
    iv = "iv"
    im = "im"
    sc = "sc"
    topical = "topical"
    inhalation = "inhalation"
    sublingual = "sublingual"

class MedicationStatus(str, Enum):
    active = "active"
    discontinued = "discontinued"
    completed = "completed"

class AppointmentType(str, Enum):
    walk_in = "walk-in"
    phone_call = "phone-call"
    video_call = "video-call"

class AppointmentStatus(str, Enum):
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"
    no_show = "no-show"

class AdmissionType(str, Enum):
    emergency = "emergency"
    elective = "elective"
    transfer = "transfer"

class AdmissionStatus(str, Enum):
    scheduled = "scheduled"
    admitted = "admitted"
    discharged = "discharged"
    cancelled = "cancelled"

class Rating(str, Enum):
    happy = "happy"
    satisfied = "satisfied"
    not_satisfied = "not-satisfied"

class FeedbackCategory(str, Enum):
    service = "service"
    wait_time = "wait-time"
    treatment = "treatment"
    facilities = "facilities"
    overall = "overall"

# Base schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    password: Optional[str] = None

class User(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Out-Patient schemas
class OutPatientBase(BaseModel):
    name: str
    phone: str
    email: EmailStr
    gender: Gender
    date_of_birth: date
    blood_group: Optional[str] = None
    address: Optional[str] = None
    allergies: Optional[str] = None  # JSON string
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_number: Optional[str] = None

class OutPatientCreate(OutPatientBase):
    pass

class OutPatientUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    gender: Optional[Gender] = None
    date_of_birth: Optional[date] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    allergies: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_number: Optional[str] = None

class OutPatient(OutPatientBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# In-Patient schemas
class InPatientBase(BaseModel):
    name: str
    phone: str
    email: EmailStr
    gender: Gender
    date_of_birth: date
    blood_group: Optional[str] = None
    address: Optional[str] = None
    allergies: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_number: Optional[str] = None
    admission_date: datetime
    discharge_date: Optional[datetime] = None
    room_number: Optional[str] = None
    bed_number: Optional[str] = None
    ward_type: Optional[WardType] = None
    admitting_doctor_id: Optional[str] = None
    discharge_doctor_id: Optional[str] = None
    admission_diagnosis: Optional[str] = None
    discharge_diagnosis: Optional[str] = None
    status: PatientStatus = PatientStatus.admitted

class InPatientCreate(InPatientBase):
    pass

class InPatientUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    gender: Optional[Gender] = None
    date_of_birth: Optional[date] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    allergies: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_number: Optional[str] = None
    admission_date: Optional[datetime] = None
    discharge_date: Optional[datetime] = None
    room_number: Optional[str] = None
    bed_number: Optional[str] = None
    ward_type: Optional[WardType] = None
    admitting_doctor_id: Optional[str] = None
    discharge_doctor_id: Optional[str] = None
    admission_diagnosis: Optional[str] = None
    discharge_diagnosis: Optional[str] = None
    status: Optional[PatientStatus] = None

class InPatient(InPatientBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Visit schemas
class OutPatientVisitBase(BaseModel):
    patient_id: str
    date: datetime
    chief_complaints: str
    diagnosis: str
    notes: Optional[str] = None
    follow_up_date: Optional[datetime] = None
    doctor_id: Optional[str] = None
    visit_type: VisitType = VisitType.consultation

class OutPatientVisitCreate(OutPatientVisitBase):
    pass

class OutPatientVisitUpdate(BaseModel):
    date: Optional[datetime] = None
    chief_complaints: Optional[str] = None
    diagnosis: Optional[str] = None
    notes: Optional[str] = None
    follow_up_date: Optional[datetime] = None
    doctor_id: Optional[str] = None
    visit_type: Optional[VisitType] = None

class OutPatientVisit(OutPatientVisitBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Round schemas
class InPatientRoundBase(BaseModel):
    patient_id: str
    date: datetime
    chief_complaints: str
    diagnosis: str
    notes: Optional[str] = None
    doctor_id: Optional[str] = None
    round_type: RoundType = RoundType.morning
    vital_signs: Optional[str] = None  # JSON string
    treatment_plan: Optional[str] = None

class InPatientRoundCreate(InPatientRoundBase):
    pass

class InPatientRoundUpdate(BaseModel):
    date: Optional[datetime] = None
    chief_complaints: Optional[str] = None
    diagnosis: Optional[str] = None
    notes: Optional[str] = None
    doctor_id: Optional[str] = None
    round_type: Optional[RoundType] = None
    vital_signs: Optional[str] = None
    treatment_plan: Optional[str] = None

class InPatientRound(InPatientRoundBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Medication schemas
class OutPatientMedicationBase(BaseModel):
    visit_id: str
    name: str
    dosage: str
    frequency: str
    duration: str

class OutPatientMedicationCreate(OutPatientMedicationBase):
    pass

class OutPatientMedicationUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None

class OutPatientMedication(OutPatientMedicationBase):
    id: int
    prescription_date: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

class InPatientMedicationBase(BaseModel):
    round_id: str
    name: str
    dosage: str
    frequency: str
    duration: str
    route: MedicationRoute = MedicationRoute.oral
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: MedicationStatus = MedicationStatus.active

class InPatientMedicationCreate(InPatientMedicationBase):
    pass

class InPatientMedicationUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    route: Optional[MedicationRoute] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[MedicationStatus] = None

class InPatientMedication(InPatientMedicationBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Appointment schemas
class OutPatientAppointmentBase(BaseModel):
    patient_id: str
    date: datetime
    type: AppointmentType
    status: AppointmentStatus = AppointmentStatus.scheduled
    reminder_sent: bool = False
    notes: Optional[str] = None
    doctor_id: Optional[str] = None
    appointment_type: VisitType = VisitType.consultation

class OutPatientAppointmentCreate(OutPatientAppointmentBase):
    pass

class OutPatientAppointmentUpdate(BaseModel):
    date: Optional[datetime] = None
    type: Optional[AppointmentType] = None
    status: Optional[AppointmentStatus] = None
    reminder_sent: Optional[bool] = None
    notes: Optional[str] = None
    doctor_id: Optional[str] = None
    appointment_type: Optional[VisitType] = None

class OutPatientAppointment(OutPatientAppointmentBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Admission schemas
class InPatientAdmissionBase(BaseModel):
    patient_id: str
    admission_date: datetime
    expected_discharge_date: Optional[datetime] = None
    actual_discharge_date: Optional[datetime] = None
    status: AdmissionStatus = AdmissionStatus.scheduled
    admission_type: AdmissionType
    room_number: Optional[str] = None
    bed_number: Optional[str] = None
    ward_type: Optional[WardType] = None
    admitting_doctor_id: Optional[str] = None
    notes: Optional[str] = None

class InPatientAdmissionCreate(InPatientAdmissionBase):
    pass

class InPatientAdmissionUpdate(BaseModel):
    admission_date: Optional[datetime] = None
    expected_discharge_date: Optional[datetime] = None
    actual_discharge_date: Optional[datetime] = None
    status: Optional[AdmissionStatus] = None
    admission_type: Optional[AdmissionType] = None
    room_number: Optional[str] = None
    bed_number: Optional[str] = None
    ward_type: Optional[WardType] = None
    admitting_doctor_id: Optional[str] = None
    notes: Optional[str] = None

class InPatientAdmission(InPatientAdmissionBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Feedback schemas
class FeedbackBase(BaseModel):
    patient_id: str
    patient_name: str
    appointment_id: str
    visit_date: date
    rating: Rating
    comments: str
    submitted_date: date
    category: FeedbackCategory

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackUpdate(BaseModel):
    patient_name: Optional[str] = None
    visit_date: Optional[date] = None
    rating: Optional[Rating] = None
    comments: Optional[str] = None
    submitted_date: Optional[date] = None
    category: Optional[FeedbackCategory] = None

class Feedback(FeedbackBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Response schemas with relationships
class OutPatientWithVisits(OutPatient):
    visits: List[OutPatientVisit] = []
    appointments: List[OutPatientAppointment] = []

class InPatientWithRounds(InPatient):
    rounds: List[InPatientRound] = []
    admissions: List[InPatientAdmission] = []

class OutPatientVisitWithMedications(OutPatientVisit):
    medications: List[OutPatientMedication] = []

class InPatientRoundWithMedications(InPatientRound):
    medications: List[InPatientMedication] = []

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 