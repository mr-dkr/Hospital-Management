 # Hospital Management System - Backend API

A comprehensive FastAPI backend for managing hospital operations including out-patients, in-patients, appointments, and feedback.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Out-Patient Management**: Complete CRUD operations for out-patients, visits, and medications
- **In-Patient Management**: Comprehensive in-patient management with rounds, medications, and admissions
- **Appointment Scheduling**: Out-patient appointment management with status tracking
- **Feedback System**: Patient feedback collection and analysis
- **User Management**: Doctor and admin user management

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database
- **Pydantic**: Data validation using Python type annotations
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # Authentication utilities
│   ├── crud.py              # CRUD operations
│   └── routers/             # API route handlers
│       ├── __init__.py
│       ├── auth.py          # Authentication routes
│       ├── users.py         # User management routes
│       ├── out_patients.py  # Out-patient routes
│       ├── in_patients.py   # In-patient routes
│       ├── appointments.py  # Appointment routes
│       └── feedback.py      # Feedback routes
├── requirements.txt         # Python dependencies
├── run.py                  # Server startup script
└── README.md               # This file
```

## Installation

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up the database**:
   ```bash
   # The database will be created automatically when you start the server
   # Make sure the database file is in the correct location
   ```

3. **Start the server**:
   ```bash
   # Option 1: Using uvicorn directly
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Option 2: Using the run script
   python run.py
   ```

## API Documentation

Once the server is running, you can access:

- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/token` - Login and get access token
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/users/` - Get all users (admin only)
- `GET /api/users/{user_id}` - Get specific user
- `POST /api/users/` - Create new user (admin only)
- `PUT /api/users/{user_id}` - Update user
- `DELETE /api/users/{user_id}` - Delete user (admin only)

### Out-Patients
- `GET /api/out-patients/` - Get all out-patients
- `GET /api/out-patients/{patient_id}` - Get specific out-patient
- `POST /api/out-patients/` - Create new out-patient
- `PUT /api/out-patients/{patient_id}` - Update out-patient
- `DELETE /api/out-patients/{patient_id}` - Delete out-patient

### In-Patients
- `GET /api/in-patients/` - Get all in-patients
- `GET /api/in-patients/admitted` - Get admitted in-patients
- `GET /api/in-patients/{patient_id}` - Get specific in-patient
- `POST /api/in-patients/` - Create new in-patient
- `PUT /api/in-patients/{patient_id}` - Update in-patient
- `POST /api/in-patients/{patient_id}/discharge` - Discharge in-patient
- `DELETE /api/in-patients/{patient_id}` - Delete in-patient

### Appointments
- `GET /api/appointments/out-patients` - Get all out-patient appointments
- `GET /api/appointments/out-patients/today` - Get today's appointments
- `POST /api/appointments/out-patients` - Create out-patient appointment
- `PUT /api/appointments/out-patients/{appointment_id}` - Update appointment
- `POST /api/appointments/out-patients/{appointment_id}/cancel` - Cancel appointment

### Feedback
- `GET /api/feedback/` - Get all feedback
- `GET /api/feedback/{feedback_id}` - Get specific feedback
- `POST /api/feedback/` - Create new feedback
- `PUT /api/feedback/{feedback_id}` - Update feedback
- `DELETE /api/feedback/{feedback_id}` - Delete feedback

## Authentication

The API uses JWT tokens for authentication. To access protected endpoints:

1. **Login** to get a token:
   ```bash
   curl -X POST "http://localhost:8000/api/auth/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=your_email&password=your_password"
   ```

2. **Use the token** in subsequent requests:
   ```bash
   curl -X GET "http://localhost:8000/api/out-patients/" \
        -H "Authorization: Bearer your_token_here"
   ```

## Database Schema

The API supports both Out-Patients and In-Patients with separate tables:

### Out-Patients
- Basic patient information
- Emergency contacts
- Insurance details
- Visit records
- Medications
- Appointments

### In-Patients
- All out-patient features plus:
- Admission/discharge management
- Room and bed assignments
- Daily rounds
- In-patient medications with routes
- Vital signs tracking

## Development

### Running Tests
```bash
# Install test dependencies
pip install pytest httpx

# Run tests
pytest
```

### Code Formatting
```bash
# Install formatting tools
pip install black isort

# Format code
black app/
isort app/
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./hospital_management.db
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Deployment

For production deployment:

1. **Use a production database** (PostgreSQL, MySQL)
2. **Set secure environment variables**
3. **Use a production ASGI server** (Gunicorn with Uvicorn workers)
4. **Enable HTTPS**
5. **Set up proper CORS configuration**

Example production command:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Support

For issues and questions, please check the API documentation at `/docs` when the server is running.