import React, { useEffect, useState } from 'react';
import { notificationService } from '../../services/notificationService';
import { formatDistanceToNow } from 'date-fns';

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications([]);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-700 shadow-2xl overflow-hidden z-20 py-2">
        <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center bg-slate-50 dark:bg-surface-950">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Gatepass approvals and complaint updates.</p>
          </div>
          <button onClick={markAllRead} className="text-xs text-slate-700 dark:text-slate-300 font-medium hover:underline">
            Mark all read
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto divide-y divide-surface-200 dark:divide-surface-800">
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-gray-500">
              No new notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className="p-3 hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">{n.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(n.createdAt))} ago
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};