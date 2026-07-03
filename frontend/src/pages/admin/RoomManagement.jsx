import React, { useEffect, useState } from 'react';
import { roomService } from '../../services/roomService';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await roomService.getRooms();
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreate = async (data) => {
    setActionLoading(true);
    try {
      const res = await roomService.createRoom(data);
      if (res.data.success) {
        toast.success('Room created successfully');
        reset();
        setModalOpen(false);
        fetchRooms();
      }
    } catch (err) {
      toast.error('Failed to create room');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room entry?')) return;
    try {
      const res = await roomService.deleteRoom(id);
      if (res.data.success) {
        toast.success('Room deleted successfully');
        fetchRooms();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete room');
    }
  };

  const columns = [
    { key: 'roomNumber', label: 'Room No' },
    { key: 'block', label: 'Block' },
    { key: 'floor', label: 'Floor' },
    { key: 'roomType', label: 'Type', render: (row) => <span className="capitalize">{row.roomType}</span> },
    { key: 'occupancy', label: 'Occupancy', align: 'center', render: (row) => <span>{row.occupancy} / {row.capacity}</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>Delete</Button>
      )
    }
  ];

  const types = [
    { value: 'single', label: 'Single' },
    { value: 'double', label: 'Double' },
    { value: 'triple', label: 'Triple' },
    { value: 'quad', label: 'Quad' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Room Management</h2>
          <p className="text-sm text-gray-500 mt-1">Configure blocks, floors and rooms.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Create Room</Button>
      </div>

      <DataTable columns={columns} data={rooms} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Room Entry">
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Block" placeholder="e.g. A" error={errors.block} {...register('block', { required: 'Block required' })} />
            <Input label="Room Number" placeholder="e.g. A101" error={errors.roomNumber} {...register('roomNumber', { required: 'Room No required' })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Floor" type="number" error={errors.floor} {...register('floor', { required: true })} />
            <Input label="Capacity" type="number" error={errors.capacity} {...register('capacity', { required: true })} />
          </div>

          <Select label="Room Type" options={types} error={errors.roomType} {...register('roomType', { required: true })} />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={actionLoading}>Create Room</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomManagement;