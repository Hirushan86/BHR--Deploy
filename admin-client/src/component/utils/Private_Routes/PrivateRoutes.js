import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const PrivateRoutes = () => {
  const { user } = useAuth(); // Get the user data from the context

  // Check if user is authenticated and an admin
  if (user && user.isAdmin) {
    return <Outlet />;
  } else if (user && !user.isAdmin) {
    // Redirect non-admin users to an unauthorized page
    return <Navigate to="/sign-in" />;
  } else {
    // Redirect unauthenticated users to the sign-in page
    return <Navigate to="/sign-in" />;
  }
};

export default PrivateRoutes;
