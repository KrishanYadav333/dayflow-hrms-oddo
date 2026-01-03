import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await api.get('/leave/all');
      setLeaves(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      await api.put(`/leave/${leaveId}/status`, {
        status: 'Approved',
        comments: ''
      });
      fetchLeaves();
    } catch (error) {
      console.error('Failed to approve leave');
    }
  };

  const handleReject = async (leaveId) => {
    try {
      await api.put(`/leave/${leaveId}/status`, {
        status: 'Rejected',
        comments: ''
      });
      fetchLeaves();
    } catch (error) {
      console.error('Failed to reject leave');
    }
  };

  const paidLeaves = leaves.filter(l => l.leaveType === 'Paid');
  const sickLeaves = leaves.filter(l => l.leaveType === 'Sick');
  
  const paidDaysAvailable = 24 - paidLeaves.filter(l => l.status === 'Approved').length;
  const sickDaysAvailable = 7 - sickLeaves.filter(l => l.status === 'Approved').length;

  const filteredLeaves = leaves.filter(leave =>
    leave.employeeId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.employeeId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Leave Management</h1>
          <p className="text-gray-600 text-lg">Review and manage employee leave requests</p>
        </div>

        {/* Header Section */}
        <div className="bg-white border border-gray-200 rounded-t-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 rounded-lg font-semibold transition-colors bg-pink-500 text-white shadow-md">
                Time Off
              </button>
              <button className="px-6 py-2.5 bg-gray-100 rounded-lg text-gray-600 font-semibold hover:bg-gray-200 transition-colors">
                Allocation
              </button>
            </div>
            <div className="text-sm text-gray-500 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <p className="font-medium flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Approve & Reject Actions
              </p>
              <p className="text-xs">For Admin & HR Officer</p>
            </div>
          </div>

          {/* NEW Button and Search */}
          <div className="flex items-center gap-4 mb-6">
            <button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all">
              + NEW
            </button>
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
            />
          </div>

          {/* Leave Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-primary-bright rounded-xl p-5 bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-primary-bright text-lg mb-2">Paid Time Off</h3>
              <p className="text-2xl font-bold text-gray-800">{paidDaysAvailable} Days Available</p>
            </div>
            <div className="border-2 border-green-500 rounded-xl p-5 bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-green-600 text-lg mb-2">Sick Time Off</h3>
              <p className="text-2xl font-bold text-gray-800">{sickDaysAvailable} Days Available</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-b-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary-bright to-primary-medium text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Time off Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeaves.map((leave, index) => (
                  <tr key={leave._id} className={`transition-colors hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {leave.employeeId?.firstName} {leave.employeeId?.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(leave.startDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(leave.endDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-semibold text-primary-bright">{leave.leaveType} time Off</span>
                    </td>
                    <td className="px-6 py-4">
                      {leave.status === 'Pending' ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleReject(leave._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
                            title="Reject"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprove(leave._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
                            title="Approve"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${
                          leave.status === 'Approved' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {leave.status === 'Approved' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          {leave.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLeaves.length === 0 && (
              <div className="text-center py-16">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-500 text-lg font-medium">No leave requests found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LeaveManagement;
