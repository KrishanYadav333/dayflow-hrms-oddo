import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/attendance/my');
      setAttendance(response.data.data);
      
      const today = new Date().toDateString();
      const todayRecord = response.data.data.find(record => 
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Attendance</h1>
          <p className="text-gray-600 text-lg">Track your daily attendance and work hours</p>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-primary-bright/10 rounded-lg">
              <svg className="w-7 h-7 text-primary-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Today's Attendance
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCheckIn}
              disabled={checkedInToday}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-1 ${
                checkedInToday
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {checkedInToday ? 'Checked In' : 'Check In'}
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!checkedInToday || checkedOutToday}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-1 ${
                !checkedInToday || checkedOutToday
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {checkedOutToday ? 'Checked Out' : 'Check Out'}
            </button>
          </div>
        </div>

        {/* Attendance History Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Attendance History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary-bright to-primary-medium text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Working Hours</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendance.map((record, index) => (
                  <tr key={index} className={`transition-colors hover:bg-blue-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {new Date(record.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {record.checkIn ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {new Date(record.checkIn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {record.checkOut ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                          </svg>
                          {new Date(record.checkOut).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {record.workingHours ? `${record.workingHours} hrs` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm ${
                        record.status === 'Present' ? 'bg-green-100 text-green-800 border border-green-200' :
                        record.status === 'Absent' ? 'bg-red-100 text-red-800 border border-red-200' :
                        record.status === 'Half-day' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {attendance.length === 0 && (
              <div className="text-center py-16">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-500 text-lg font-medium">No attendance records found</p>
                <p className="text-gray-400 text-sm mt-2">Your attendance history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Attendance;
