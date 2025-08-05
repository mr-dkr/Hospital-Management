from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from typing import List, Optional
from datetime import datetime, date
import uuid
from . import models, schemas

# User CRUD operations
def get_user(db: Session, user_id: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    from .auth import get_password_hash
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        id=str(uuid.uuid4()),
        name=user.name,
        email=user.email,
        role=user.role,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: str, user_update: schemas.UserUpdate) -> Optional[models.User]:
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "password":
            from .auth import get_password_hash
            value = get_password_hash(value)
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: str) -> bool:
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    db.delete(db_user)
    db.commit()
    return True

# Out-Patient CRUD operations
def get_out_patient(db: Session, patient_id: str) -> Optional[models.OutPatient]:
    return db.query(models.OutPatient).filter(models.OutPatient.id == patient_id).first()

def get_out_patients(db: Session, skip: int = 0, limit: int = 100) -> List[models.OutPatient]:
    return db.query(models.OutPatient).offset(skip).limit(limit).all()

def get_out_patients_by_doctor(db: Session, doctor_id: str) -> List[models.OutPatient]:
    return db.query(models.OutPatient).join(models.OutPatientVisit).filter(
        models.OutPatientVisit.doctor_id == doctor_id
    ).distinct().all()

def create_out_patient(db: Session, patient: schemas.OutPatientCreate) -> models.OutPatient:
    db_patient = models.OutPatient(
        id=f"op-{str(uuid.uuid4())[:8]}",
        **patient.dict()
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def update_out_patient(db: Session, patient_id: str, patient_update: schemas.OutPatientUpdate) -> Optional[models.OutPatient]:
    db_patient = get_out_patient(db, patient_id)
    if not db_patient:
        return None
    
    update_data = patient_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_patient, field, value)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient

def delete_out_patient(db: Session, patient_id: str) -> bool:
    db_patient = get_out_patient(db, patient_id)
    if not db_patient:
        return False
    db.delete(db_patient)
    db.commit()
    return True

# In-Patient CRUD operations
def get_in_patient(db: Session, patient_id: str) -> Optional[models.InPatient]:
    return db.query(models.InPatient).filter(models.InPatient.id == patient_id).first()

def get_in_patients(db: Session, skip: int = 0, limit: int = 100) -> List[models.InPatient]:
    return db.query(models.InPatient).offset(skip).limit(limit).all()

def get_admitted_in_patients(db: Session) -> List[models.InPatient]:
    return db.query(models.InPatient).filter(models.InPatient.status == "admitted").all()

def get_in_patients_by_ward(db: Session, ward_type: str) -> List[models.InPatient]:
    return db.query(models.InPatient).filter(
        and_(
            models.InPatient.ward_type == ward_type,
            models.InPatient.status == "admitted"
        )
    ).all()

def create_in_patient(db: Session, patient: schemas.InPatientCreate) -> models.InPatient:
    db_patient = models.InPatient(
        id=f"ip-{str(uuid.uuid4())[:8]}",
        **patient.dict()
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def update_in_patient(db: Session, patient_id: str, patient_update: schemas.InPatientUpdate) -> Optional[models.InPatient]:
    db_patient = get_in_patient(db, patient_id)
    if not db_patient:
        return None
    
    update_data = patient_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_patient, field, value)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient

def discharge_in_patient(db: Session, patient_id: str, discharge_diagnosis: str, discharge_doctor_id: str) -> Optional[models.InPatient]:
    db_patient = get_in_patient(db, patient_id)
    if not db_patient:
        return None
    
    db_patient.status = "discharged"
    db_patient.discharge_date = datetime.utcnow()
    db_patient.discharge_diagnosis = discharge_diagnosis
    db_patient.discharge_doctor_id = discharge_doctor_id
    
    db.commit()
    db.refresh(db_patient)
    return db_patient

def delete_in_patient(db: Session, patient_id: str) -> bool:
    db_patient = get_in_patient(db, patient_id)
    if not db_patient:
        return False
    db.delete(db_patient)
    db.commit()
    return True

# Out-Patient Visit CRUD operations
def get_out_patient_visit(db: Session, visit_id: str) -> Optional[models.OutPatientVisit]:
    return db.query(models.OutPatientVisit).filter(models.OutPatientVisit.id == visit_id).first()

