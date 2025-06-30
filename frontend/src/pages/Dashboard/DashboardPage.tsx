import React from 'react';
import { Users, Activity, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockPatients, mockVisits } from '../../data/mockData';
import { format } from 'date-fns';

const DashboardPage = () => {
  const { state } = useAuth();
  const user = state.user;

  // Get upcoming appointments (visits with a future date)
  const upcomingAppointments = mockVisits
    .filter(visit => {
      const visitDate = new Date(visit.date);
      return visitDate > new Date();
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Get recent visits
  const recentVisits = [...mockVisits]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="animate-fade-in">
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
            <h3 className="text-2xl font-bold">{mockPatients.length}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="h-12 w-12 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center mr-4">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Visits</p>
            <h3 className="text-2xl font-bold">{mockVisits.length}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="h-12 w-12 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center mr-4">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Upcoming Appointments</p>
            <h3 className="text-2xl font-bold">{upcomingAppointments.length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
            <Link to="/appointments" className="text-primary-600 text-sm hover:underline flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="p-4">
            {upcomingAppointments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {upcomingAppointments.map(appointment => {
                  const patient = mockPatients.find(p => p.id === appointment.patientId);
                  return (
                    <li key={appointment.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          {patient?.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">{patient?.name}</h3>
                          <p className="text-xs text-gray-500">
                            {appointment.chiefComplaints.length > 30 
                              ? `${appointment.chiefComplaints.substring(0, 30)}...` 
                              : appointment.chiefComplaints}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {format(new Date(appointment.date), 'MMM dd, h:mm a')}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No upcoming appointments
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Visits</h2>
            <Link to="/patients" className="text-primary-600 text-sm hover:underline flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="p-4">
            {recentVisits.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentVisits.map(visit => {
                  const patient = mockPatients.find(p => p.id === visit.patientId);
                  return (
                    <li key={visit.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            {patient?.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">{patient?.name}</h3>
                            <p className="text-xs text-gray-500">
                              {visit.diagnosis.length > 30 
                                ? `${visit.diagnosis.substring(0, 30)}...` 
                                : visit.diagnosis}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {format(new Date(visit.date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No recent visits
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;