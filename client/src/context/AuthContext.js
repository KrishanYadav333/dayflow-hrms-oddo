import React, { createContext, useState, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state immediately from localStorage
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const signup = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed'
      };
    }
  };

  const signin = async (credentials) => {
    try {
      const response = await api.post('/auth/signin', credentials);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    signup,
    signin,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'HR'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
