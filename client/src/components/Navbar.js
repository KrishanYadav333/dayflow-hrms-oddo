import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const tabs = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Employees', path: '/employees', roles: ['HR'] },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Time Off', path: '/leave' },
    { name: 'All Attendance', path: '/all-attendance', roles: ['HR'] },
    { name: 'Leave Management', path: '/leave-management', roles: ['HR'] },
    { name: 'Payroll', path: '/payroll', roles: ['HR'] },
  ];

  const visibleTabs = tabs.filter(tab => !tab.roles || tab.roles.includes(user?.role));

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 cursor-pointer mr-8"
          >
            <div className="w-10 h-10 bg-primary-bright rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold text-primary-dark">Dayflow</span>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 flex-1">
            {visibleTabs.map((tab) => (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isActive(tab.path)
                    ? 'bg-primary-bright text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary-bright'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4 ml-8">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-bright transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-bright to-primary-medium flex items-center justify-center text-white font-bold shadow-md">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <span className="font-semibold">{user?.firstName}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
