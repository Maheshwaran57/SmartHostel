import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { notificationService } from '../../services/notificationService';
import { Card } from '../../components/common/Card';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  HiOutlineOfficeBuilding,
  HiOutlineKey,
  HiOutlineLibrary,
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineSparkles,
  HiOutlineBell
} from 'react-icons/hi';

export const RoomDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notiLoading, setNotiLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await dashboardService.getStudentDashboard();
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await notificationService.getNotifications();
        if (res.data.success) {
          setNotifications(res.data.notifications);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setNotiLoading(false);
      }
    };

    fetchRoom();
    fetchNotifications();
  }, []);

  const room = data?.roomInfo;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">My Room Details</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A clean overview of your allocated room, roommates, and status.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2"><LoadingSkeleton variant="card" count={1} /></div>
          <div><LoadingSkeleton variant="card" count={1} /></div>
        </div>
      ) : room ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Room Specification Details (Visual Panel Grid) */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Room Specifications" className="shadow-md">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                
                {/* Block Panel */}
                <div className="p-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center gap-3.5">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl">
                    <HiOutlineOfficeBuilding className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Block</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{room.block}</p>
                  </div>
                </div>

                {/* Room Number Panel */}
                <div className="p-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center gap-3.5">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl">
                    <HiOutlineKey className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Room Number</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{room.roomNumber}</p>
                  </div>
                </div>

                {/* Floor Panel */}
                <div className="p-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center gap-3.5">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl">
                    <HiOutlineLibrary className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Floor Level</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Floor {room.floor}</p>
                  </div>
                </div>

                {/* Room Type Panel */}
                <div className="p-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center gap-3.5">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl">
                    <HiOutlineUsers className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Sharing Type</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 capitalize">{room.roomType} Bed</p>
                  </div>
                </div>

                {/* Capacity Panel */}
                <div className="p-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center gap-3.5">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl">
                    <HiOutlineUserGroup className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Capacity</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{room.capacity} Students</p>
                  </div>
                </div>

                {/* Status Panel */}
                <div className="p-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center gap-3.5">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl">
                    <HiOutlineCheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Allocation Status</p>
                    <div className="mt-1"><StatusBadge status={room.status} /></div>
                  </div>
                </div>

              </div>

              {/* Room Amenities Section */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-2 mb-3 text-slate-800 dark:text-white font-bold text-sm">
                  <HiOutlineSparkles className="h-4.5 w-4.5 text-slate-700 dark:text-slate-200" />
                  <span>Room Amenities Provided</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {room.amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold bg-slate-100 dark:bg-surface-800 text-slate-700 dark:text-slate-200 px-3.5 py-1.5 rounded-full border border-surface-200 dark:border-surface-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Roommates Card List */}
          <div className="lg:col-span-1">
            <Card title="Roommates">
              <div className="space-y-4 pt-2">
                {room.occupants.map((occupant) => (
                  <div
                    key={occupant._id}
                    className="flex items-center gap-3.5 p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"
                  >
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white flex items-center justify-center font-semibold text-sm">
                      {occupant.name.split(' ').map((part) => part[0]).slice(0,2).join('').toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{occupant.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{occupant.department} | Year {occupant.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      ) : (
        <Card className="text-center py-12 text-slate-500">
          You are not currently allocated to any room. Please contact the warden.
        </Card>
      )}
    </div>
  );
};

export default RoomDetails;