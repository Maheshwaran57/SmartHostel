import React, { useEffect, useState } from 'react';
import { gatePassService } from '../../services/gatePassService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const GatePass = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchPasses = async () => {
    setLoading(true);
    try {
      const res = await gatePassService.getGatePasses();
      if (res.data.success) {
        setPasses(res.data.gatePasses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await gatePassService.applyGatePass(data);
      if (res.data.success) {
        toast.success('Gate pass applied successfully!');
        reset();
        fetchPasses();
      }
    } catch (err) {
      toast.error('Failed to apply for gate pass');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'departureDate', label: 'Departure', render: (row) => new Date(row.departureDate).toLocaleDateString() },
    { key: 'arrivalDate', label: 'Arrival', render: (row) => new Date(row.arrivalDate).toLocaleDateString() },
    { key: 'reason', label: 'Reason' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'rejectionReason',
      label: 'Remarks',
      render: (row) => <span className="text-rose-500 text-xs">{row.rejectionReason || '-'}</span>
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Apply Form */}
      <div className="lg:col-span-1">
        <Card title="Apply Gate Pass" className="backdrop-blur-md bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="date"
              label="Departure Date"
              error={errors.departureDate}
              {...register('departureDate', { required: 'Departure date is required' })}
            />
            <Input
              type="date"
              label="Intended Return Date"
              error={errors.arrivalDate}
              {...register('arrivalDate', { required: 'Arrival date is required' })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Visit</label>
              <textarea
                className="input-field min-h-[90px] backdrop-blur-md bg-white/50 dark:bg-slate-800/50"
                placeholder="Going home for weekend, medical checkup, etc..."
                error={errors.reason}
                {...register('reason', { required: 'Please specify a reason' })}
              />
              {errors.reason && <p className="text-rose-500 text-xs mt-1">{errors.reason.message}</p>}
            </div>
            <Button type="submit" fullWidth loading={submitting}>Submit Request</Button>
          </form>
        </Card>
      </div>

      {/* History Log */}
      <div className="lg:col-span-2">
        <Card title="Gate Pass History" className="backdrop-blur-md bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
          <DataTable columns={columns} data={passes} loading={loading} />
        </Card>
      </div>
    </div>
  );
};

export default GatePass;