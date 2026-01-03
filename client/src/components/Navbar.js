import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

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
            className="flex items-center gap-2 cursor-pointer mr-8"
          >
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-bright to-primary-medium rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Dayflow HRMS</span>
            </div>
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

          {/* User Profile Dropdown */}
          <div className="flex items-center gap-4 ml-8 relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-bright transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-bright to-primary-medium flex items-center justify-center text-white font-bold shadow-md">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                ></div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
