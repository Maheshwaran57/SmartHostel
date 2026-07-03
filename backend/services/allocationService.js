const Room = require('../models/Room');
const User = require('../models/User');
const Allocation = require('../models/Allocation');
const AppError = require('../utils/AppError');

const autoAllocateRoom = async (studentId, allocatedById) => {
  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') {
    throw new AppError('Invalid student ID', 400);
  }

  const existingAllocation = await Allocation.findOne({ student: studentId, isActive: true });
  if (existingAllocation) {
    throw new AppError('Student is already allocated to a room', 400);
  }

  const rooms = await Room.find({ status: { $in: ['available', 'partial'] } })
    .sort({ block: 1, occupancy: -1 });

  if (rooms.length === 0) {
    throw new AppError('No rooms available with matching capacity', 404);
  }

  const room = rooms[0];
  room.occupants.push(studentId);
  room.occupancy += 1;
  await room.save();

  const allocation = await Allocation.create({
    student: studentId,
    room: room._id,
    allocatedBy: allocatedById,
    isActive: true
  });

  return allocation;
};

const manualAllocateRoom = async (studentId, roomId, allocatedById) => {
  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') {
    throw new AppError('Invalid student ID', 400);
  }

  const existingAllocation = await Allocation.findOne({ student: studentId, isActive: true });
  if (existingAllocation) {
    throw new AppError('Student is already allocated to a room', 400);
  }

  const room = await Room.findById(roomId);
  if (!room) {
    throw new AppError('Room not found', 404);
  }

  if (room.status === 'full' || room.status === 'maintenance' || room.occupancy >= room.capacity) {
    throw new AppError('Room is either full or under maintenance', 400);
  }

  room.occupants.push(studentId);
  room.occupancy += 1;
  await room.save();

  const allocation = await Allocation.create({
    student: studentId,
    room: room._id,
    allocatedBy: allocatedById,
    isActive: true
  });

  return allocation;
};

const transferRoom = async (studentId, newRoomId, allocatedById) => {
  const activeAllocation = await Allocation.findOne({ student: studentId, isActive: true });
  if (!activeAllocation) {
    throw new AppError('Student does not have any active room allocation', 400);
  }

  const oldRoom = await Room.findById(activeAllocation.room);
  if (oldRoom) {
    oldRoom.occupants = oldRoom.occupants.filter(id => id.toString() !== studentId.toString());
    oldRoom.occupancy = Math.max(0, oldRoom.occupancy - 1);
    await oldRoom.save();
  }

  const newRoom = await Room.findById(newRoomId);
  if (!newRoom) {
    throw new AppError('New room not found', 404);
  }

  if (newRoom.status === 'full' || newRoom.status === 'maintenance' || newRoom.occupancy >= newRoom.capacity) {
    throw new AppError('New room is either full or under maintenance', 400);
  }

  newRoom.occupants.push(studentId);
  newRoom.occupancy += 1;
  await newRoom.save();

  activeAllocation.isActive = false;
  activeAllocation.releasedDate = new Date();
  await activeAllocation.save();

  const newAllocation = await Allocation.create({
    student: studentId,
    room: newRoom._id,
    allocatedBy: allocatedById,
    isActive: true
  });

  return newAllocation;
};

const deallocateRoom = async (studentId) => {
  const activeAllocation = await Allocation.findOne({ student: studentId, isActive: true });
  if (!activeAllocation) {
    throw new AppError('No active allocation found for this student', 400);
  }

  const room = await Room.findById(activeAllocation.room);
  if (room) {
    room.occupants = room.occupants.filter(id => id.toString() !== studentId.toString());
    room.occupancy = Math.max(0, room.occupancy - 1);
    await room.save();
  }

  activeAllocation.isActive = false;
  activeAllocation.releasedDate = new Date();
  await activeAllocation.save();

  return activeAllocation;
};

module.exports = {
  autoAllocateRoom,
  manualAllocateRoom,
  transferRoom,
  deallocateRoom
};