import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

// Eager load auth pages for immediate access
import Login from './pages/Login';
import Signup from './pages/Signup';

// Lazy load other pages to reduce initial bundle size
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Leave = lazy(() => import('./pages/Leave'));
const Employees = lazy(() => import('./pages/Employees'));
const AllAttendance = lazy(() => import('./pages/AllAttendance'));
const LeaveManagement = lazy(() => import('./pages/LeaveManagement'));
const Payroll = lazy(() => import('./pages/Payroll'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-bright mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/:id" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leave" 
            element={
              <ProtectedRoute>
                <Leave />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Only Routes */}
          <Route 
            path="/employees" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Employees />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/all-attendance" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AllAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leave-management" 
            element={
              <ProtectedRoute adminOnly={true}>
                <LeaveManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/payroll" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Payroll />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 - Redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
