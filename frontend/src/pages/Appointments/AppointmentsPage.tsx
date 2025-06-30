import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { mockPatients, mockVisits } from '../../data/mockData';

const AppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Filter appointments based on search and date
  const appointments = mockVisits
    .filter(visit => {
      const patient = mockPatients.find(p => p.id === visit.patientId);
      const matchesSearch = patient?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = visit.date.startsWith(selectedDate);
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Appointments</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
          <Plus className="h-5 w-5 mr-2" />
          New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="relative">
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
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Appointments for {format(new Date(selectedDate), 'MMMM dd, yyyy')}
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {appointments.map((appointment) => {
                const patient = mockPatients.find(p => p.id === appointment.patientId);
                return (
                  <div key={appointment.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">{patient?.name}</h3>
                          <p className="text-sm text-gray-500">{appointment.chiefComplaints}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {format(new Date(appointment.date), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {format(new Date(appointment.date), 'h:mm a')}
                          </div>
                        </div>
                        <button className="px-3 py-1 text-sm text-primary-600 hover:text-primary-800">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {appointments.length === 0 && (
                <div className="p-8 text-center">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are no appointments scheduled for this date.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;