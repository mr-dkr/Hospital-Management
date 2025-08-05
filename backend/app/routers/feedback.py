from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas, auth
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.Feedback])
async def read_feedbacks(skip: int = 0, limit: int = 100, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    return crud.get_feedbacks(db, skip=skip, limit=limit)

@router.get("/{feedback_id}", response_model=schemas.Feedback)
async def read_feedback(feedback_id: str, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    feedback = crud.get_feedback(db, feedback_id=feedback_id)
    if feedback is None:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return feedback

@router.post("/", response_model=schemas.Feedback)
async def create_feedback(feedback: schemas.FeedbackCreate, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    return crud.create_feedback(db=db, feedback=feedback)

@router.put("/{feedback_id}", response_model=schemas.Feedback)
async def update_feedback(feedback_id: str, feedback_update: schemas.FeedbackUpdate, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    feedback = crud.update_feedback(db=db, feedback_id=feedback_id, feedback_update=feedback_update)
    if feedback is None:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return feedback

@router.delete("/{feedback_id}")
async def delete_feedback(feedback_id: str, current_user: schemas.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    success = crud.delete_feedback(db=db, feedback_id=feedback_id)
    if not success:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return {"message": "Feedback deleted successfully"} 