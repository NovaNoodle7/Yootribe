import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ wallet = false, admin = false }) => {
  const user = useSelector((state) => state?.auth?.value?.user);

  if (!user || (wallet && user.wallet && !user.confirmed)) {
    return <Navigate to="/auth/login" />;
  } else if (user) {
    if ((wallet && !user.wallet) || (admin && !user.is_superadmin)) {
      return <Navigate to="/dashboard" />;
    } else if (!wallet && user.wallet) {
      return <Navigate to="/wallet" />;
    }
  }

  return <Outlet />;
};
