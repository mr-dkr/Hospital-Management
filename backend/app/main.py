from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import auth, users, out_patients, in_patients, appointments, feedback
import uvicorn


# Create database tables
models.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Hospital Management System API",
    description="A comprehensive API for managing hospital operations including out-patients, in-patients, appointments, and feedback",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(out_patients.router, prefix="/api/out-patients", tags=["Out-Patients"])
app.include_router(in_patients.router, prefix="/api/in-patients", tags=["In-Patients"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["Feedback"])

@app.get("/")
async def root():
    return {
        "message": "Hospital Management System API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"} 



if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)