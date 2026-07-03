import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { HiOutlineLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.resetPassword(token, data.password);
      if (res.data.success) {
        toast.success('Password reset successfully!');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Token is invalid or has expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="New Password"
        type="password"
        icon={HiOutlineLockClosed}
        placeholder="Enter new password"
        error={errors.password}
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 6, message: 'Password must be at least 6 characters' }
        })}
      />

      <Input
        label="Confirm Password"
        type="password"
        icon={HiOutlineLockClosed}
        placeholder="Confirm new password"
        error={errors.confirmPassword}
        {...register('confirmPassword', {
          required: 'Please confirm password',
          validate: (val) => val === watch('password') || 'Passwords do not match'
        })}
      />

      <Button type="submit" fullWidth loading={loading}>
        Reset Password
      </Button>
    </form>
  );
};

export default ResetPasswordPage;