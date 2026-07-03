import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const [roleMode, setRoleMode] = useState('student');
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await login(data.email, data.password);
    setLoading(false);

    if (res.success) {
      toast.success('Logged in successfully!');
      const savedUser = JSON.parse(localStorage.getItem('user')) || {};
      const role = savedUser.role || 'student';
      navigate(`/${role}/dashboard`, { replace: true });
    } else {
      toast.error(res.error || 'Invalid credentials');
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'student') {
      setValue('email', 'student1@hostel.com');
      setValue('password', 'student123');
      setRoleMode('student');
    } else {
      setValue('email', 'admin@hostel.com');
      setValue('password', 'admin123');
      setRoleMode('warden');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 font-sans text-slate-800">
      
      {/* Centered Modern Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[400px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 sm:p-10 shadow-xl relative"
      >
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Sign In</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Enter your credential details below to access your portal.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200/60 mb-6">
          <button
            type="button"
            onClick={() => {
              setRoleMode('student');
              setValue('email', '');
              setValue('password', '');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              roleMode === 'student'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleMode('warden');
              setValue('email', '');
              setValue('password', '');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              roleMode === 'warden'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Warden
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-650 mb-2">Email Address</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-[#b3001e]/10 rounded-2xl focus:outline-none text-slate-800 placeholder-slate-400 text-xs transition-all duration-150"
                {...register('email', { required: 'Email is required' })}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-655 mb-2">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-[#b3001e]/10 rounded-2xl focus:outline-none text-slate-800 placeholder-slate-400 text-xs transition-all duration-150"
                {...register('password', { required: 'Password is required' })}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end text-xs">
            <Link to="/forgot-password" className="text-slate-450 hover:text-slate-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Crimson Red Submit Pill Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#b3001e] text-white hover:bg-[#900018] rounded-2xl font-bold shadow-lg shadow-[#b3001e]/15 hover:shadow-[#b3001e]/20 transition text-xs uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Get Started'}
          </button>

          {/* Quick Demo Access */}
          <div className="pt-5 border-t border-slate-200/80 space-y-2.5">
            <p className="text-[9px] text-center text-slate-400 uppercase tracking-widest font-extrabold">Demo Quick Sign-In</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 transition"
              >
                Demo Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('warden')}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 transition"
              >
                Demo Warden
              </button>
            </div>
          </div>

          <p className="text-xs text-center text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#b3001e] font-extrabold hover:underline">
              Register
            </Link>
          </p>
        </form>

      </motion.div>
    </div>
  );
};

export default LoginPage;