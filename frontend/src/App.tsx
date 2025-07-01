import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './components/Layout/MainLayout';

// Pages
import AuthPage from './pages/Auth/AuthPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PatientListPage from './pages/Patients/PatientListPage';
import AddPatientPage from './pages/Patients/AddPatientPage';
import PatientDetailPage from './pages/Patients/PatientDetailPage';
import AppointmentsPage from './pages/Appointments/AppointmentsPage';
import NewAppointmentPage from './pages/Appointments/NewAppointmentPage';
import ChatPage from './pages/Chat/ChatPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="patients" element={<PatientListPage />} />
            <Route path="patients/new" element={<AddPatientPage />} />
            <Route path="patients/:id" element={<PatientDetailPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="appointments/new" element={<NewAppointmentPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;