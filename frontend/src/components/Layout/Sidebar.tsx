import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, UserPlus, Calendar, Home, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <Home size={20} /> },
    { path: '/patients', name: 'Patients', icon: <Users size={20} /> },
    { path: '/patients/new', name: 'Add Patient', icon: <UserPlus size={20} /> },
    { path: '/appointments', name: 'Appointments', icon: <Calendar size={20} /> },
    { path: '/chat', name: 'Chat', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="bg-white h-full shadow-md">
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-primary-700 flex items-center">
          <Calendar className="mr-2" />
          MedCare Pro
        </h2>
      </div>
      <nav className="mt-8">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/patients'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors ${isActive ? 'bg-primary-100 text-primary-700 border-r-4 border-primary-600' : ''
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
        <button
          onClick={logout}
          className="flex items-center text-gray-700 hover:text-red-600 w-full px-4 py-2 transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar