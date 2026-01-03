import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Profile = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resume');
  const [error, setError] = useState('');

  const isOwnProfile = !id || id === user?.id;
  const profileId = isOwnProfile ? user?.id : id;

  const fetchEmployee = useCallback(async () => {
    try {
      const response = await api.get(`/employee/${profileId}`);
      setEmployee(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load employee profile');
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    if (profileId) {
      fetchEmployee();
    }
  }, [profileId, fetchEmployee]);

  const calculateSalaryComponent = (type, value) => {
    const monthlyWage = employee?.salaryStructure?.monthlyWage || 50000;
    const basic = (monthlyWage * (employee?.salaryStructure?.components?.basic || 50)) / 100;

    switch (type) {
      case 'basic':
        return ((monthlyWage * value) / 100).toFixed(2);
      case 'hra':
        return ((basic * value) / 100).toFixed(2);
      case 'standardAllowance':
      case 'performanceBonus':
      case 'leaveTravelAllowance':
        return ((monthlyWage * value) / 100).toFixed(2);
      case 'fixedAllowance':
        return value.toFixed(2);
      default:
        return '0.00';
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

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-16">
          <p className="text-gray-500">Employee not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar with Edit Icon */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-pink-200 flex items-center justify-center cursor-pointer">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
              
              {/* Employee Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {employee.firstName} {employee.lastName}
                </h1>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Login ID: {employee.employeeId}</p>
                  <p className="text-sm text-gray-600">Email: {employee.email}</p>
                  <p className="text-sm text-gray-600">Mobile: {employee.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Company Info Box */}
              <div className="ml-8 p-4 border-l-2 border-gray-200">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Company</p>
                    <p className="text-sm font-semibold text-gray-900">DayFlow HRMS</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-semibold text-gray-900">{employee.department || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Manager</p>
                    <p className="text-sm font-semibold text-gray-900">N/A</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-semibold text-gray-900">{employee.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('resume')}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === 'resume'
                    ? 'border-primary-bright text-primary-bright bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Resume
              </button>
              <button
                onClick={() => setActiveTab('private')}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === 'private'
                    ? 'border-primary-bright text-primary-bright bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Private Info
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('salary')}
                  className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === 'salary'
                      ? 'border-primary-bright text-primary-bright bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  Salary Info
                </button>
              )}
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === 'security'
                    ? 'border-primary-bright text-primary-bright bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Resume Tab */}
            {activeTab === 'resume' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">About</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {employee.about || 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">What I love about my job</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {employee.workExperience || 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">My interests and hobbies</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {employee.interests || 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.'}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">Skills</h3>
                      <button className="text-primary-bright text-sm font-semibold hover:text-primary-dark">
                        + Add Skills
                      </button>
                    </div>
                    <div className="border border-gray-300 rounded-lg p-4 min-h-[100px]">
                      {employee.skills && employee.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {employee.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">No skills added yet</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">Certification</h3>
                      <button className="text-primary-bright text-sm font-semibold hover:text-primary-dark">
                        + Add Skills
                      </button>
                    </div>
                    <div className="border border-gray-300 rounded-lg p-4 min-h-[100px]">
                      {employee.certifications && employee.certifications.length > 0 ? (
                        <ul className="space-y-2">
                          {employee.certifications.map((cert, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {cert}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-sm">No certifications added yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Private Info Tab */}
            {activeTab === 'private' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">All Skills</label>
                  <input
                    type="text"
                    readOnly
                    value={employee.skills?.join(', ') || 'N/A'}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    readOnly
                    value="N/A"
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Residing Address</label>
                  <input
                    type="text"
                    readOnly
                    value={employee.address || 'N/A'}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    readOnly
                    value="N/A"
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nationality</label>
                  <input
                    type="text"
                    readOnly
                    value="N/A"
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
                  <input
                    type="text"
                    readOnly
                    value="N/A"
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Personal Email</label>
                  <input
                    type="text"
                    readOnly
                    value={employee.email}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">PAN No</label>
                  <input
                    type="text"
                    readOnly
                    value="N/A"
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <input
                    type="text"
                    readOnly
                    value="N/A"
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">UAN NO</label>
                  <input
                    type="text"
                    readOnly
                    value="N/A"
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Marital Status</label>
                  <input
                    type="text"
                    readOnly
                    value="N/A"
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Emp Code</label>
                  <input
                    type="text"
                    readOnly
                    value={employee.employeeId}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Joining</label>
                  <input
                    type="text"
                    readOnly
                    value={new Date(employee.joinDate).toLocaleDateString()}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Salary Info Tab (Admin Only) */}
            {activeTab === 'salary' && isAdmin && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Wage Info */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Month Wage</label>
                        <div className="text-2xl font-bold text-gray-900">
                          {employee.salaryStructure?.monthlyWage || 50000}
                        </div>
                        <p className="text-sm text-gray-500">/Month</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">No of working days in a week:</label>
                        <div className="text-2xl font-bold text-gray-900">/hrs</div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Yearly wage</label>
                        <div className="text-2xl font-bold text-gray-900">
                          {employee.salaryStructure?.yearlyWage || 600000}
                        </div>
                        <p className="text-sm text-gray-500">/Yearly</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Break Time:</label>
                        <div className="text-2xl font-bold text-gray-900">/hrs</div>
                      </div>
                    </div>
                  </div>

                  {/* Salary Components */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Salary Components</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-700">Basic Salary</span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {calculateSalaryComponent('basic', employee.salaryStructure?.components?.basic || 50)} ₹ / month
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{employee.salaryStructure?.components?.basic || 50}.00 %</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-700">
                          House Rent Allowance
                          <p className="text-xs text-gray-500">HRA provided to employees 50% of the basic salary</p>
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {calculateSalaryComponent('hra', employee.salaryStructure?.components?.hra || 50)} ₹ / month
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{employee.salaryStructure?.components?.hra || 50}.00 %</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-700">
                          Standard Allowance
                          <p className="text-xs text-gray-500">A standard allowance to meet professional/ fixed amount provided to employee as part of their salary</p>
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {calculateSalaryComponent('standardAllowance', employee.salaryStructure?.components?.standardAllowance || 8.33)} ₹ / month
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{employee.salaryStructure?.components?.standardAllowance || 8.33} %</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-700">
                          Performance Bonus
                          <p className="text-xs text-gray-500">Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary</p>
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {calculateSalaryComponent('performanceBonus', employee.salaryStructure?.components?.performanceBonus || 8.33)} ₹ / month
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{employee.salaryStructure?.components?.performanceBonus || 8.33} %</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-700">
                          Leave Travel Allowance
                          <p className="text-xs text-gray-500">LTA is paid by the company to cover their travel expenses and calculated as a % of the basic salary</p>
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {calculateSalaryComponent('leaveTravelAllowance', employee.salaryStructure?.components?.leaveTravelAllowance || 4.167)} ₹ / month
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{employee.salaryStructure?.components?.leaveTravelAllowance || 4.167} %</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-700">
                          Fixed Allowance
                          <p className="text-xs text-gray-500">Fixed allowance portion of wages is determined after subtracting all Salary components</p>
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {employee.salaryStructure?.components?.fixedAllowance || 2000} ₹ / month
                          </span>
                          <span className="text-xs text-gray-500 ml-2">11.67 %</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Deductions */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Provident Fund (PF) Contribution</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-700">
                          Employee
                          <p className="text-xs text-gray-500">PF is calculated based on the basic salary</p>
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            3000.00 ₹ / month
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{employee.salaryStructure?.deductionConfig?.pfRate || 12}.00 %</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-700">
                          Employer
                          <p className="text-xs text-gray-500">PF is calculated based on the basic salary</p>
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            3000.00 ₹ / month
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{employee.salaryStructure?.deductionConfig?.pfRate || 12}.00 %</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Tax Deductions</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-700">
                          Professional Tax
                          <p className="text-xs text-gray-500">Professional Tax deducted from the Gross salary</p>
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {employee.salaryStructure?.deductionConfig?.professionalTax || 200} ₹ / month
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                    <input
                      type="text"
                      readOnly
                      value="N/A"
                      className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                    <input
                      type="text"
                      readOnly
                      value="N/A"
                      className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
                    <input
                      type="text"
                      readOnly
                      value="N/A"
                      className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PAN No</label>
                    <input
                      type="text"
                      readOnly
                      value="N/A"
                      className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">UAN NO</label>
                    <input
                      type="text"
                      readOnly
                      value="N/A"
                      className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Emp Code</label>
                    <input
                      type="text"
                      readOnly
                      value={employee.employeeId}
                      className="w-full px-4 py-2 border-b border-gray-300 focus:border-primary-bright focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
