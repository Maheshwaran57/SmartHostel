import React, { useEffect, useState } from 'react';
import { roomService } from '../../services/roomService';
import { studentService } from '../../services/studentService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import toast from 'react-hot-toast';

export const RoomAllocation = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [allocating, setAllocating] = useState(false);

  const loadData = async () => {
    try {
      const resSt = await studentService.getStudents({ limit: 100 });
      const resRm = await roomService.getRooms({ limit: 100 });
      if (resSt.data.success) setStudents(resSt.data.students);
      if (resRm.data.success) setRooms(resRm.data.rooms);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAutoAllocation = async () => {
    if (!selectedStudent) return toast.error('Please select a student');
    setAllocating(true);
    try {
      const res = await roomService.allocateRoom(selectedStudent);
      if (res.data.success) {
        toast.success('Room allocated automatically!');
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Allocation failed');
    } finally {
      setAllocating(false);
    }
  };

  const handleManualAllocation = async () => {
    if (!selectedStudent || !selectedRoom) return toast.error('Please select both student and room');
    setAllocating(true);
    try {
      const res = await roomService.manualAllocate(selectedStudent, selectedRoom);
      if (res.data.success) {
        toast.success('Room allocated manually!');
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Manual allocation failed');
    } finally {
      setAllocating(false);
    }
  };

  const handleDeallocate = async () => {
    if (!selectedStudent) return toast.error('Please select a student');
    setAllocating(true);
    try {
      const res = await roomService.deallocateRoom(selectedStudent);
      if (res.data.success) {
        toast.success('Room deallocated successfully!');
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deallocation failed');
    } finally {
      setAllocating(false);
    }
  };

  const studentOpts = students.map(s => ({ value: s._id, label: `${s.name} (${s.email})` }));
  const roomOpts = rooms
    .filter(r => r.status !== 'full' && r.status !== 'maintenance')
    .map(r => ({ value: r._id, label: `${r.block}-${r.roomNumber} (Occupied: ${r.occupancy}/${r.capacity})` }));

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Room Allocation Control</h2>
        <p className="text-sm text-gray-500 mt-1">Allocate, transfer, and deallocate rooms manually or automatically.</p>
      </div>

      <Card title="Allocation Action Panel" className="space-y-6">
        <Select label="Select Student" placeholder="Select Student..." options={studentOpts} value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} />
        <Select label="Select Room (Manual only)" placeholder="Select Room..." options={roomOpts} value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <Button fullWidth loading={allocating} onClick={handleAutoAllocation}>Auto Allocate</Button>
          <Button fullWidth variant="secondary" loading={allocating} onClick={handleManualAllocation}>Manual Allocate</Button>
          <Button fullWidth variant="danger" loading={allocating} onClick={handleDeallocate}>Deallocate</Button>
        </div>
      </Card>
    </div>
  );
};

export default RoomAllocation;