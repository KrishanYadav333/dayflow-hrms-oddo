import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [checkedOutToday, setCheckedOutToday] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    daysPresent: 0,
    leavesCount: 0,
    totalWorkingDays: 0
  });

  const fetchAttendance = useCallback(async () => {
    try {
      const startOfMonth = new Date(selectedYear, selectedMonth, 1);
      const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
      
      const response = await api.get('/attendance/my', {
        params: {
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString()
        }
      });
      
      const records = response.data.data;
      setAttendance(records);
      
      const presentDays = records.filter(r => r.status === 'Present' || r.status === 'Half-day').length;
      const totalDays = endOfMonth.getDate();
      
      setStats({
        daysPresent: presentDays,
        leavesCount: 0,
        totalWorkingDays: totalDays
      });
      
      const today = new Date().toDateString();
      const todayRecord = records.find(record => 
        new Date(record.date).toDateString() === today
      );
      
      if (todayRecord) {
        setCheckedInToday(true);
        setCheckedOutToday(!!todayRecord.checkOut);
      }
      
      setLoading(false);
    } catch (error) {
      setError('Failed to load attendance records');
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const getMonthName = (monthIndex) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
  };

  const handleCheckIn = async () => {
    try {
      setError('');
      await api.post('/attendance/checkin');
      setSuccess('Check-in successful!');
      setCheckedInToday(true);
      fetchAttendance();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      setError('');
      await api.post('/attendance/checkout');
      setSuccess('Check-out successful!');
      setCheckedOutToday(true);
      fetchAttendance();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to check out');
    }
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
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        </div>

        {/* Month Navigation & Stats Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left: Month Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{getMonthName(i)}</option>
                ))}
              </select>
              
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Right: Stats Cards */}
            <div className="flex items-center gap-4">
              <div className="text-center px-6 py-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Count of days present</p>
                <p className="text-2xl font-bold text-primary-bright">{stats.daysPresent}</p>
              </div>
              <div className="text-center px-6 py-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Leaves count</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.leavesCount}</p>
              </div>
              <div className="text-center px-6 py-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Total working days</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalWorkingDays}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Display current month/year */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {getMonthName(selectedMonth)} {selectedYear}
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-start gap-3 shadow-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6 flex items-start gap-3 shadow-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Check In/Out Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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
        </div>

        {/* Attendance History Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Check In</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Check Out</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Work Hours</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Extra hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-bright"></div>
                        <span className="ml-3 text-gray-600">Loading attendance...</span>
                      </div>
                    </td>
                  </tr>
                ) : attendance.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No attendance records found for this month
                    </td>
                  </tr>
                ) : (
                  attendance.map((record, index) => {
                    const checkInTime = record.checkIn ? new Date(record.checkIn) : null;
                    const checkOutTime = record.checkOut ? new Date(record.checkOut) : null;
                    let workHours = '--';
                    let extraHours = '--';
                    
                    if (checkInTime && checkOutTime) {
                      const diffMs = checkOutTime - checkInTime;
                      const hours = Math.floor(diffMs / (1000 * 60 * 60));
                      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                      workHours = `${hours}h ${minutes}m`;
                      
                      // Calculate extra hours (assuming 8 hours is standard)
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
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
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
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Attendance;