def get_out_patient_visits(db: Session, skip: int = 0, limit: int = 100) -> List[models.OutPatientVisit]:
    return db.query(models.OutPatientVisit).offset(skip).limit(limit).all()

def get_out_patient_visits_by_patient(db: Session, patient_id: str) -> List[models.OutPatientVisit]:
    return db.query(models.OutPatientVisit).filter(
        models.OutPatientVisit.patient_id == patient_id
    ).order_by(models.OutPatientVisit.date.desc()).all()

def get_out_patient_visits_by_doctor(db: Session, doctor_id: str) -> List[models.OutPatientVisit]:
    return db.query(models.OutPatientVisit).filter(
        models.OutPatientVisit.doctor_id == doctor_id
    ).order_by(models.OutPatientVisit.date.desc()).all()

def create_out_patient_visit(db: Session, visit: schemas.OutPatientVisitCreate) -> models.OutPatientVisit:
    db_visit = models.OutPatientVisit(
        id=f"opv-{str(uuid.uuid4())[:8]}",
        **visit.dict()
    )
    db.add(db_visit)
    db.commit()
    db.refresh(db_visit)
    return db_visit

def update_out_patient_visit(db: Session, visit_id: str, visit_update: schemas.OutPatientVisitUpdate) -> Optional[models.OutPatientVisit]:
    db_visit = get_out_patient_visit(db, visit_id)
    if not db_visit:
        return None
    
    update_data = visit_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_visit, field, value)
    
    db.commit()
    db.refresh(db_visit)
    return db_visit

def delete_out_patient_visit(db: Session, visit_id: str) -> bool:
    db_visit = get_out_patient_visit(db, visit_id)
    if not db_visit:
        return False
    db.delete(db_visit)
    db.commit()
    return True

# In-Patient Round CRUD operations
def get_in_patient_round(db: Session, round_id: str) -> Optional[models.InPatientRound]:
    return db.query(models.InPatientRound).filter(models.InPatientRound.id == round_id).first()

def get_in_patient_rounds(db: Session, skip: int = 0, limit: int = 100) -> List[models.InPatientRound]:
    return db.query(models.InPatientRound).offset(skip).limit(limit).all()

def get_in_patient_rounds_by_patient(db: Session, patient_id: str) -> List[models.InPatientRound]:
    return db.query(models.InPatientRound).filter(
        models.InPatientRound.patient_id == patient_id
    ).order_by(models.InPatientRound.date.desc()).all()

def get_in_patient_rounds_by_doctor(db: Session, doctor_id: str) -> List[models.InPatientRound]:
    return db.query(models.InPatientRound).filter(
        models.InPatientRound.doctor_id == doctor_id
    ).order_by(models.InPatientRound.date.desc()).all()

def create_in_patient_round(db: Session, round_data: schemas.InPatientRoundCreate) -> models.InPatientRound:
    db_round = models.InPatientRound(
        id=f"ipr-{str(uuid.uuid4())[:8]}",
        **round_data.dict()
    )
    db.add(db_round)
    db.commit()
    db.refresh(db_round)
    return db_round

def update_in_patient_round(db: Session, round_id: str, round_update: schemas.InPatientRoundUpdate) -> Optional[models.InPatientRound]:
    db_round = get_in_patient_round(db, round_id)
    if not db_round:
        return None
    
    update_data = round_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_round, field, value)
    
    db.commit()
    db.refresh(db_round)
    return db_round

def delete_in_patient_round(db: Session, round_id: str) -> bool:
    db_round = get_in_patient_round(db, round_id)
    if not db_round:
        return False
    db.delete(db_round)
    db.commit()
    return True

# Out-Patient Medication CRUD operations
def get_out_patient_medication(db: Session, medication_id: int) -> Optional[models.OutPatientMedication]:
    return db.query(models.OutPatientMedication).filter(models.OutPatientMedication.id == medication_id).first()

def get_out_patient_medications_by_visit(db: Session, visit_id: str) -> List[models.OutPatientMedication]:
    return db.query(models.OutPatientMedication).filter(
        models.OutPatientMedication.visit_id == visit_id
    ).all()

def create_out_patient_medication(db: Session, medication: schemas.OutPatientMedicationCreate) -> models.OutPatientMedication:
    db_medication = models.OutPatientMedication(**medication.dict())
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)
    return db_medication

