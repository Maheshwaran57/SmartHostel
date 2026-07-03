import React, { useEffect, useState } from 'react';
import { studentService } from '../../services/studentService';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentService.getStudents({ search });
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const handleCreate = async (data) => {
    setActionLoading(true);
    try {
      const res = await studentService.createStudent(data);
      if (res.data.success) {
        toast.success('Student added successfully');
        reset();
        setModalOpen(false);
        fetchStudents();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add student');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student account?')) return;
    try {
      const res = await studentService.deleteStudent(id);
      if (res.data.success) {
        toast.success('Student deleted successfully');
        fetchStudents();
      }
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Dept' },
    { key: 'year', label: 'Year', align: 'center' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>Delete</Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h2>
          <p className="text-sm text-gray-500 mt-1">Manage hostel student accounts.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Add Student</Button>
      </div>

      <div className="flex gap-4 items-center justify-between">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name/email..." />
      </div>

      <DataTable columns={columns} data={students} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Student Account">
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <Input label="Name" placeholder="Full name" error={errors.name} {...register('name', { required: 'Name is required' })} />
          <Input label="Email" placeholder="student@backpackers.com" error={errors.email} {...register('email', { required: 'Email is required' })} />
          <Input label="Password" type="password" placeholder="Min 6 characters" error={errors.password} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })} />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Department" placeholder="e.g. CSE" error={errors.department} {...register('department', { required: true })} />
            <Input label="Year (1-5)" type="number" error={errors.year} {...register('year', { required: true, min: 1, max: 5 })} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={actionLoading}>Create Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentManagement;