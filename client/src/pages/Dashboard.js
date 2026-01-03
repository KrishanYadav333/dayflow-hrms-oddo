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
  const [employees, setEmployees] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState({});
  const [leavesToday, setLeavesToday] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [checkedOutToday, setCheckedOutToday] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        if (isAdmin) {
          // Fetch employees and attendance for HR view
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const [employeesRes, attendanceRes, statsRes, leavesRes] = await Promise.all([
            api.get('/employee/all'),
            api.get('/attendance/all', { params: { date: today.toISOString() } }),
            api.get('/stats/dashboard'),
            api.get('/leave/all').catch(() => ({ data: { data: [] } }))
          ]);

          if (mounted) {
            setEmployees(employeesRes.data.data);
            
            // Create attendance map
            const attendanceMap = {};
            attendanceRes.data.data.forEach(record => {
              if (record.employeeId && record.employeeId._id) {
                attendanceMap[record.employeeId._id] = {
                  checkedIn: !!record.checkIn,
                  checkedOut: !!record.checkOut,
                  checkInTime: record.checkIn,
                  checkOutTime: record.checkOut,
                  status: record.status
                };
              }
            });
            setAttendanceToday(attendanceMap);
            
            // Create leave map for today
            const leaveMap = {};
            if (leavesRes.data.data) {
              leavesRes.data.data.forEach(leave => {
                if (leave.status === 'Approved' && leave.employeeId) {
                  const leaveStart = new Date(leave.startDate);
                  const leaveEnd = new Date(leave.endDate);
                  leaveStart.setHours(0, 0, 0, 0);
                  leaveEnd.setHours(23, 59, 59, 999);
                  
                  if (today >= leaveStart && today <= leaveEnd) {
                    const empId = typeof leave.employeeId === 'object' ? leave.employeeId._id : leave.employeeId;
                    leaveMap[empId] = {
                      leaveType: leave.leaveType,
                      reason: leave.reason
                    };
                  }
                }
              });
            }
            setLeavesToday(leaveMap);
            
            if (statsRes.data.success) {
              setStats(statsRes.data.data);
            }
          }
        } else {
          // Fetch employee dashboard data
          const [statsRes, attendanceRes] = await Promise.all([
            api.get('/stats/dashboard'),
            api.get('/attendance/my')
          ]);
          
          if (mounted) {
            if (statsRes.data.success) {
              setStats(statsRes.data.data);
            }
            
            // Check today's attendance
            const todayStr = new Date().toDateString();
            const todayRecord = attendanceRes.data.data.find(record => 
              new Date(record.date).toDateString() === todayStr
            );
            
            if (todayRecord) {
              setCheckedInToday(true);
              setCheckedOutToday(!!todayRecord.checkOut);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  const handleCheckIn = async () => {
    try {
      await api.post('/attendance/checkin');
      setCheckedInToday(true);
      window.location.reload();
    } catch (error) {
      console.error('Failed to check in:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/attendance/checkout');
      setCheckedOutToday(true);
      window.location.reload();
    } catch (error) {
      console.error('Failed to check out:', error);
    }
  };

  const getStatusIndicator = (employeeId) => {
    // Check if employee is on approved leave
    const onLeave = leavesToday[employeeId];
    if (onLeave) {
      return {
        color: 'bg-transparent',
        icon: '✈️',
        text: 'On Leave',
        tooltip: `On ${onLeave.leaveType} Leave`
      };
    }

    const attendance = attendanceToday[employeeId];
    if (!attendance) {
      return {
        color: 'bg-yellow-400',
        icon: '●',
        text: 'Absent',
        tooltip: 'Employee has not checked in'
      };
    }
    if (attendance.checkedIn) {
      return {
        color: 'bg-green-500',
        icon: '●',
        text: 'Present',
        tooltip: 'Employee is present in the office'
      };
    }
    return {
      color: 'bg-red-500',
      icon: '●',
      text: 'Absent',
      tooltip: 'Employee is absent'
    };
  };

  const filteredEmployees = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName} ${emp.employeeId} ${emp.department || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-bright"></div>
          </div>
        ) : isAdmin ? (
          <>
            {/* HR View - Employee Cards Grid */}
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
              <button
                onClick={() => navigate('/employees')}
                className="bg-primary-bright hover:bg-primary-medium text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                NEW
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Employee Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => {
                const status = getStatusIndicator(employee._id);
                const attendance = attendanceToday[employee._id];
                
                return (
                  <div
                    key={employee._id}
                    onClick={() => navigate(`/profile/${employee._id}`)}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer relative"
                  >
                    {/* Status Indicator - Top Right */}
                    {status.icon === '✈️' ? (
                      <div 
                        className="absolute top-4 right-4 text-2xl"
                        title={status.tooltip}
                      >
                        {status.icon}
                      </div>
                    ) : (
                      <div 
                        className={`absolute top-4 right-4 w-3 h-3 ${status.color} rounded-full`}
                        title={status.tooltip}
                      ></div>
                    )}

                    {/* Employee Avatar and Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-bright to-primary-medium flex items-center justify-center text-white text-xl font-bold">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{employee.employeeId}</p>
                      </div>
                    </div>

                    {/* Department/Role */}
                    <div className="text-sm text-gray-600">
                      <p>{employee.department || 'No Department'}</p>
                      <p className="text-xs text-gray-500 mt-1">{employee.role}</p>
                    </div>

                    {/* Attendance Status */}
                    {attendance && attendance.checkedIn && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          <div className="flex justify-between items-center">
                            <span>Check In:</span>
                            <span className="font-medium text-gray-700">
                              {new Date(attendance.checkInTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {attendance.checkedOut && (
                            <div className="flex justify-between items-center mt-1">
                              <span>Check Out:</span>
                              <span className="font-medium text-gray-700">
                                {new Date(attendance.checkOutTime).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Employee View - Check In/Out & Quick Actions */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
            </div>

            {/* Check In/Out Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Today's Attendance
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={handleCheckIn}
                  disabled={checkedInToday}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                    checkedInToday
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Check In
                </button>
                <button
                  onClick={handleCheckOut}
                  disabled={!checkedInToday || checkedOutToday}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                    !checkedInToday || checkedOutToday
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700 shadow-sm'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Check Out
                </button>
              </div>
              {checkedInToday && (
                <p className="text-sm text-green-600 mt-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  You have checked in today{checkedOutToday && ' and checked out'}
                </p>
              )}
            </div>

            {/* Quick Access Menu */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.filter(item => item.roles.includes(user?.role)).map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => navigate(item.path)}
                      className="group bg-white rounded-lg shadow-sm hover:shadow-md p-6 cursor-pointer border border-gray-200 hover:border-primary-bright transition-all"
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

            {/* Overview Stats */}
            {stats && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm p-6 border border-green-200">
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

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm p-6 border border-blue-200">
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

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm p-6 border border-purple-200">
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
                  <div className="col-span-full bg-white rounded-lg shadow-sm p-6 border border-gray-200">
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
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
