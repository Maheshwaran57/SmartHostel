import React, { useEffect, useState } from 'react';
import { messService } from '../../services/messService';
import { Card } from '../../components/common/Card';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const MessMenu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await messService.getWeekMenu();
        if (res.data.success) {
          setMenus(res.data.menus);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (loading) return <LoadingSkeleton variant="card" count={3} />;

  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mess Menu</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Weekly schedule of meals served in the hostel mess.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weekdays.map((day) => {
          const menu = menus.find(m => m.day.toLowerCase() === day.toLowerCase());

          return (
            <Card key={day} title={day.toUpperCase()} className="capitalize border-l-4 border-l-primary-500">
              {menu && !menu.isHoliday ? (
                <div className="space-y-3.5">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Breakfast</span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{menu.breakfast.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Lunch</span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{menu.lunch.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Snacks</span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{menu.snacks?.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Dinner</span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{menu.dinner.join(', ')}</p>
                  </div>
                </div>
              ) : menu?.isHoliday ? (
                <p className="text-sm text-amber-600 font-semibold py-4">Holiday: {menu.specialNote || 'No meals served'}</p>
              ) : (
                <p className="text-sm text-gray-450 py-4">Menu not updated for this day.</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MessMenu;