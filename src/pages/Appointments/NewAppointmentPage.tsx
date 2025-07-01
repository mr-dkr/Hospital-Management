import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Search, User, Phone, UserPlus, Calendar, Clock } from 'lucide-react';
import { getPatients, addPatient, addAppointment } from '../../data/mockData';
import { AppointmentFormData } from '../../types';
import { format } from 'date-fns';

const NewAppointmentPage = () => {
  const navigate = useNavigate();
  const [appointmentType, setAppointmentType] = useState<'existing' | 'new'>('existing');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  const patients = getPatients();
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const [formData, setFormData] = useState<AppointmentFormData>({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    type: 'walk-in',
    notes: '',
    newPatient: {
      name: '',
      phone: '',
      email: '',
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('newPatient.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        newPatient: {
          ...prev.newPatient!,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let patientId = selectedPatient;
      
      // If creating new patient, add them first
      if (appointmentType === 'new' && formData.newPatient) {
        const newPatient = addPatient({
          name: formData.newPatient.name,
          phone: formData.newPatient.phone,
          email: formData.newPatient.email || '',
          gender: 'male', // Default value
          dateOfBirth: '1990-01-01', // Default value
          address: '',
          allergies: [],
        });
        patientId = newPatient.id;
        
        // Show confirmation for new patient
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
      
      // Create appointment
      const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
      
      addAppointment({
        patientId,
        date: appointmentDateTime.toISOString(),
        type: formData.type,
        status: 'scheduled',
        reminderSent: false,
        notes: formData.notes,
      });
      
      // Navigate back to appointments
      navigate('/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Alert for new patient registration */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
          <div className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            <span>New patient registered and appointment confirmation sent!</span>
          </div>
        </div>
      )}

      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Create New Appointment</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Patient Type Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Patient Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAppointmentType('existing')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                appointmentType === 'existing'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <User className="h-6 w-6 mr-3 text-primary-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Existing Patient</h4>
                  <p className="text-sm text-gray-500">Choose from existing patient list</p>
                </div>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setAppointmentType('new')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                appointmentType === 'new'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <UserPlus className="h-6 w-6 mr-3 text-primary-600" />
                <div>
                  <h4 className="font-medium text-gray-900">New Patient</h4>
                  <p className="text-sm text-gray-500">Register new patient and schedule</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Patient Selection/Registration */}
          {appointmentType === 'existing' ? (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Patient</h3>
              
              {/* Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search patients by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              {/* Patient List */}
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                {filteredPatients.map((patient) => (
                  <label
                    key={patient.id}
                    className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      selectedPatient === patient.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedPatient"
                      value={patient.id}
                      checked={selectedPatient === patient.id}
                      onChange={(e) => setSelectedPatient(e.target.value)}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                      required
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.phone}</p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
                
                {filteredPatients.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No patients found. Try adjusting your search.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">New Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newPatient.name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="newPatient.name"
                    name="newPatient.name"
                    required
                    value={formData.newPatient?.name || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPatient.phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="newPatient.phone"
                    name="newPatient.phone"
                    required
                    value={formData.newPatient?.phone || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="newPatient.email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="newPatient.email"
                    name="newPatient.email"
                    value={formData.newPatient?.email || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Appointment Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="walk-in">Walk-in</option>
                  <option value="phone-call">Phone Call</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Any additional notes for the appointment..."
            />
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (appointmentType === 'existing' && !selectedPatient)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentPage;