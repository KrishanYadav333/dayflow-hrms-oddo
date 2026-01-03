import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employee/all');
      setEmployees(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load employees');
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee({
      ...employee,
      id: employee._id
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.put(`/employee/${editingEmployee.id}`, {
        firstName: editingEmployee.firstName,
        lastName: editingEmployee.lastName,
        department: editingEmployee.department,
        position: editingEmployee.position,
        baseSalary: parseFloat(editingEmployee.baseSalary),
        allowances: parseFloat(editingEmployee.allowances),
        deductions: parseFloat(editingEmployee.deductions || 0)
      });
      setSuccess('Employee updated successfully!');
      setEditingEmployee(null);
      fetchEmployees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update employee');
    }
  };

  const handleChange = (e) => {
    setEditingEmployee({
      ...editingEmployee,
      [e.target.name]: e.target.value
    });
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Employees</h1>
          <p className="text-gray-600 text-lg">Manage employee information and records</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Edit Modal */}
        {editingEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800">Edit Employee</h3>
                <button
                  onClick={() => setEditingEmployee(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={editingEmployee.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={editingEmployee.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={editingEmployee.department || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={editingEmployee.position || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Base Salary
                    </label>
                    <input
                      type="number"
                      name="baseSalary"
                      value={editingEmployee.baseSalary || 0}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Allowances
                    </label>
                    <input
                      type="number"
                      name="allowances"
                      value={editingEmployee.allowances || 0}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deductions
                    </label>
                    <input
                      type="number"
                      name="deductions"
                      value={editingEmployee.deductions || 0}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingEmployee(null)}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Employees List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {employees.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No employees found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary-bright to-primary-medium text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((employee, index) => (
                  <tr key={employee._id} className={`transition-colors hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{employee.employeeId}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{employee.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{employee.department || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{employee.position || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                        employee.role === 'HR' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="inline-flex items-center gap-2 bg-primary-bright hover:bg-primary-medium text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Employees;
