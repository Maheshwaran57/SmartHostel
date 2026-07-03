import React, { useState } from 'react';
import { HiOutlineMenu, HiOutlineSun, HiOutlineMoon, HiOutlineBell } from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext';
import { NotificationDropdown } from './NotificationDropdown';

export const Topbar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { isDark, toggleTheme } = useTheme();
  const [notiOpen, setNotiOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md border-b border-surface-200 dark:border-surface-700 px-6 flex items-center justify-between shadow-sm shadow-slate-200/20 dark:shadow-none">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg md:hidden"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        {/* Desktop Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg hidden md:block"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
        >
          {isDark ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Notifications toggle */}
        <div className="relative">
          <button
            onClick={() => setNotiOpen(!notiOpen)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <NotificationDropdown isOpen={notiOpen} onClose={() => setNotiOpen(false)} />
        </div>
      </div>
    </header>
  );
};