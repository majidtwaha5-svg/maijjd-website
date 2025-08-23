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
    // Attempt to fetch profile on load using either token or cookie session
    apiService.getProfile()
      .then(response => {
        const payload = response?.data || response;
        const profile = payload?.user || payload?.data?.user || payload?.profile || payload?.data?.profile || null;
        if (profile) setUser(profile);
      })
      .catch(() => {
        // If unauthorized, clear any stale tokens
        localStorage.removeItem('authToken');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await apiService.login(credentials);
      const payload = response?.data || response; // backend returns {message, data:{user, authentication}}
      let userData = payload?.user || payload?.data?.user || payload?.profile || null;
      const accessToken = payload?.authentication?.accessToken || payload?.token || payload?.data?.authentication?.accessToken;
      const refreshToken = payload?.authentication?.refreshToken || payload?.data?.authentication?.refreshToken;
      
      // Store token and user data
      if (accessToken) localStorage.setItem('authToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      // If backend uses session cookies and does not return the user, fetch the profile now
      if (!userData) {
        try {
          const profileRes = await apiService.getProfile();
          const profilePayload = profileRes?.data || profileRes;
          userData = profilePayload?.user || profilePayload?.data?.user || profilePayload?.profile || profilePayload?.data?.profile || null;
        } catch (_) {
          // ignore; error will be surfaced below if userData remains null
        }
      }
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
