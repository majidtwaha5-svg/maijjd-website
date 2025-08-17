import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token and get user profile
      apiService.getProfile()
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem('authToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await apiService.login(credentials);
      const payload = response?.data || response; // backend returns {message, data:{user, authentication}}
      const userData = payload?.user || payload?.data?.user || payload?.profile || null;
      const accessToken = payload?.authentication?.accessToken || payload?.token || payload?.data?.authentication?.accessToken;
      const refreshToken = payload?.authentication?.refreshToken || payload?.data?.authentication?.refreshToken;
      
      // Store token and user data
      if (accessToken) localStorage.setItem('authToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setError(null);
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await apiService.register(userData);
      const payload = response?.data || response;
      const newUser = payload?.user || payload?.data?.user || null;
      const accessToken = payload?.authentication?.accessToken || payload?.token || payload?.data?.authentication?.accessToken;
      const refreshToken = payload?.authentication?.refreshToken || payload?.data?.authentication?.refreshToken;
      
      // Store token and user data
      if (accessToken) localStorage.setItem('authToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      setUser(newUser);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
