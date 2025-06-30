import React, { useState } from 'react';
import { Search, Send, Phone, Video, MoreVertical, User } from 'lucide-react';
import { mockPatients } from '../../data/mockData';
import { format } from 'date-fns';

const ChatPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in h-[calc(100vh-7rem)] flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredPatients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={`w-full p-4 flex items-center hover:bg-gray-50 ${
                selectedPatient?.id === patient.id ? 'bg-primary-50' : ''
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                <p className="text-xs text-gray-500">Last message...</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedPatient ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h2 className="text-sm font-medium text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-xs text-gray-500">Last seen recently</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-500 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Sample messages */}
              <div className="flex flex-col space-y-4">
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                    <p className="text-sm text-gray-800">Hello! How are you feeling today?</p>
                    <p className="text-xs text-gray-500 mt-1">{format(new Date(), 'h:mm a')}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary-600 rounded-lg p-3 shadow-sm max-w-xs">
                    <p className="text-sm text-white">Much better, thank you doctor!</p>
                    <p className="text-xs text-primary-100 mt-1">{format(new Date(), 'h:mm a')}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                    <p className="text-sm text-gray-800">Don't forget your follow-up appointment next week.</p>
                    <p className="text-xs text-gray-500 mt-1">{format(new Date(), 'h:mm a')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a patient to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;