def update_out_patient_medication(db: Session, medication_id: int, medication_update: schemas.OutPatientMedicationUpdate) -> Optional[models.OutPatientMedication]:
    db_medication = get_out_patient_medication(db, medication_id)
    if not db_medication:
        return None
    
    update_data = medication_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_medication, field, value)
    
    db.commit()
    db.refresh(db_medication)
    return db_medication

def delete_out_patient_medication(db: Session, medication_id: int) -> bool:
    db_medication = get_out_patient_medication(db, medication_id)
    if not db_medication:
        return False
    db.delete(db_medication)
    db.commit()
    return True

# In-Patient Medication CRUD operations
def get_in_patient_medication(db: Session, medication_id: int) -> Optional[models.InPatientMedication]:
    return db.query(models.InPatientMedication).filter(models.InPatientMedication.id == medication_id).first()

def get_in_patient_medications_by_round(db: Session, round_id: str) -> List[models.InPatientMedication]:
    return db.query(models.InPatientMedication).filter(
        models.InPatientMedication.round_id == round_id
    ).all()

def get_active_in_patient_medications(db: Session, patient_id: str) -> List[models.InPatientMedication]:
    return db.query(models.InPatientMedication).join(models.InPatientRound).filter(
        and_(
            models.InPatientRound.patient_id == patient_id,
            models.InPatientMedication.status == "active"
        )
    ).all()

def create_in_patient_medication(db: Session, medication: schemas.InPatientMedicationCreate) -> models.InPatientMedication:
    db_medication = models.InPatientMedication(**medication.dict())
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)
    return db_medication

def update_in_patient_medication(db: Session, medication_id: int, medication_update: schemas.InPatientMedicationUpdate) -> Optional[models.InPatientMedication]:
    db_medication = get_in_patient_medication(db, medication_id)
    if not db_medication:
        return None
    
    update_data = medication_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_medication, field, value)
    
    db.commit()
    db.refresh(db_medication)
    return db_medication

def discontinue_medication(db: Session, medication_id: int) -> Optional[models.InPatientMedication]:
    db_medication = get_in_patient_medication(db, medication_id)
    if not db_medication:
        return None
    
    db_medication.status = "discontinued"
    db_medication.end_date = datetime.utcnow()
    
    db.commit()
    db.refresh(db_medication)
    return db_medication

def delete_in_patient_medication(db: Session, medication_id: int) -> bool:
    db_medication = get_in_patient_medication(db, medication_id)
    if not db_medication:
        return False
    db.delete(db_medication)
    db.commit()
    return True

# Out-Patient Appointment CRUD operations
def get_out_patient_appointment(db: Session, appointment_id: str) -> Optional[models.OutPatientAppointment]:
    return db.query(models.OutPatientAppointment).filter(models.OutPatientAppointment.id == appointment_id).first()

def get_out_patient_appointments(db: Session, skip: int = 0, limit: int = 100) -> List[models.OutPatientAppointment]:
    return db.query(models.OutPatientAppointment).offset(skip).limit(limit).all()

def get_out_patient_appointments_by_patient(db: Session, patient_id: str) -> List[models.OutPatientAppointment]:
    return db.query(models.OutPatientAppointment).filter(
        models.OutPatientAppointment.patient_id == patient_id
    ).order_by(models.OutPatientAppointment.date).all()

def get_out_patient_appointments_by_doctor(db: Session, doctor_id: str) -> List[models.OutPatientAppointment]:
    return db.query(models.OutPatientAppointment).filter(
        models.OutPatientAppointment.doctor_id == doctor_id
    ).order_by(models.OutPatientAppointment.date).all()

def get_todays_out_patient_appointments(db: Session) -> List[models.OutPatientAppointment]:
    today = date.today()
    return db.query(models.OutPatientAppointment).filter(
        func.date(models.OutPatientAppointment.date) == today
    ).order_by(models.OutPatientAppointment.date).all()

