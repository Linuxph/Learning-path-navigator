// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // If the user is not authenticated, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the component they are trying to access
  return children;
};

export default ProtectedRoute;