import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

export const DashboardLayout = ({ requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const defaultDashboard = `/${user.role}/dashboard`;
    return <Navigate to={defaultDashboard} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 via-white to-surface-100 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Container */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${collapsed ? 'md:pl-20' : 'md:pl-64'}`}>
        {/* Topbar */}
        <Topbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Inner Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;