import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    profilePicture: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/employee/profile');
      setProfile(response.data.data);
      setFormData({
        phone: response.data.data.phone || '',
        address: response.data.data.address || '',
        profilePicture: response.data.data.profilePicture || ''
      });
      setLoading(false);
    } catch (error) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/employee/profile', formData);
      setProfile(response.data.data);
      setSuccess('Profile updated successfully');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-primary-bright/10 rounded-lg">
                <svg className="w-8 h-8 text-primary-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-bright to-primary-medium hover:from-primary-medium hover:to-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            )}
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

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Picture URL
                  </label>
                  <input
                    type="text"
                    name="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400"
                  placeholder="123 Main St, City, State"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Employee ID</p>
                  <p className="text-xl font-bold text-gray-900">{profile?.employeeId}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-100">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-900 break-all">{profile?.email}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100">
                  <p className="text-sm text-gray-600 font-semibold mb-1">First Name</p>
                  <p className="text-xl font-bold text-gray-900">{profile?.firstName}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Last Name</p>
                  <p className="text-xl font-bold text-gray-900">{profile?.lastName}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-white rounded-lg border border-yellow-100">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">{profile?.phone || 'Not provided'}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-white rounded-lg border border-indigo-100">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Role</p>
                  <p className="text-xl font-bold text-indigo-700">{profile?.role}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-pink-50 to-white rounded-lg border border-pink-100">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Department</p>
                  <p className="text-lg font-semibold text-gray-900">{profile?.department || 'Not assigned'}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-pink-50 to-white rounded-lg border border-pink-100">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Position</p>
                  <p className="text-lg font-semibold text-gray-900">{profile?.position || 'Not assigned'}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Join Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Base Salary</p>
                  <p className="text-xl font-bold text-emerald-700">
                    ${profile?.baseSalary?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Allowances</p>
                  <p className="text-xl font-bold text-emerald-600">
                    ${profile?.allowances?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-lg border-2 border-green-300">
                  <p className="text-sm text-gray-700 font-bold mb-1">Total Compensation</p>
                  <p className="text-2xl font-bold text-green-700">
                    ${((profile?.baseSalary || 0) + (profile?.allowances || 0)).toLocaleString()}
                  </p>
                </div>
              </div>

              {profile?.address && (
                <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Address</p>
                  <p className="text-lg font-semibold text-gray-900">{profile.address}</p>
                </div>
              )}

              {/* Documents Section */}
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <span className="p-2 bg-primary-bright/10 rounded-lg">
                    <svg className="w-6 h-6 text-primary-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  <h3 className="text-2xl font-bold text-gray-800">Documents</h3>
                </div>
                {profile?.documents && profile.documents.length > 0 ? (
                  <div className="space-y-3">
                    {profile.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-primary-bright transition-all duration-200 shadow-sm hover:shadow-md">
                        <div className="flex items-center">
                          <div className="p-2 bg-primary-bright/10 rounded-lg mr-4">
                            <svg className="w-6 h-6 text-primary-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <a
                          href={`http://localhost:5000${doc.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary-bright hover:text-primary-dark font-semibold text-sm transition-colors"
                        >
                          View
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No documents uploaded yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
