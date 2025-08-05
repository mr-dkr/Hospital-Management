import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, UserPlus, User, Bell, Edit } from 'lucide-react';
import { Patient } from '../../types';
import { format, isToday, isYesterday } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { patientsAPI, OutPatient } from '../../api/patients';
import { appointmentsAPI, OutPatientAppointment } from '../../api/appointments';

const PatientListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<OutPatient[]>([]);
  const [appointments, setAppointments] = useState<OutPatientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackSent, setFeedbackSent] = useState<{ [patientId: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState<{ [patientId: string]: boolean }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { state } = useAuth();
  const user = state.user;

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [patientsData, appointmentsData] = await Promise.all([
          patientsAPI.getOutPatients(token),
          appointmentsAPI.getOutPatientAppointments(token)
        ]);

        setPatients(patientsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  const handleGetFeedback = async (patient: OutPatient) => {
    setIsLoading(prev => ({ ...prev, [patient.id]: true }));
    // Get all appointments for this patient
    const patientAppointments = appointments.filter(a => a.patient_id === patient.id);
    // Find the latest appointment by date
    const lastRecentAppointment = patientAppointments
      .filter(a => isToday(new Date(a.date)) || isYesterday(new Date(a.date)))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    // Format date and time if available
    const dateStr = lastRecentAppointment ? new Date(lastRecentAppointment.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase() : '';
    const timeStr = lastRecentAppointment ? new Date(lastRecentAppointment.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).replace(':00', '').toUpperCase() : '';
    const payload = {
      to: `+91${patient.phone}`,
      name: patient.name,
      date: dateStr,
      doc_name: user?.name || 'Doctor',
      time: timeStr,
      message_type: 'feedback',
      message_lang: 'us',
    };
    try {
      const response = await fetch('https://alti.prajnagpt.net:7500/api/whatsapp/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setFeedbackSent(prev => ({ ...prev, [patient.id]: true }));
        setShowAlert(true);
        setAlertMessage(`Feedback request sent to ${patient.name}.`)
      } else {
        setAlertMessage(`Failed to send feedback request to ${patient.name}.`);
      }
    } catch {
      setAlertMessage(`Failed to send feedback request to ${patient.name}.`);
    }
    setIsLoading(prev => ({ ...prev, [patient.id]: false }));
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <div className="animate-fade-in">
      {/* Alert notification */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            <span>{alertMessage}</span>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Patients</h1>
        <Link
          to="/patients/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add New Patient
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-64 mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading patients...</p>
          </div>
        ) : filteredPatients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => {
                  // Calculate age
                  const birthDate = new Date(patient.date_of_birth);
                  const today = new Date();
                  let age = today.getFullYear() - birthDate.getFullYear();
                  const m = today.getMonth() - birthDate.getMonth();
                  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                  }

                  return (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                            <User size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">{format(new Date(patient.created_at), 'MMM dd, yyyy')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.phone}</div>
                        <div className="text-sm text-gray-500">{patient.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 px-2 py-1">
                          {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {age} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.blood_group || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        N/A
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/patients/${patient.id}`}
                            className="text-primary-600 hover:text-primary-900 transition-colors"
                          >
                            View
                          </Link>

                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-3">
                          {!feedbackSent[patient.id] ? (
                            <button
                              onClick={() => handleGetFeedback(patient)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                              disabled={isLoading[patient.id]}
                            >
                              {isLoading[patient.id] ? (
                                <>
                                  <span className="animate-pulse">Loading...</span>
                                </>
                              ) : (
                                <>
                                  <Edit className="h-3 w-3 mr-1" />
                                  Get Feedback
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="inline-flex items-center text-green-600 text-sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Request Sent ✓
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div className="mt-6">
              <Link
                to="/patients/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Patient
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientListPage;