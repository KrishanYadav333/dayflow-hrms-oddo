import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserIcon, CalendarIcon, BeachIcon, UsersIcon, ChartIcon, CheckIcon, LoadingIcon, DollarIcon } from '../components/Icons';
import api from '../api';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('/stats/dashboard');
        if (mounted && response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    fetchDashboardStats();
    
    return () => {
      mounted = false;
    };
  }, []);

  const menuItems = [
    {
      title: 'My Profile',
      description: 'View and manage your personal information',
      icon: UserIcon,
      path: '/profile',
      roles: ['Employee', 'HR']
    },
    {
      title: 'Attendance',
      description: 'Mark attendance and view your attendance history',
      icon: CalendarIcon,
      path: '/attendance',
      roles: ['Employee', 'HR']
    },
    {
      title: 'Leave Requests',
      description: 'Apply for leave and check request status',
      icon: BeachIcon,
      path: '/leave',
      roles: ['Employee', 'HR']
    },
    {
      title: 'All Employees',
      description: 'Manage employee information and records',
      icon: UsersIcon,
      path: '/employees',
      roles: ['HR']
    },
    {
      title: 'All Attendance',
      description: 'View attendance records of all employees',
      icon: ChartIcon,
      path: '/all-attendance',
      roles: ['HR']
    },
    {
      title: 'Leave Management',
      description: 'Approve or reject leave requests',
      icon: CheckIcon,
      path: '/leave-management',
      roles: ['HR']
    },
    {
      title: 'Payroll',
      description: 'Manage employee salary and compensation',
      icon: DollarIcon,
      path: '/payroll',
      roles: ['HR']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 text-lg">
            {isAdmin ? 'Manage your workforce efficiently' : 'Your workspace for seamless productivity'}
          </p>
        </div>

        {/* Main Menu Cards */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl p-7 cursor-pointer border border-gray-100 hover:border-primary-bright transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="p-4 bg-gradient-to-br from-primary-bright/10 to-primary-medium/10 rounded-xl group-hover:from-primary-bright/20 group-hover:to-primary-medium/20 transition duration-300 shadow-sm">
                      <IconComponent className="w-8 h-8 text-primary-bright" />
                    </div>
                    <svg 
                      className="w-6 h-6 text-gray-300 group-hover:text-primary-bright transition duration-300 transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-bright transition duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingIcon className="w-10 h-10 text-primary-bright" />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>
            {isAdmin ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total Employees</p>
                      <p className="text-3xl font-bold text-primary-dark">{stats?.totalEmployees || 0}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <UsersIcon className="w-8 h-8 text-primary-bright" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Pending Leaves</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats?.pendingLeaves || 0}</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <BeachIcon className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Present Today</p>
                      <p className="text-3xl font-bold text-green-600">{stats?.todayPresent || 0}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <CheckIcon className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">This Month</p>
                      <p className="text-3xl font-bold text-primary-medium">{stats?.monthlyLeaves || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">Approved Leaves</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <CalendarIcon className="w-8 h-8 text-primary-medium" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 uppercase tracking-wide mb-1">Status</p>
                      <p className="text-2xl font-bold text-green-800">Active</p>
                    </div>
                    <div className="p-3 bg-green-200 rounded-lg">
                      <CheckIcon className="w-8 h-8 text-green-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700 uppercase tracking-wide mb-1">Employee ID</p>
                      <p className="text-2xl font-bold text-blue-800">{user?.employeeId}</p>
                    </div>
                    <div className="p-3 bg-blue-200 rounded-lg">
                      <UserIcon className="w-8 h-8 text-blue-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700 uppercase tracking-wide mb-1">This Month</p>
                      <p className="text-2xl font-bold text-purple-800">{stats?.monthAttendance || 0}</p>
                      <p className="text-xs text-purple-600 mt-1">Days Present</p>
                    </div>
                    <div className="p-3 bg-purple-200 rounded-lg">
                      <CalendarIcon className="w-8 h-8 text-purple-700" />
                    </div>
                  </div>
                </div>

                {stats?.leaveBalance && (
                  <div className="col-span-full bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <BeachIcon className="w-5 h-5 text-primary-bright" />
                      Leave Balance
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <p className="text-sm font-medium text-blue-700 mb-2">Paid Leave</p>
                        <p className="text-3xl font-bold text-blue-800">{stats.leaveBalance.paid}</p>
                        <p className="text-xs text-blue-600 mt-1">days remaining</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                        <p className="text-sm font-medium text-orange-700 mb-2">Sick Leave</p>
                        <p className="text-3xl font-bold text-orange-800">{stats.leaveBalance.sick}</p>
                        <p className="text-xs text-orange-600 mt-1">days remaining</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Recent Activity Section */}
        {!loading && stats && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            {isAdmin ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="p-6">
                  {stats.recentActivity && stats.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentActivity.map((leave, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition duration-200">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-primary-bright to-primary-medium flex items-center justify-center text-white font-bold shadow-sm">
                              {leave.employeeId?.firstName?.[0]}{leave.employeeId?.lastName?.[0]}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {leave.employeeId?.firstName} {leave.employeeId?.lastName}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                <span className="font-medium">{leave.leaveType}</span> leave request
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <span className={`px-4 py-1.5 text-xs font-semibold rounded-full ${
                            leave.status === 'Approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                            leave.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                            'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          }`}>
                            {leave.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Last 7 Days</h3>
                  {stats.recentAttendance && stats.recentAttendance.length > 0 ? (
                    <div className="grid grid-cols-7 gap-3">
                      {stats.recentAttendance.slice(0, 7).reverse().map((record, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <p className="text-xs font-medium text-gray-600 mb-2">
                            {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2 ${
                            record.status === 'Present' ? 'bg-green-500 border-green-600' :
                            record.status === 'Absent' ? 'bg-red-500 border-red-600' :
                            record.status === 'Half-day' ? 'bg-yellow-500 border-yellow-600' :
                            'bg-blue-500 border-blue-600'
                          }`}>
                            <span className="text-white text-lg font-bold">
                              {record.status === 'Present' ? 'P' :
                               record.status === 'Absent' ? 'A' :
                               record.status === 'Half-day' ? 'H' : 'L'}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-gray-700 mt-2">
                            {new Date(record.date).getDate()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No recent attendance data</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
