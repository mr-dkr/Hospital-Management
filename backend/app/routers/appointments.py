from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas, auth
from ..database import get_db

router = APIRouter()

# Out-Patient Appointments
@router.get("/out-patients", response_model=List[schemas.OutPatientAppointment])
async def read_out_patient_appointments(skip: int = 0, limit: int = 100, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    return crud.get_out_patient_appointments(db, skip=skip, limit=limit)

@router.get("/out-patients/today", response_model=List[schemas.OutPatientAppointment])
async def read_todays_out_patient_appointments(current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    return crud.get_todays_out_patient_appointments(db)

@router.get("/out-patients/{appointment_id}", response_model=schemas.OutPatientAppointment)
async def read_out_patient_appointment(appointment_id: str, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    appointment = crud.get_out_patient_appointment(db, appointment_id=appointment_id)
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.post("/out-patients", response_model=schemas.OutPatientAppointment)
async def create_out_patient_appointment(appointment: schemas.OutPatientAppointmentCreate, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    if not appointment.doctor_id:
        appointment.doctor_id = current_user.id
    return crud.create_out_patient_appointment(db=db, appointment=appointment)

@router.put("/out-patients/{appointment_id}", response_model=schemas.OutPatientAppointment)
async def update_out_patient_appointment(appointment_id: str, appointment_update: schemas.OutPatientAppointmentUpdate, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    appointment = crud.update_out_patient_appointment(db=db, appointment_id=appointment_id, appointment_update=appointment_update)
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.post("/out-patients/{appointment_id}/cancel", response_model=schemas.OutPatientAppointment)
async def cancel_out_patient_appointment(appointment_id: str, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    appointment = crud.cancel_out_patient_appointment(db=db, appointment_id=appointment_id)
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.delete("/out-patients/{appointment_id}")
async def delete_out_patient_appointment(appointment_id: str, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    success = crud.delete_out_patient_appointment(db=db, appointment_id=appointment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment deleted successfully"}

# In-Patient Admissions
@router.get("/in-patients", response_model=List[schemas.InPatientAdmission])
async def read_in_patient_admissions(skip: int = 0, limit: int = 100, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    return crud.get_in_patient_admissions(db, skip=skip, limit=limit)

@router.get("/in-patients/active", response_model=List[schemas.InPatientAdmission])
async def read_active_in_patient_admissions(current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    return crud.get_active_in_patient_admissions(db)

@router.get("/in-patients/{admission_id}", response_model=schemas.InPatientAdmission)
async def read_in_patient_admission(admission_id: str, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    admission = crud.get_in_patient_admission(db, admission_id=admission_id)
    if admission is None:
        raise HTTPException(status_code=404, detail="Admission not found")
    return admission

@router.post("/in-patients", response_model=schemas.InPatientAdmission)
async def create_in_patient_admission(admission: schemas.InPatientAdmissionCreate, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    if not admission.admitting_doctor_id:
        admission.admitting_doctor_id = current_user.id
    return crud.create_in_patient_admission(db=db, admission=admission)

@router.put("/in-patients/{admission_id}", response_model=schemas.InPatientAdmission)
async def update_in_patient_admission(admission_id: str, admission_update: schemas.InPatientAdmissionUpdate, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    admission = crud.update_in_patient_admission(db=db, admission_id=admission_id, admission_update=admission_update)
    if admission is None:
        raise HTTPException(status_code=404, detail="Admission not found")
    return admission

@router.post("/in-patients/{admission_id}/discharge", response_model=schemas.InPatientAdmission)
async def discharge_in_patient_admission(admission_id: str, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    admission = crud.discharge_in_patient_admission(db=db, admission_id=admission_id)
    if admission is None:
        raise HTTPException(status_code=404, detail="Admission not found")
    return admission

@router.delete("/in-patients/{admission_id}")
async def delete_in_patient_admission(admission_id: str, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    success = crud.delete_in_patient_admission(db=db, admission_id=admission_id)
    if not success:
        raise HTTPException(status_code=404, detail="Admission not found")
    return {"message": "Admission deleted successfully"} 