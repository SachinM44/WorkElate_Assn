import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}