def create_out_patient_appointment(db: Session, appointment: schemas.OutPatientAppointmentCreate) -> models.OutPatientAppointment:
    db_appointment = models.OutPatientAppointment(
        id=f"op-apt-{str(uuid.uuid4())[:8]}",
        **appointment.dict()
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def update_out_patient_appointment(db: Session, appointment_id: str, appointment_update: schemas.OutPatientAppointmentUpdate) -> Optional[models.OutPatientAppointment]:
    db_appointment = get_out_patient_appointment(db, appointment_id)
    if not db_appointment:
        return None
    
    update_data = appointment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_appointment, field, value)
    
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def cancel_out_patient_appointment(db: Session, appointment_id: str) -> Optional[models.OutPatientAppointment]:
    db_appointment = get_out_patient_appointment(db, appointment_id)
    if not db_appointment:
        return None
    
    db_appointment.status = "cancelled"
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def delete_out_patient_appointment(db: Session, appointment_id: str) -> bool:
    db_appointment = get_out_patient_appointment(db, appointment_id)
    if not db_appointment:
        return False
    db.delete(db_appointment)
    db.commit()
    return True

# In-Patient Admission CRUD operations
def get_in_patient_admission(db: Session, admission_id: str) -> Optional[models.InPatientAdmission]:
    return db.query(models.InPatientAdmission).filter(models.InPatientAdmission.id == admission_id).first()

def get_in_patient_admissions(db: Session, skip: int = 0, limit: int = 100) -> List[models.InPatientAdmission]:
    return db.query(models.InPatientAdmission).offset(skip).limit(limit).all()

def get_in_patient_admissions_by_patient(db: Session, patient_id: str) -> List[models.InPatientAdmission]:
    return db.query(models.InPatientAdmission).filter(
        models.InPatientAdmission.patient_id == patient_id
    ).order_by(models.InPatientAdmission.admission_date.desc()).all()

def get_active_in_patient_admissions(db: Session) -> List[models.InPatientAdmission]:
    return db.query(models.InPatientAdmission).filter(
        models.InPatientAdmission.status == "admitted"
    ).all()

def create_in_patient_admission(db: Session, admission: schemas.InPatientAdmissionCreate) -> models.InPatientAdmission:
    db_admission = models.InPatientAdmission(
        id=f"ip-adm-{str(uuid.uuid4())[:8]}",
        **admission.dict()
    )
    db.add(db_admission)
    db.commit()
    db.refresh(db_admission)
    return db_admission

def update_in_patient_admission(db: Session, admission_id: str, admission_update: schemas.InPatientAdmissionUpdate) -> Optional[models.InPatientAdmission]:
    db_admission = get_in_patient_admission(db, admission_id)
    if not db_admission:
        return None
    
    update_data = admission_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_admission, field, value)
    
    db.commit()
    db.refresh(db_admission)
    return db_admission

def discharge_in_patient_admission(db: Session, admission_id: str) -> Optional[models.InPatientAdmission]:
    db_admission = get_in_patient_admission(db, admission_id)
    if not db_admission:
        return None
    
    db_admission.status = "discharged"
    db_admission.actual_discharge_date = datetime.utcnow()
    
    db.commit()
    db.refresh(db_admission)
    return db_admission

def delete_in_patient_admission(db: Session, admission_id: str) -> bool:
    db_admission = get_in_patient_admission(db, admission_id)
    if not db_admission:
        return False
    db.delete(db_admission)
    db.commit()
    return True

# Feedback CRUD operations
def get_feedback(db: Session, feedback_id: str) -> Optional[models.Feedback]:
    return db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()

def get_feedbacks(db: Session, skip: int = 0, limit: int = 100) -> List[models.Feedback]:
    return db.query(models.Feedback).offset(skip).limit(limit).all()

def get_feedbacks_by_patient(db: Session, patient_id: str) -> List[models.Feedback]:
    return db.query(models.Feedback).filter(models.Feedback.patient_id == patient_id).all()

def get_feedbacks_by_rating(db: Session, rating: str) -> List[models.Feedback]:
    return db.query(models.Feedback).filter(models.Feedback.rating == rating).all()

def create_feedback(db: Session, feedback: schemas.FeedbackCreate) -> models.Feedback:
    db_feedback = models.Feedback(
        id=str(uuid.uuid4()),
        **feedback.dict()
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def update_feedback(db: Session, feedback_id: str, feedback_update: schemas.FeedbackUpdate) -> Optional[models.Feedback]:
    db_feedback = get_feedback(db, feedback_id)
    if not db_feedback:
        return None
    
    update_data = feedback_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_feedback, field, value)
    
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def delete_feedback(db: Session, feedback_id: str) -> bool:
    db_feedback = get_feedback(db, feedback_id)
    if not db_feedback:
        return False
    db.delete(db_feedback)
    db.commit()
    return True 