import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { HiOutlineMail } from 'react-icons/hi';
import toast from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.forgotPassword(data.email);
      if (res.data.success) {
        toast.success('Password reset link sent to your email!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Enter your registered email and we'll send you a password reset link.
      </p>

      <Input
        label="Email Address"
        type="email"
        icon={HiOutlineMail}
        placeholder="Enter email"
        error={errors.email}
        {...register('email', { required: 'Email address is required' })}
      />

      <Button type="submit" fullWidth loading={loading}>
        Send Reset Link
      </Button>

      <div className="text-sm text-center mt-4">
        <Link to="/login" className="text-primary-600 font-semibold hover:underline">
          Back to Login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordPage;