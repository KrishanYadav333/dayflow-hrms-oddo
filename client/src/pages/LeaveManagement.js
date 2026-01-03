import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const filteredLeaves = leaves;

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Time Off Management</h1>
        </div>

        {/* Leave Allocation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Paid</h3>
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-primary-bright mb-1">{paidDaysAvailable} Days</div>
            <div className="text-sm text-gray-500">Available (24 total)</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Sick</h3>
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-red-600 mb-1">{sickDaysAvailable} Days</div>
            <div className="text-sm text-gray-500">Available (7 total)</div>
          </div>
        </div>
        {/* Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">End Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time off Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map((leave, index) => (
                    <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {leave.employeeId?.firstName} {leave.employeeId?.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(leave.startDate).toLocaleDateString('en-GB', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(leave.endDate).toLocaleDateString('en-GB', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {leave.leaveType}
                      </td>
                      <td className="px-6 py-4">
                        {leave.status === 'Pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReject(leave._id)}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
                              title="Reject"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(leave._id)}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors"
                              title="Approve"
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                            leave.status === 'Approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {leave.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
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

export default LeaveManagement;
