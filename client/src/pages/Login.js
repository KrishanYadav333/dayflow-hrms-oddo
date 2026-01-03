import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDevLogin, setShowDevLogin] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signin(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDevLogin = async (role) => {
    setError('');
    setLoading(true);

    const credentials = role === 'HR' 
      ? { email: 'admin@dayflow.com', password: 'admin123' }
      : { email: 'john.doe@dayflow.com', password: 'employee123' };

    const result = await signin(credentials);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-primary-bright rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">D</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary-dark">Dayflow</h1>
              <p className="text-xs text-gray-500 tracking-wider">HUMAN RESOURCE MANAGEMENT</p>
            </div>
          </div>
          <p className="text-gray-600 mt-3 text-base font-medium">Every workday, perfectly aligned.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Sign in to continue to your account</p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-primary-bright transition duration-200"
              placeholder="your.email@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-bright focus:border-primary-bright transition duration-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-bright to-primary-medium hover:from-primary-medium hover:to-primary-dark text-white font-bold py-3.5 rounded-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-bright hover:text-primary-dark font-semibold transition duration-200">
              Create Account
            </Link>
          </p>
        </div>

        {/* Development Quick Login */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowDevLogin(!showDevLogin)}
            className="w-full text-xs text-gray-400 hover:text-gray-600 font-medium flex items-center justify-center gap-2 py-2 transition duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>Development Mode</span>
            <svg 
              className={`w-3 h-3 transition-transform ${showDevLogin ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showDevLogin && (
            <div className="mt-3 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-3 text-center font-semibold">Test Credentials</p>
              <button
                onClick={() => handleDevLogin('HR')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-medium to-primary-bright hover:from-primary-dark hover:to-primary-medium text-white py-2.5 px-4 rounded-lg transition-all duration-200 text-sm font-medium disabled:bg-gray-400 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                HR Admin Access
              </button>
              <p className="text-xs text-gray-600 text-center">
                admin@dayflow.com / admin123
              </p>
              <button
                onClick={() => handleDevLogin('Employee')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-accent-melon to-accent-lemon hover:from-accent-melon/90 hover:to-accent-lemon/90 text-white py-2.5 px-4 rounded-lg transition-all duration-200 text-sm font-medium disabled:bg-gray-400 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Employee Access
              </button>
              <p className="text-xs text-gray-600 text-center">
                john.doe@dayflow.com / employee123
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
