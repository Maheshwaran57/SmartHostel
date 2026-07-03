import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiOutlineExclamationCircle,
  HiOutlineCalendar,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineUserGroup,
  HiOutlineDocumentReport,
  HiOutlineCog,
  HiOutlineClipboardCheck,
  HiOutlineDocumentText
} from 'react-icons/hi';

export const Sidebar = ({ collapsed, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();

  const links = {
    student: [
      { to: '/student/dashboard', label: 'Dashboard', icon: HiOutlineHome },
      { to: '/student/room', label: 'My Room', icon: HiOutlineOfficeBuilding },
      { to: '/student/complaints', label: 'Complaints', icon: HiOutlineExclamationCircle },
      { to: '/student/gatepass', label: 'Gate Pass', icon: HiOutlineDocumentText },
      { to: '/student/mess-menu', label: 'Mess Menu', icon: HiOutlineCalendar },
      { to: '/student/notifications', label: 'Notifications', icon: HiOutlineBell },
      { to: '/student/profile', label: 'Profile', icon: HiOutlineUser }
    ],
    admin: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: HiOutlineHome },
      { to: '/admin/students', label: 'Students', icon: HiOutlineUserGroup },
      { to: '/admin/rooms', label: 'Rooms', icon: HiOutlineOfficeBuilding },
      { to: '/admin/rooms/allocation', label: 'Allocations', icon: HiOutlineOfficeBuilding },
      { to: '/admin/attendance', label: 'Attendance', icon: HiOutlineClipboardCheck },
      { to: '/admin/gatepasses', label: 'Gate Passes', icon: HiOutlineDocumentText },
      { to: '/admin/complaints', label: 'Complaints', icon: HiOutlineExclamationCircle },
      { to: '/admin/mess-menu', label: 'Mess Menu', icon: HiOutlineCalendar },
      { to: '/admin/reports', label: 'Reports', icon: HiOutlineDocumentReport },
      { to: '/admin/settings', label: 'Settings', icon: HiOutlineCog },
      { to: '/admin/profile', label: 'Profile', icon: HiOutlineUser }
    ],
    staff: [
      { to: '/staff/dashboard', label: 'Dashboard', icon: HiOutlineHome },
      { to: '/staff/complaints', label: 'Assigned Tasks', icon: HiOutlineExclamationCircle }
    ]
  };

  const userRole = user?.role || 'student';
  const roleLinks = links[userRole] || [];

  const baseSidebarStyles = 'fixed inset-y-0 left-0 z-40 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 flex flex-col transition-all duration-300';
  const responsiveStyles = mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0';
  const widthStyles = collapsed ? 'w-20' : 'w-64';

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-surface-950/20 backdrop-blur-sm z-30 md:hidden"
        />
      )}
      <aside className={`${baseSidebarStyles} ${responsiveStyles} ${widthStyles}`}>
        {/* logo */}
        <div className="flex h-16 items-center px-6 border-b border-surface-200 dark:border-surface-700">
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-wider">
            {collapsed ? 'BP' : 'Backpackers'}
          </span>
        </div>

        {/* nav links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {roleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ active }) => `sidebar-link ${active ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? link.label : ''}
            >
              <link.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* user section & logout */}
        <div className="border-t border-surface-200 dark:border-surface-700 p-4 space-y-2">
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-1.5 mb-2">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="h-9 w-9 rounded-full border border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-800 object-cover"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white grid place-items-center font-semibold text-sm">
                  {user?.name?.split(' ').map((part) => part[0]).slice(0,2).join('').toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 w-full transition-all duration-200 font-medium ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? 'Logout' : ''}
          >
            <HiOutlineLogout className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};