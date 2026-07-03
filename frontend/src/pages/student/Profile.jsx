import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { authService } from '../../services/authService';
import { HiOutlineCamera } from 'react-icons/hi';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, updateProfile, uploadAvatar } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      department: user?.department || '',
      year: user?.year || 1,
      emergencyContact: {
        name: user?.emergencyContact?.name || '',
        phone: user?.emergencyContact?.phone || '',
        relation: user?.emergencyContact?.relation || ''
      }
    }
  });

  const [pwdLoading, setPwdLoading] = useState(false);
  const { register: registerPwd, handleSubmit: handleSubmitPwd, formState: { errors: errorsPwd }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await updateProfile(data);
    setLoading(false);

    if (res.success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(res.error || 'Failed to update profile');
    }
  };

  const onSubmitPwd = async (data) => {
    setPwdLoading(true);
    try {
      const res = await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      if (res.data.success) {
        toast.success('Password changed successfully!');
        reset();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type & size (max 5MB)
    if (!file.type.startsWith('image/')) {
      return toast.error('Please select a valid image file');
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size must be less than 5MB');
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadAvatar(formData);
      if (res.success) {
        toast.success('Profile picture updated successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (err) {
      toast.error('Error uploading profile picture');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {/* Avatar Profile card with File Upload capability */}
      <div className="lg:col-span-1">
        <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 text-center py-8">
          <div className="relative inline-block group">
            <img
              src={user?.avatar ? user.avatar : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || 'User'}`}
              alt="Profile"
              className="h-28 w-28 rounded-full mx-auto border-2 border-primary-500 shadow-md bg-primary-50 dark:bg-slate-800 object-cover"
            />
            {/* Edit overlay */}
            <button
              type="button"
              onClick={triggerFileSelect}
              disabled={uploading}
              className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white"
            >
              <HiOutlineCamera className="h-6 w-6 mb-1" />
              <span className="text-[10px] font-semibold">{uploading ? 'Uploading...' : 'Change Photo'}</span>
            </button>
            <span className="absolute bottom-0 right-2 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="mt-4">
            <Button size="sm" variant="secondary" onClick={triggerFileSelect} loading={uploading}>
              Upload Photo
            </Button>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">{user?.name}</h3>
          <p className="text-xs text-gray-550 capitalize font-medium">{user?.role}</p>

          <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 text-left space-y-3.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email Address</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.email}</span>
            </div>
            {user?.role === 'student' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Department</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.department || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Year / Level</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.year ? `Year ${user.year}` : 'N/A'}</span>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Edit Details */}
      <div className="lg:col-span-2 space-y-6">
        <Card title="Edit Profile Details" className="backdrop-blur-md bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Name" error={errors.name} {...register('name', { required: 'Name is required' })} />
              <Input label="Phone Number" error={errors.phone} {...register('phone')} />
            </div>

            {user?.role === 'student' && (
              <div className="grid grid-cols-2 gap-4">
                <Input label="Department" disabled error={errors.department} {...register('department')} />
                <Input label="Year" disabled error={errors.year} {...register('year')} />
              </div>
            )}

            {user?.role === 'student' && (
              <>
                <p className="text-sm font-bold text-gray-900 dark:text-white pt-2 border-t border-slate-200/50 dark:border-slate-800/50">Emergency Contact Information</p>
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Contact Name" error={errors.emergencyContact?.name} {...register('emergencyContact.name')} />
                  <Input label="Phone" error={errors.emergencyContact?.phone} {...register('emergencyContact.phone')} />
                  <Input label="Relation" error={errors.emergencyContact?.relation} {...register('emergencyContact.relation')} />
                </div>
              </>
            )}

            <div className="flex justify-end pt-4">
              <Button type="submit" loading={loading}>Save Profile</Button>
            </div>
          </form>
        </Card>

        <Card title="Change Password" className="backdrop-blur-md bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
          <form onSubmit={handleSubmitPwd(onSubmitPwd)} className="space-y-4">
            <Input type="password" label="Current Password" error={errorsPwd.currentPassword} {...registerPwd('currentPassword', { required: 'Current password is required' })} />
            <Input type="password" label="New Password" error={errorsPwd.newPassword} {...registerPwd('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Min length 6 characters' } })} />
            <div className="flex justify-end pt-4">
              <Button type="submit" loading={pwdLoading}>Update Password</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;