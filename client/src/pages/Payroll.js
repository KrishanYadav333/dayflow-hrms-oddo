import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Payroll = () => {
  const { isAdmin } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchEmployees();
    fetchPayrollData();
  }, [selectedMonth, selectedYear]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employee/all');
      setEmployees(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load employee data');
      setLoading(false);
    }
  };

  const fetchPayrollData = async () => {
    try {
      // Get attendance data for the selected month
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0);
      
      const response = await api.get('/stats/attendance-summary', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      
      // Create a map of employee attendance data
      const dataMap = {};
      if (response.data.data) {
        response.data.data.forEach(item => {
          dataMap[item.employeeId] = item;
        });
      }
      setPayrollData(dataMap);
    } catch (error) {
      console.error('Failed to load payroll data:', error);
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee._id);
    setEditData({
      baseSalary: employee.baseSalary || 0,
      allowances: employee.allowances || 0,
      deductions: employee.deductions || 0
    });
  };

  const handleSave = async (employeeId) => {
    try {
      setError('');
      await api.put(`/employee/${employeeId}`, {
        baseSalary: parseFloat(editData.baseSalary),
        allowances: parseFloat(editData.allowances),
        deductions: parseFloat(editData.deductions)
      });
      setSuccess('Salary updated successfully');
      setEditingId(null);
      fetchEmployees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update salary');
    }
  };

  const calculateNetSalary = (base, allowances, deductions) => {
    return (parseFloat(base) || 0) + (parseFloat(allowances) || 0) - (parseFloat(deductions) || 0);
  };

  const calculatePayableDays = (employeeId) => {
    const data = payrollData[employeeId];
    if (!data) return 0;
    
    // Total working days in month minus leave days
    const totalDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const workingDays = totalDays - 8; // Assuming ~8 Sundays/holidays per month
    const presentDays = data.presentDays || 0;
    const paidLeaveDays = data.paidLeaveDays || 0;
    const halfDays = (data.halfDays || 0) * 0.5;
    
    // Payable days = Present days + Paid leave days + Half of half-days
    return presentDays + paidLeaveDays + halfDays;
  };

  const calculateFinalSalary = (employee) => {
    const baseSalary = parseFloat(employee.baseSalary) || 0;
    const allowances = parseFloat(employee.allowances) || 0;
    const deductions = parseFloat(employee.deductions) || 0;
    const netSalary = baseSalary + allowances - deductions;
    
    // Calculate per-day rate
    const totalDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const workingDays = totalDays - 8; // Assuming ~8 Sundays/holidays
    const perDayRate = netSalary / workingDays;
    
    // Calculate payable amount based on attendance
    const payableDays = calculatePayableDays(employee._id);
    return (perDayRate * payableDays).toFixed(2);
  };

  const getMonthName = (monthIndex) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payroll Management</h1>
          <p className="text-gray-600 text-lg">
            {isAdmin ? 'Manage employee salary information and payslips' : 'View your salary details and payslips'}
          </p>
        </div>

        {/* Month/Year Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-semibold text-gray-700">Select Period:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{getMonthName(i)}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
            <div className="ml-auto">
              <span className="text-sm font-semibold text-primary-bright">
                Payroll for {getMonthName(selectedMonth)} {selectedYear}
              </span>
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

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6 flex items-start gap-3 shadow-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary-bright to-primary-medium text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Payable Days</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Base Salary</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Allowances</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Deductions</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Net Salary</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Final Payable</th>
                  {isAdmin && (
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((employee, index) => (
                  <tr key={employee._id} className={`transition-colors hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{employee.employeeId}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-primary-bright">
                      {calculatePayableDays(employee._id).toFixed(1)} days
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {editingId === employee._id ? (
                        <input
                          type="number"
                          value={editData.baseSalary}
                          onChange={(e) => setEditData({ ...editData, baseSalary: e.target.value })}
                          className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright"
                        />
                      ) : (
                        `$${employee.baseSalary || 0}`
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {editingId === employee._id ? (
                        <input
                          type="number"
                          value={editData.allowances}
                          onChange={(e) => setEditData({ ...editData, allowances: e.target.value })}
                          className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright"
                        />
                      ) : (
                        `$${employee.allowances || 0}`
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {editingId === employee._id ? (
                        <input
                          type="number"
                          value={editData.deductions}
                          onChange={(e) => setEditData({ ...editData, deductions: e.target.value })}
                          className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright"
                        />
                      ) : (
                        `$${employee.deductions || 0}`
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ${editingId === employee._id
                        ? calculateNetSalary(editData.baseSalary, editData.allowances, editData.deductions)
                        : calculateNetSalary(employee.baseSalary, employee.allowances, employee.deductions)
                      }
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600 text-lg">
                      ${calculateFinalSalary(employee)}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-center">
                        {editingId === employee._id ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleSave(employee._id)}
                              className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="inline-flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(employee)}
                            className="inline-flex items-center gap-2 bg-primary-bright hover:bg-primary-medium text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {employees.length === 0 && (
              <div className="text-center py-16">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-500 text-lg font-medium">No payroll records found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payroll;
