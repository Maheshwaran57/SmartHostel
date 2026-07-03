import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { FileUpload } from '../../components/common/FileUpload';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import toast from 'react-hot-toast';

export const CreateComplaint = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (files) => {
    setImages(files);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('priority', data.priority);

    if (Array.isArray(images)) {
      images.forEach(img => formData.append('images', img));
    } else if (images) {
      formData.append('images', images);
    }

    try {
      const res = await complaintService.createComplaint(formData);
      if (res.data.success) {
        toast.success('Complaint filed successfully!');
        navigate('/student/complaints');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'water', label: 'Water' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'internet', label: 'Internet' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'security', label: 'Security' },
    { value: 'others', label: 'Others' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">File Complaint</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submit issues to maintenance or administration for fast resolution.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Complaint Title" placeholder="Brief name of the issue" error={errors.title} {...register('title', { required: 'Title is required' })} />

          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" options={categories} error={errors.category} {...register('category', { required: 'Required' })} />
            <Select label="Priority" options={priorities} error={errors.priority} {...register('priority', { required: 'Required' })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea
              className="input-field min-h-[120px]"
              placeholder="Describe the issue in details..."
              {...register('description', { required: 'Description is required' })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Optional Images</label>
            <FileUpload multiple onFileSelect={handleFileSelect} />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => navigate('/student/complaints')}>Cancel</Button>
            <Button type="submit" loading={loading}>Submit Complaint</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateComplaint;