import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState({});
  const [leavesToday, setLeavesToday] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both employees and attendance in parallel for better performance
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [employeesRes, attendanceRes, leavesRes] = await Promise.all([
        api.get('/employee/all'),
        api.get('/attendance/all', { params: { date: today.toISOString() } }),
        api.get('/leave/all').catch(() => ({ data: { data: [] } }))
      ]);

      setEmployees(employeesRes.data.data);
      
      // Create attendance map
      const attendanceMap = {};
      attendanceRes.data.data.forEach(record => {
        if (record.employeeId && record.employeeId._id) {
          attendanceMap[record.employeeId._id] = {
            checkedIn: !!record.checkIn,
            checkedOut: !!record.checkOut,
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
      
      setLoading(false);
    } catch (error) {
      console.error('Fetch data error:', error);
      setError('Failed to load employees');
      setLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const response = await api.get('/attendance/all', {
        params: { date: today.toISOString() }
      });
      
      // Create a map of employee attendance status
      const attendanceMap = {};
      response.data.data.forEach(record => {
        if (record.employeeId && record.employeeId._id) {
          attendanceMap[record.employeeId._id] = {
            checkedIn: !!record.checkIn,
            checkedOut: !!record.checkOut,
            status: record.status
          };
        }
      });
      setAttendanceToday(attendanceMap);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
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

  const handleCardClick = (employeeId) => {
    navigate(`/profile/${employeeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-bright"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search employees by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Employee Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => {
            const status = getStatusIndicator(employee._id);
            return (
              <div
                key={employee._id}
                onClick={() => handleCardClick(employee._id)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                {/* Header with Avatar and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-bright to-primary-medium flex items-center justify-center text-white text-xl font-bold">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </div>
                      {/* Status Dot or Emoji */}
                      {status.icon === '✈️' ? (
                        <div 
                          className="absolute -bottom-1 -right-1 text-xl"
                          title={status.tooltip}
                        >
                          {status.icon}
                        </div>
                      ) : (
                        <div 
                          className={`absolute -bottom-1 -right-1 w-5 h-5 ${status.color} border-2 border-white rounded-full`}
                          title={status.tooltip}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{employee.employeeId}</p>
                    </div>
                  </div>
                  {/* Options Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add options menu functionality
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>

                {/* Employee Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700 font-medium">{employee.position || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-gray-700">{employee.department || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700 truncate">{employee.email}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-lg font-medium">No employees found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Employees;
