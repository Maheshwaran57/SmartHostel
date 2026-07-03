import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Student pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { RoomDetails } from './pages/student/RoomDetails';
import { ComplaintList } from './pages/student/ComplaintList';
import { CreateComplaint } from './pages/student/CreateComplaint';
import { ComplaintDetails } from './pages/student/ComplaintDetails';
import { MessMenu } from './pages/student/MessMenu';
import { Notifications } from './pages/student/Notifications';
import { Profile } from './pages/student/Profile';
import { GatePass } from './pages/student/GatePass';

// Staff pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AssignedComplaints } from './pages/staff/AssignedComplaints';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentManagement } from './pages/admin/StudentManagement';
import { RoomManagement } from './pages/admin/RoomManagement';
import { RoomAllocation } from './pages/admin/RoomAllocation';
import { ComplaintManagement } from './pages/admin/ComplaintManagement';
import { MessManagement } from './pages/admin/MessManagement';
import { Reports } from './pages/admin/Reports';
import { Settings } from './pages/admin/Settings';
import { GatePassApprovals } from './pages/admin/GatePassApprovals';
import { AttendanceRegister } from './pages/admin/AttendanceRegister';

export const App = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Layout for login / signup */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* Student Protected Dashboard Routes */}
      <Route element={<DashboardLayout requiredRole="student" />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/room" element={<RoomDetails />} />
        <Route path="/student/complaints" element={<ComplaintList />} />
        <Route path="/student/complaints/new" element={<CreateComplaint />} />
        <Route path="/student/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/student/gatepass" element={<GatePass />} />
        <Route path="/student/mess-menu" element={<MessMenu />} />
        <Route path="/student/notifications" element={<Notifications />} />
        <Route path="/student/profile" element={<Profile />} />
      </Route>

      {/* Staff Protected Dashboard Routes */}
      <Route element={<DashboardLayout requiredRole="staff" />}>
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/complaints" element={<AssignedComplaints />} />
      </Route>

      {/* Admin Protected Dashboard Routes */}
      <Route element={<DashboardLayout requiredRole="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<StudentManagement />} />
        <Route path="/admin/rooms" element={<RoomManagement />} />
        <Route path="/admin/rooms/allocation" element={<RoomAllocation />} />
        <Route path="/admin/complaints" element={<ComplaintManagement />} />
        <Route path="/admin/mess-menu" element={<MessManagement />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/gatepasses" element={<GatePassApprovals />} />
        <Route path="/admin/attendance" element={<AttendanceRegister />} />
        <Route path="/admin/profile" element={<Profile />} />
      </Route>

      {/* Catch all / fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;