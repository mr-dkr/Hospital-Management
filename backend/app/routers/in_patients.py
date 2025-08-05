from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas, auth
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.InPatient])
async def read_in_patients(skip: int = 0, limit: int = 100, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    return crud.get_in_patients(db, skip=skip, limit=limit)

@router.get("/admitted", response_model=List[schemas.InPatient])
async def read_admitted_in_patients(current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    return crud.get_admitted_in_patients(db)

@router.get("/{patient_id}", response_model=schemas.InPatient)
async def read_in_patient(patient_id: str, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    in_patient = crud.get_in_patient(db, patient_id=patient_id)
    if in_patient is None:
        raise HTTPException(status_code=404, detail="In-patient not found")
    return in_patient

@router.post("/", response_model=schemas.InPatient)
async def create_in_patient(in_patient: schemas.InPatientCreate, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    return crud.create_in_patient(db=db, patient=in_patient)

@router.put("/{patient_id}", response_model=schemas.InPatient)
async def update_in_patient(patient_id: str, in_patient_update: schemas.InPatientUpdate, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    in_patient = crud.update_in_patient(db=db, patient_id=patient_id, patient_update=in_patient_update)
    if in_patient is None:
        raise HTTPException(status_code=404, detail="In-patient not found")
    return in_patient

@router.post("/{patient_id}/discharge", response_model=schemas.InPatient)
async def discharge_in_patient(patient_id: str, discharge_diagnosis: str, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    in_patient = crud.discharge_in_patient(db=db, patient_id=patient_id, discharge_diagnosis=discharge_diagnosis, discharge_doctor_id=current_user.id)
    if in_patient is None:
        raise HTTPException(status_code=404, detail="In-patient not found")
    return in_patient

@router.delete("/{patient_id}")
async def delete_in_patient(patient_id: str, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    success = crud.delete_in_patient(db=db, patient_id=patient_id)
    if not success:
        raise HTTPException(status_code=404, detail="In-patient not found")
    return {"message": "In-patient deleted successfully"} 