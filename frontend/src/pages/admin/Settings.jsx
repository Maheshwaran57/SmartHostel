import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleUpdate = (data) => {
    toast.success('System settings saved successfully!');
    reset();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Configure global hostel rules, notifications, and system parameters.</p>
      </div>

      <Card title="General Configurations">
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          <Input label="Hostel Name" defaultValue="Backpackers" error={errors.hostelName} {...register('hostelName')} />
          <Input label="Warden Name" defaultValue="Dr. John Doe" error={errors.wardenName} {...register('wardenName')} />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Curfew Time" defaultValue="21:30" placeholder="e.g. 21:30" {...register('curfewTime')} />
            <Input label="Complaints Auto-Assign" defaultValue="plumber@backpackers.com" placeholder="Default plumber email" {...register('autoPlumber')} />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">Save Configurations</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Settings;