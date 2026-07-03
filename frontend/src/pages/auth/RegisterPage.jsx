import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      department: data.department,
      year: parseInt(data.year),
      emergencyContact: {
        name: data.emergencyName,
        phone: data.emergencyPhone,
        relation: data.emergencyRelation
      }
    });
    setLoading(false);

    if (res.success) {
      toast.success('Registration successful!');
      navigate('/student/dashboard', { replace: true });
    } else {
      toast.error(res.error || 'Registration failed');
    }
  };

  const depts = [
    { value: 'CSE', label: 'Computer Science (CSE)' },
    { value: 'ECE', label: 'Electronics & Comm (ECE)' },
    { value: 'EEE', label: 'Electrical & Electronics (EEE)' },
    { value: 'ME', label: 'Mechanical Eng (ME)' },
    { value: 'CE', label: 'Civil Eng (CE)' },
    { value: 'IT', label: 'Information Tech (IT)' }
  ];

  const years = [
    { value: '1', label: 'First Year (1st)' },
    { value: '2', label: 'Second Year (2nd)' },
    { value: '3', label: 'Third Year (3rd)' },
    { value: '4', label: 'Fourth Year (4th)' },
    { value: '5', label: 'Fifth Year (5th)' }
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 sm:p-6 md:p-8 font-sans text-slate-800">
      
      {/* Centered Modern Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 sm:p-10 shadow-xl relative"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Register Profile</h2>
          <p className="text-xs text-slate-500 mt-2">Submit details to create your student housing profile.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN: Personal Details */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#b3001e] pb-1.5 border-b border-slate-100 dark:border-slate-800 mb-4">
                Personal Details
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-550 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Aarav Sharma"
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-primary-500/10 rounded-2xl focus:outline-none text-slate-800 placeholder-slate-450 text-xs transition-all"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-555 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="student@hostel.com"
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-primary-500/10 rounded-2xl focus:outline-none text-slate-800 placeholder-slate-450 text-xs transition-all"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-555 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="+919876543210"
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-primary-500/10 rounded-2xl focus:outline-none text-slate-800 placeholder-slate-455 text-xs transition-all"
                  {...register('phone', { required: 'Phone is required' })}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-555 mb-1.5">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-primary-500/10 rounded-2xl focus:outline-none text-slate-800 placeholder-slate-455 text-xs transition-all"
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-555 mb-1.5">Confirm</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-primary-500/10 rounded-2xl focus:outline-none text-slate-800 placeholder-slate-455 text-xs transition-all"
                    {...register('confirmPassword', {
                      required: 'Please confirm password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Academic & Emergency Info */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#b3001e] pb-1.5 border-b border-slate-100 dark:border-slate-800 mb-4">
                Academic & Emergency Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-555 mb-1.5">Department</label>
                  <select
                    className="w-full px-3 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-primary-500/10 rounded-2xl focus:outline-none text-slate-800 text-xs transition-all"
                    {...register('department', { required: true })}
                  >
                    {depts.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-555 mb-1.5">Current Year</label>
                  <select
                    className="w-full px-3 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-primary-500/10 rounded-2xl focus:outline-none text-slate-800 text-xs transition-all"
                    {...register('year', { required: true })}
                  >
                    {years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-555 mb-1.5">Emergency Contact Name</label>
                <input
                  type="text"
                  placeholder="Guardian's Name"
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-primary-500/10 rounded-2xl focus:outline-none text-slate-800 placeholder-slate-455 text-xs transition-all"
                  {...register('emergencyName', { required: 'Emergency contact name required' })}
                />
                {errors.emergencyName && <p className="text-red-500 text-xs mt-1">{errors.emergencyName.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-555 mb-1.5">Emergency Phone</label>
                  <input
                    type="text"
                    placeholder="Phone"
                    className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-primary-500/10 rounded-2xl focus:outline-none text-slate-800 placeholder-slate-455 text-xs transition-all"
                    {...register('emergencyPhone', { required: 'Emergency phone required' })}
                  />
                  {errors.emergencyPhone && <p className="text-red-500 text-xs mt-1">{errors.emergencyPhone.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-555 mb-1.5">Relationship</label>
                  <input
                    type="text"
                    placeholder="e.g. Father"
                    className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-primary-500/10 rounded-2xl focus:outline-none text-slate-800 placeholder-slate-455 text-xs transition-all"
                    {...register('emergencyRelation', { required: 'Relationship is required' })}
                  />
                  {errors.emergencyRelation && <p className="text-red-500 text-xs mt-1">{errors.emergencyRelation.message}</p>}
                </div>
              </div>

            </div>

          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[#b3001e] font-extrabold hover:underline">
                Sign In
              </Link>
            </p>
            {/* Crimson Red Submit Pill Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-[#b3001e] text-white hover:bg-[#900018] rounded-2xl font-bold shadow-lg shadow-[#b3001e]/15 transition text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Register'}
            </button>
          </div>
        </form>

      </motion.div>
    </div>
  );
};

export default RegisterPage;