const Room = require('../models/Room');
const User = require('../models/User');
const Allocation = require('../models/Allocation');
const AppError = require('../utils/AppError');
const allocationService = require('../services/allocationService');
const { paginate } = require('../utils/helpers');

const getRooms = async (req, res, next) => {
  try {
    const { block, status, floor, page, limit } = req.query;
    const filter = {};

    if (block) filter.block = block.toUpperCase();
    if (status) filter.status = status;
    if (floor) filter.floor = parseInt(floor, 10);

    const { skip, limit: limitVal, page: pageVal } = paginate(req.query, page, limit);

    const rooms = await Room.find(filter)
      .skip(skip)
      .limit(limitVal)
      .populate('occupants', 'name email department year');

    const total = await Room.countDocuments(filter);

    res.status(200).json({
      success: true,
      rooms,
      page: pageVal,
      totalPages: Math.ceil(total / limitVal),
      total
    });
  } catch (error) {
    next(error);
  }
};

const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('occupants', 'name email department year phone');
    if (!room) {
      return next(new AppError('Room not found', 404));
    }
    res.status(200).json({
      success: true,
      room
    });
  } catch (error) {
    next(error);
  }
};

const createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({
      success: true,
      room
    });
  } catch (error) {
    next(error);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!room) {
      return next(new AppError('Room not found', 404));
    }

    res.status(200).json({
      success: true,
      room
    });
  } catch (error) {
    next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return next(new AppError('Room not found', 404));
    }

    if (room.occupancy > 0) {
      return next(new AppError('Cannot delete a room that has occupants allocated.', 400));
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const allocateRoom = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const allocation = await allocationService.autoAllocateRoom(studentId, req.user.id);
    res.status(200).json({
      success: true,
      allocation
    });
  } catch (error) {
    next(error);
  }
};

const manualAllocate = async (req, res, next) => {
  try {
    const { studentId, roomId } = req.body;
    const allocation = await allocationService.manualAllocateRoom(studentId, roomId, req.user.id);
    res.status(200).json({
      success: true,
      allocation
    });
  } catch (error) {
    next(error);
  }
};

const transferRoom = async (req, res, next) => {
  try {
    const { studentId, newRoomId } = req.body;
    const allocation = await allocationService.transferRoom(studentId, newRoomId, req.user.id);
    res.status(200).json({
      success: true,
      allocation
    });
  } catch (error) {
    next(error);
  }
};

const deallocateRoom = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const allocation = await allocationService.deallocateRoom(studentId);
    res.status(200).json({
      success: true,
      message: 'Room deallocated successfully',
      allocation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  allocateRoom,
  manualAllocate,
  transferRoom,
  deallocateRoom
};