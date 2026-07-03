import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthLayout = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    const dashboardRoute = `/${user.role}/dashboard`;
    return <Navigate to={dashboardRoute} replace />;
  }

  // Render children directly so they can have independent screen layouts
  return <Outlet />;
};

export default AuthLayout;