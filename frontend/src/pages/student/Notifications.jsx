import React, { useEffect, useState } from 'react';
import { notificationService } from '../../services/notificationService';
import { Card } from '../../components/common/Card';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNoti = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoti();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      toast.success('All notifications marked as read');
      fetchNoti();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await notificationService.markAsRead(id);
      fetchNoti();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Important updates for gatepass approvals, complaint responses, room assignments, and mess alerts.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Unread</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{unreadCount}</p>
            </div>
            {notifications.length > 0 && (
              <Button variant="secondary" onClick={handleMarkAllRead}>Mark all read</Button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton variant="table-row" count={5} />
      ) : notifications.length === 0 ? (
        <Card className="text-center py-12 text-slate-500 dark:text-slate-300">
          No new notifications.
        </Card>
      ) : (
        <div className="grid gap-4">
          {notifications.map((n) => (
            <button
              type="button"
              key={n._id}
              onClick={() => handleMarkRead(n._id, n.isRead)}
              className={`w-full text-left rounded-3xl border p-5 transition duration-200 ${
                n.isRead
                  ? 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
                  : 'border-slate-300 bg-white shadow-sm text-slate-900 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold tracking-tight">{n.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{n.message}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500 flex-shrink-0">
                  {formatDistanceToNow(new Date(n.createdAt))} ago
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">{n.type || 'General'}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">{n.isRead ? 'Read' : 'Unread'}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;