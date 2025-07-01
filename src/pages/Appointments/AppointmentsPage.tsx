import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Plus, Search, Bell, Phone, UserIcon } from 'lucide-react';
import { format, isToday, isYesterday, isTomorrow } from 'date-fns';
import { getAppointments, getPatientById, updateAppointmentReminderStatus } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Appointment, Patient } from '../../types';

const AppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('today');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { state } = useAuth();
  const user = state.user;
  const [isLoading, setIsLoading] = useState<{ [appointmentId: string]: boolean }>({});

  const appointments = getAppointments();

  // Filter appointments by tab
  const getFilteredAppointments = () => {
    const filtered = appointments.filter(appointment => {
      const patient = getPatientById(appointment.patientId);
      const matchesSearch = patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient?.phone.includes(searchTerm);

      const appointmentDate = new Date(appointment.date);

      let matchesTab = false;
      switch (activeTab) {
        case 'yesterday':
          matchesTab = isYesterday(appointmentDate);
          break;
        case 'today':
          matchesTab = isToday(appointmentDate);
          break;
        case 'tomorrow':
          matchesTab = isTomorrow(appointmentDate);
          break;
        default:
          matchesTab = true;
      }

      return matchesSearch && matchesTab;
    });

    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const filteredAppointments = getFilteredAppointments();

  const handleSendReminder = async (appointment: Appointment, patient: Patient) => {
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
        updateAppointmentReminderStatus(appointment.id);
        setAlertMessage(`Reminder sent to ${patient.name} successfully!`);
      } else {
        setAlertMessage(`Failed to send reminder to ${patient.name}.`);
      }
    } catch {
      setAlertMessage(`Failed to send reminder to ${patient.name}.`);
    }
    setIsLoading(prev => ({ ...prev, [appointment.id]: false }));
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const getTabCounts = () => {
    const yesterday = appointments.filter(apt => isYesterday(new Date(apt.date))).length;
    const today = appointments.filter(apt => isToday(new Date(apt.date))).length;
    const tomorrow = appointments.filter(apt => isTomorrow(new Date(apt.date))).length;

    return { yesterday, today, tomorrow };
  };

  const tabCounts = getTabCounts();

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
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Appointments</h1>
        <Link
          to="/appointments/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Appointment
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4">
            {[
              { key: 'yesterday', label: 'Previous Day', count: tabCounts.yesterday },
              { key: 'today', label: 'Today', count: tabCounts.today },
              { key: 'tomorrow', label: 'Tomorrow', count: tabCounts.tomorrow },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === tab.key
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto">
          {filteredAppointments.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent Reminder Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => {
                  const patient = getPatientById(appointment.patientId);
                  return (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{patient?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient?.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {format(new Date(appointment.date), 'MMM dd, yyyy')}
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {format(new Date(appointment.date), 'h:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${appointment.type === 'walk-in'
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {appointment.reminderSent ? (
                          <span className="inline-flex items-center text-green-600 text-sm">
                            <Bell className="h-4 w-4 mr-1" />
                            Reminder Sent ✓
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">Not Sent</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/patients/${patient?.id}`}
                          className="text-primary-600 hover:text-primary-900 transition-colors mr-6"
                        >
                          View
                        </Link>
                        {!appointment.reminderSent && patient && (
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
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'today'
                  ? "There are no appointments scheduled for today."
                  : activeTab === 'yesterday'
                    ? "There were no appointments yesterday."
                    : "There are no appointments scheduled for tomorrow."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;