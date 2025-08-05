import React, { useState, useEffect } from 'react';
import { Users, Activity, Calendar, ChevronRight, Bell, Phone, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { patientsAPI, OutPatient } from '../../api/patients';
import { appointmentsAPI, OutPatientAppointment } from '../../api/appointments';

const DashboardPage = () => {
  const { state } = useAuth();
  const user = state.user;
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState<{ [appointmentId: string]: boolean }>({});
  const [patients, setPatients] = useState<OutPatient[]>([]);
  const [appointments, setAppointments] = useState<OutPatientAppointment[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Get today's appointments
  const todaysAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === today.toDateString();
  });

  const handleSendReminder = async (appointment: OutPatientAppointment, patient: OutPatient) => {
    // Prepare WhatsApp API payload
    setIsLoading(prev => ({ ...prev, [appointment.id]: true }));

    const payload = {
      to: `+91${patient.phone}`,
      name: patient.name,
      date: format(new Date(appointment.date), 'do MMMM yyyy').toUpperCase(),
      doc_name: user?.name || 'Doctor',
      time: format(new Date(appointment.date), 'h:mm a').toUpperCase(),
      message_type: 'reminder',
      message_lang: 'us',
    };

    try {
      const response = await fetch('https://alti.prajnagpt.net:7500/api/whatsapp/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        // Update appointment reminder status in the backend
        const token = localStorage.getItem('token');
        if (token) {
          await appointmentsAPI.updateOutPatientAppointment(appointment.id, { reminder_sent: true }, token);
        }
        setAlertMessage(`Reminder sent to ${patient.name} successfully!`);
      } else {
        setAlertMessage(`Failed to send reminder to ${patient.name}.`);
      }
    } catch (error) {
      setAlertMessage(`Failed to send reminder to ${patient.name}.`);
    }
    setIsLoading(prev => ({ ...prev, [appointment.id]: false }));

    setShowAlert(true);
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

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          {format(new Date(), 'EEEE, MMMM dd, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="h-12 w-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mr-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Patients</p>
            <h3 className="text-2xl font-bold">{loading ? '...' : patients.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="h-12 w-12 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center mr-4">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Today's Appointments</p>
            <h3 className="text-2xl font-bold">{todaysAppointments.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="h-12 w-12 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center mr-4">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Reminders</p>
            <h3 className="text-2xl font-bold">
              {loading ? '...' : todaysAppointments.filter(apt => !apt.reminder_sent).length}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Today's Appointments</h2>
            <Link to="/appointments" className="text-primary-600 text-sm hover:underline flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading appointments...</p>
              </div>
            ) : todaysAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Patient Name</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Phone Number</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Time</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Type</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Reminder Status</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaysAppointments.map(appointment => {
                      const patient = patients.find(p => p.id === appointment.patient_id);
                      return (
                        <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                                <UserIcon className="h-4 w-4 text-primary-600" />
                              </div>
                              <span className="text-sm font-medium">{patient?.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-sm text-gray-600">{patient?.phone}</td>
                          <td className="py-3 px-3 text-sm text-gray-600">
                            {format(new Date(appointment.date), 'h:mm a')}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${appointment.type === 'walk-in'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                              }`}>
                              {appointment.type === 'walk-in' ? (
                                <>
                                  <UserIcon className="h-3 w-3 mr-1" />
                                  Walk-in
                                </>
                              ) : (
                                <>
                                  <Phone className="h-3 w-3 mr-1" />
                                  Phone Call
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-3">

                            {appointment.reminder_sent ? (
                              <span className="inline-flex items-center text-green-600 text-sm">
                                <Bell className="h-4 w-4 mr-1" />
                                Reminder Sent ✓
                              </span>
                            ) : (
                              <span className="text-gray-500 text-sm">Not Sent</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <Link
                              to={`/patients/${patient?.id}`}
                              className="text-primary-600 hover:text-primary-900 transition-colors mr-6"
                            >
                              View
                            </Link>
                            {!appointment.reminder_sent && (
                              <button
                                onClick={() => handleSendReminder(appointment, patient)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                                disabled={isLoading[appointment.id]}
                              >
                                {isLoading[appointment.id] ? (
                                  <span className="animate-pulse">Loading...</span>
                                ) : (
                                  <>
                                    <Bell className="h-3 w-3 mr-1" />
                                    Send Reminder
                                  </>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No appointments scheduled for today
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;