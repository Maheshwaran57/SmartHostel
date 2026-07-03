import React, { useEffect, useState } from 'react';
import { messService } from '../../services/messService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const MessManagement = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [actionLoading, setActionLoading] = useState(false);

  const fetchWeek = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchWeek();
  }, []);

  const handleUpdate = async (data) => {
    setActionLoading(true);
    const splitArr = (str) => str ? str.split(',').map(s => s.trim()) : [];
    
    const formatted = {
      date: data.date,
      day: data.day,
      breakfast: splitArr(data.breakfast),
      lunch: splitArr(data.lunch),
      snacks: splitArr(data.snacks),
      dinner: splitArr(data.dinner),
      isHoliday: data.isHoliday === 'true',
      isSpecial: data.isSpecial === 'true',
      specialNote: data.specialNote
    };

    try {
      const res = await messService.createMenu(formatted);
      if (res.data.success) {
        toast.success('Mess menu updated successfully!');
        reset();
        setModalOpen(false);
        fetchWeek();
      }
    } catch (err) {
      toast.error('Failed to update mess menu');
    } finally {
      setActionLoading(false);
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mess Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage weekly mess schedules and meal items.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Update/Add Day Menu</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day) => {
          const menu = menus.find(m => m.day.toLowerCase() === day.toLowerCase());

          return (
            <Card key={day} title={day.toUpperCase()} className="capitalize border-l-4 border-l-primary-500">
              {menu && !menu.isHoliday ? (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="font-bold text-gray-550">Breakfast</span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{menu.breakfast.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-550">Lunch</span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{menu.lunch.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-550">Dinner</span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{menu.dinner.join(', ')}</p>
                  </div>
                </div>
              ) : menu?.isHoliday ? (
                <p className="text-sm text-amber-600 font-semibold py-4">Holiday: {menu.specialNote || 'No meals served'}</p>
              ) : (
                <p className="text-xs text-gray-450 py-4">Not Updated</p>
              )}
            </Card>
          );
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Update Mess Day Menu">
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          <Input type="date" label="Select Date" error={errors.date} {...register('date', { required: true })} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weekday</label>
            <select className="input-field" {...register('day', { required: true })}>
              {days.map(d => <option key={d} value={d} className="capitalize">{d}</option>)}
            </select>
          </div>

          <Input label="Breakfast Menu (Comma separated)" placeholder="Poha, Tea, Milk" error={errors.breakfast} {...register('breakfast')} />
          <Input label="Lunch Menu" placeholder="Rice, Dal, Roti, Sabzi" error={errors.lunch} {...register('lunch')} />
          <Input label="Snacks Menu" placeholder="Samosa, Tea" error={errors.snacks} {...register('snacks')} />
          <Input label="Dinner Menu" placeholder="Roti, Paneer Butter Masala, Custard" error={errors.dinner} {...register('dinner')} />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={actionLoading}>Update Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MessManagement;