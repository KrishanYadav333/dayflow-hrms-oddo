import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const AllAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('date');

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const dateToFetch = new Date(selectedDate);
      dateToFetch.setHours(0, 0, 0, 0);
      
      const response = await api.get('/attendance/all', {
        params: {
          date: dateToFetch.toISOString()
        }
      });
      setAttendance(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load attendance records');
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const filteredAttendance = attendance.filter(record => {
    if (!searchQuery) return true;
    const employeeName = record.employee?.firstName + ' ' + record.employee?.lastName;
    const employeeId = record.employee?.employeeId || '';
    return employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           employeeId.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        </div>

        {/* Search and Navigation Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNextDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('date')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'date' 
                      ? 'bg-primary-bright text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Date
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'day' 
                      ? 'bg-primary-bright text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Day
                </button>
                
                <div className="ml-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedDate.toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-start gap-3 shadow-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-bright"></div>
                <span className="ml-3 text-gray-600">Loading attendance...</span>
              </div>
            </div>
          ) : filteredAttendance.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg font-medium">
                {searchQuery ? 'No matching records found' : 'No attendance records found'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {searchQuery ? 'Try adjusting your search' : 'Attendance data will appear here'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Emp
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Check In
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Check Out
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Work Hours
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Extra hours
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredAttendance.map((record, index) => {
                    const checkInTime = record.checkIn ? new Date(record.checkIn) : null;
                    const checkOutTime = record.checkOut ? new Date(record.checkOut) : null;
                    let workHours = '--';
                    let extraHours = '--';
                    
                    if (checkInTime && checkOutTime) {
                      const diffMs = checkOutTime - checkInTime;
                      const hours = Math.floor(diffMs / (1000 * 60 * 60));
                      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                      workHours = `${hours}h ${minutes}m`;
                      
                      const totalHours = hours + minutes / 60;
                      if (totalHours > 8) {
                        const extra = totalHours - 8;
                        const extraH = Math.floor(extra);
                        const extraM = Math.floor((extra - extraH) * 60);
                        extraHours = `${extraH}h ${extraM}m`;
                      } else {
                        extraHours = '0h 0m';
                      }
                    }
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-primary-bright flex items-center justify-center text-white font-semibold">
                                {record.employee?.firstName?.[0]}{record.employee?.lastName?.[0]}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {record.employee?.firstName} {record.employee?.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {record.employee?.employeeId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {checkInTime ? checkInTime.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          }) : '--'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {checkOutTime ? checkOutTime.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          }) : '--'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {workHours}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-green-600">
                          {extraHours}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllAttendance;
