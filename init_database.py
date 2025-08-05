#!/usr/bin/env python3
"""
Hospital Management System Database Initialization Script
This script creates the SQLite database and populates it with sample data.
"""

import sqlite3
import os
import json
from datetime import datetime


def create_database():
    """Create the SQLite database and initialize it with schema and sample data."""

    # Database file path
    db_path = 'hospital_management.db'

    # Remove existing database if it exists
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Removed existing database: {db_path}")

    # Create new database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("Creating database schema...")

    # Read and execute schema
    with open('database/schema.sql', 'r') as schema_file:
        schema_sql = schema_file.read()
        cursor.executescript(schema_sql)

    print("Schema created successfully!")

    # Read and execute sample data
    print("Inserting sample data...")
    with open('database/sample_data.sql', 'r') as data_file:
        data_sql = data_file.read()
        cursor.executescript(data_sql)

    print("Sample data inserted successfully!")

    # Commit changes and close connection
    conn.commit()
    conn.close()

    print(f"Database '{db_path}' created successfully!")
    print("Database contains the following tables:")
    print("Core Tables:")
    print("- users")
    print("- feedback")
    print("Out-Patient Tables:")
    print("- out_patients")
    print("- out_patient_visits")
    print("- out_patient_medications")
    print("- out_patient_appointments")
    print("In-Patient Tables:")
    print("- in_patients")
    print("- in_patient_rounds")
    print("- in_patient_medications")
    print("- in_patient_admissions")
    print("Legacy Tables:")
    print("- patients")
    print("- visits")
    print("- medications")
    print("- appointments")

    return db_path


def verify_database(db_path):
    """Verify that the database was created correctly with sample data."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("\nVerifying database contents...")

    # Check table counts
    tables = [
        'users',
        'out_patients', 'in_patients', 'patients',
        'out_patient_visits', 'in_patient_rounds', 'visits',
        'out_patient_medications', 'in_patient_medications', 'medications',
        'out_patient_appointments', 'in_patient_admissions', 'appointments',
        'feedback'
    ]

    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        print(f"- {table}: {count} records")

    # Show some sample data
    print("\nSample data preview:")

    # Show a few out-patients
    cursor.execute("SELECT id, name, email, phone FROM out_patients LIMIT 3")
    out_patients = cursor.fetchall()
    print("Out-Patients:")
    for patient in out_patients:
        print(f"  - {patient[1]} ({patient[2]}) - {patient[3]}")

    # Show a few in-patients
    cursor.execute("SELECT id, name, room_number, ward_type, status FROM in_patients LIMIT 3")
    in_patients = cursor.fetchall()
    print("In-Patients:")
    for patient in in_patients:
        print(f"  - {patient[1]} - Room {patient[2]} ({patient[3]}) - {patient[4]}")

    # Show a few appointments
    cursor.execute("""
        SELECT oa.id, op.name, oa.date, oa.status 
        FROM out_patient_appointments oa 
        JOIN out_patients op ON oa.patient_id = op.id 
        LIMIT 3
    """)
    appointments = cursor.fetchall()
    print("Out-Patient Appointments:")
    for apt in appointments:
        print(f"  - {apt[1]} - {apt[2]} ({apt[3]})")

    conn.close()


if __name__ == "__main__":
    try:
        db_path = create_database()
        verify_database(db_path)
        print("\nDatabase initialization completed successfully!")
    except Exception as e:
        print(f"Error creating database: {e}")
        exit(1)