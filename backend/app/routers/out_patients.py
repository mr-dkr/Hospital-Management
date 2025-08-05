from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas, auth
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.OutPatient])
async def read_out_patients(skip: int = 0, limit: int = 100, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    return crud.get_out_patients(db, skip=skip, limit=limit)

@router.get("/{patient_id}", response_model=schemas.OutPatient)
async def read_out_patient(patient_id: str, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    out_patient = crud.get_out_patient(db, patient_id=patient_id)
    if out_patient is None:
        raise HTTPException(status_code=404, detail="Out-patient not found")
    return out_patient

@router.post("/", response_model=schemas.OutPatient)
async def create_out_patient(out_patient: schemas.OutPatientCreate, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    return crud.create_out_patient(db=db, patient=out_patient)

@router.put("/{patient_id}", response_model=schemas.OutPatient)
async def update_out_patient(patient_id: str, out_patient_update: schemas.OutPatientUpdate, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    out_patient = crud.update_out_patient(db=db, patient_id=patient_id, patient_update=out_patient_update)
    if out_patient is None:
        raise HTTPException(status_code=404, detail="Out-patient not found")
    return out_patient

@router.delete("/{patient_id}")
async def delete_out_patient(patient_id: str, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    success = crud.delete_out_patient(db=db, patient_id=patient_id)
    if not success:
        raise HTTPException(status_code=404, detail="Out-patient not found")
    return {"message": "Out-patient deleted successfully"} 