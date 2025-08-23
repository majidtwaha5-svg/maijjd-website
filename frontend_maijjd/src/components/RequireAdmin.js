import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RequireAdmin = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

export default RequireAdmin;
