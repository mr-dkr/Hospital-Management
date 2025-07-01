import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, Phone, Mail, MapPin, Calendar, Droplet, ArrowLeft, 
  AlertCircle, Plus, Clock, FileText, PlusCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { getPatientById, getVisitsByPatientId, addVisit } from '../../data/mockData';
import { Visit, Medication } from '../../types';

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewVisitForm, setShowNewVisitForm] = useState(false);
  
  const patient = getPatientById(id || '');
  const visits = getVisitsByPatientId(id || '');
  
  // New visit form state
  const [newVisitData, setNewVisitData] = useState({
    date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
    chiefComplaints: '',
    diagnosis: '',
    medications: '',
    notes: '',
    followUpDate: '',
  });
  
  if (!patient) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Patient not found</h3>
        <p className="mt-1 text-gray-500">The patient you're looking for doesn't exist or has been removed.</p>
        <div className="mt-6">
          <Link
            to="/patients"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Go back to patients
          </Link>
        </div>
      </div>
    );
  }
  
  // Format patient age
  const birthDate = new Date(patient.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  const handleNewVisitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewVisitData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitNewVisit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse medications from string to array of objects
    const medicationsArray: Medication[] = newVisitData.medications
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [name, details] = line.split(':');
        if (!details) return { name: line.trim(), dosage: '', frequency: '', duration: '' };
        
        const [dosage = '', frequency = '', duration = ''] = details.split(',');
        return {
          name: name.trim(),
          dosage: dosage.trim(),
          frequency: frequency.trim(),
          duration: duration.trim(),
        };
      });
    
    // Add the visit
    addVisit({
      patientId: patient.id,
      date: newVisitData.date,
      chiefComplaints: newVisitData.chiefComplaints,
      diagnosis: newVisitData.diagnosis,
      medications: medicationsArray,
      notes: newVisitData.notes,
      followUpDate: newVisitData.followUpDate || undefined,
    });
    
    // Reset form and hide it
    setNewVisitData({
      date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      chiefComplaints: '',
      diagnosis: '',
      medications: '',
      notes: '',
      followUpDate: '',
    });
    setShowNewVisitForm(false);
    
    // Refresh visits
    getVisitsByPatientId(patient.id);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Patient Details</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="md:flex">
          <div className="p-6 md:w-1/3 bg-primary-50 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-24 w-24 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-3xl font-bold mb-4">
                {patient.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
              <p className="text-sm text-gray-500">{age} years, {patient.gender}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-500">{patient.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-500">{patient.address || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Date of Birth</p>
                  <p className="text-sm text-gray-500">{format(new Date(patient.dateOfBirth), 'MMMM dd, yyyy')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Droplet className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Blood Group</p>
                  <p className="text-sm text-gray-500">{patient.bloodGroup || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Allergies</p>
                  {patient.allergies && patient.allergies.length > 0 ? (
                    <ul className="text-sm text-gray-500 list-disc list-inside">
                      {patient.allergies.map((allergy, idx) => (
                        <li key={idx}>{allergy}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No known allergies</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-4 text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('visits')}
                  className={`pb-4 text-sm font-medium ${
                    activeTab === 'visits'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Visit History
                </button>
              </div>
            </div>
            
            {activeTab === 'overview' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Patient Summary</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Patient since</p>
                      <p className="text-base font-medium">{format(new Date(patient.createdAt), 'MMMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total visits</p>
                      <p className="text-base font-medium">{visits.length}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last visit</p>
                      <p className="text-base font-medium">
                        {visits.length > 0
                          ? format(new Date(visits[0].date), 'MMMM dd, yyyy')
                          : 'No visits yet'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Next appointment</p>
                      <p className="text-base font-medium">
                        {visits.some(visit => visit.followUpDate)
                          ? format(
                              new Date(
                                visits
                                  .filter(visit => visit.followUpDate)
                                  .sort(
                                    (a, b) =>
                                      new Date(a.followUpDate!).getTime() - new Date(b.followUpDate!).getTime()
                                  )[0].followUpDate!
                              ),
                              'MMMM dd, yyyy'
                            )
                          : 'No upcoming appointments'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Recent Visits</h3>
                    <button
                      onClick={() => setActiveTab('visits')}
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      View all
                    </button>
                  </div>
                  
                  {visits.length > 0 ? (
                    <div className="space-y-4">
                      {visits.slice(0, 3).map(visit => (
                        <div key={visit.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-base font-medium text-gray-900">{visit.diagnosis}</h4>
                              <p className="text-sm text-gray-500">
                                {format(new Date(visit.date), 'MMMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{visit.chiefComplaints}</p>
                          {visit.medications.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-900">Medications:</p>
                              <ul className="text-sm text-gray-600 list-disc list-inside">
                                {visit.medications.slice(0, 2).map((med, idx) => (
                                  <li key={idx}>
                                    {med.name} {med.dosage && `(${med.dosage})`}
                                  </li>
                                ))}
                                {visit.medications.length > 2 && (
                                  <li className="text-primary-600">
                                    +{visit.medications.length - 2} more medications
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-base font-medium text-gray-900">No visit records yet</h3>
                      <p className="text-sm text-gray-500 mb-4">This patient doesn't have any recorded visits.</p>
                      <button
                        onClick={() => {
                          setActiveTab('visits');
                          setShowNewVisitForm(true);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Visit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'visits' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Visit History</h3>
                  {!showNewVisitForm && (
                    <button
                      onClick={() => setShowNewVisitForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Visit
                    </button>
                  )}
                </div>
                
                {showNewVisitForm && (
                  <div className="mb-8 border border-gray-200 rounded-lg p-4 bg-gray-50 animate-slide-in">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">New Visit Record</h4>
                    <form onSubmit={handleSubmitNewVisit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Visit Date & Time *
                          </label>
                          <input
                            type="datetime-local"
                            id="date"
                            name="date"
                            required
                            value={newVisitData.date}
                            onChange={handleNewVisitChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Follow Up Date (if needed)
                          </label>
                          <input
                            type="datetime-local"
                            id="followUpDate"
                            name="followUpDate"
                            value={newVisitData.followUpDate}
                            onChange={handleNewVisitChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="chiefComplaints" className="block text-sm font-medium text-gray-700 mb-1">
                          Chief Complaints *
                        </label>
                        <textarea
                          id="chiefComplaints"
                          name="chiefComplaints"
                          rows={3}
                          required
                          value={newVisitData.chiefComplaints}
                          onChange={handleNewVisitChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Patient's reported symptoms and concerns"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                          Diagnosis *
                        </label>
                        <input
                          type="text"
                          id="diagnosis"
                          name="diagnosis"
                          required
                          value={newVisitData.diagnosis}
                          onChange={handleNewVisitChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Clinical diagnosis"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">
                          Medications
                        </label>
                        <textarea
                          id="medications"
                          name="medications"
                          rows={4}
                          value={newVisitData.medications}
                          onChange={handleNewVisitChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter one medication per line in format: Name: Dosage, Frequency, Duration
Example: Amoxicillin: 500mg, Twice daily, 7 days"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={newVisitData.notes}
                          onChange={handleNewVisitChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Additional notes, instructions for the patient, etc."
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowNewVisitForm(false)}
                          className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                        >
                          Save Visit
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {visits.length > 0 ? (
                  <div className="space-y-6">
                    {visits.map((visit: Visit) => (
                      <div key={visit.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{visit.diagnosis}</h4>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(visit.date), 'MMMM dd, yyyy')}
                              <span className="mx-2">•</span>
                              <Clock className="h-4 w-4 mr-1" />
                              {format(new Date(visit.date), 'h:mm a')}
                            </div>
                          </div>
                          
                          {visit.followUpDate && (
                            <div className="mt-2 md:mt-0 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Follow-up: {format(new Date(visit.followUpDate), 'MMM dd, yyyy')}
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Chief Complaints</h5>
                          <p className="text-sm text-gray-600">{visit.chiefComplaints}</p>
                        </div>
                        
                        {visit.medications.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Medications</h5>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {visit.medications.map((medication, idx) => (
                                <li key={idx} className="text-sm bg-gray-50 p-2 rounded">
                                  <span className="font-medium">{medication.name}</span>
                                  {medication.dosage && <span className="text-gray-600"> • {medication.dosage}</span>}
                                  {medication.frequency && <span className="block text-gray-600 text-xs">{medication.frequency}</span>}
                                  {medication.duration && <span className="block text-gray-600 text-xs">For {medication.duration}</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {visit.notes && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Notes</h5>
                            <p className="text-sm text-gray-600">{visit.notes}</p>
                          </div>
                        )}
                        
                        {/* Add button to create follow-up from this visit */}
                        {!visit.followUpDate && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => {
                                setShowNewVisitForm(true);
                                setNewVisitData(prev => ({
                                  ...prev,
                                  chiefComplaints: `Follow-up for ${visit.diagnosis}`,
                                }));
                              }}
                              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
                            >
                              <PlusCircle className="h-4 w-4 mr-1" />
                              Schedule Follow-up
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-base font-medium text-gray-900">No visit records yet</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      This patient doesn't have any recorded visits. Add their first visit record.
                    </p>
                    {!showNewVisitForm && (
                      <button
                        onClick={() => setShowNewVisitForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Visit
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailPage;