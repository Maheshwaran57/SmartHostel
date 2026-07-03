const User = require('../models/User');
const Allocation = require('../models/Allocation');
const Room = require('../models/Room');
const AppError = require('../utils/AppError');
const { paginate } = require('../utils/helpers');
const { Parser } = require('json2csv');
const csv = require('csv-parser');
const fs = require('fs');

const getStudents = async (req, res, next) => {
  try {
    const { search, department, year, page, limit } = req.query;
    const filter = { role: 'student', isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (department) filter.department = department;
    if (year) filter.year = parseInt(year, 10);

    const { skip, limit: limitVal, page: pageVal } = paginate(req.query, page, limit);

    const students = await User.find(filter)
      .skip(skip)
      .limit(limitVal)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      students,
      page: pageVal,
      totalPages: Math.ceil(total / limitVal),
      total
    });
  } catch (error) {
    next(error);
  }
};

const getStudent = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return next(new AppError('Student not found', 404));
    }

    const allocation = await Allocation.findOne({ student: student._id, isActive: true })
      .populate('room');

    res.status(200).json({
      success: true,
      student,
      allocation
    });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const { name, email, password, phone, department, year, emergencyContact } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    const student = await User.create({
      name,
      email,
      password,
      role: 'student',
      phone,
      department,
      year,
      emergencyContact
    });

    res.status(201).json({
      success: true,
      student
    });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!student || student.role !== 'student') {
      return next(new AppError('Student not found', 404));
    }

    res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return next(new AppError('Student not found', 404));
    }

    // Soft delete student
    student.isActive = false;
    await student.save();

    // Deallocate room
    const activeAllocation = await Allocation.findOne({ student: student._id, isActive: true });
    if (activeAllocation) {
      const room = await Room.findById(activeAllocation.room);
      if (room) {
        room.occupants = room.occupants.filter(id => id.toString() !== student._id.toString());
        room.occupancy = Math.max(0, room.occupancy - 1);
        await room.save();
      }
      activeAllocation.isActive = false;
      activeAllocation.releasedDate = new Date();
      await activeAllocation.save();
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted and room deallocated'
    });
  } catch (error) {
    next(error);
  }
};

const bulkUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('CSV file is required', 400));
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const studentsCreated = [];
          for (let row of results) {
            const { name, email, password, phone, department, year } = row;
            if (!email) continue;
            const userExists = await User.findOne({ email });
            if (!userExists) {
              const newStudent = await User.create({
                name,
                email,
                password: password || 'student123',
                role: 'student',
                phone,
                department,
                year: parseInt(year, 10) || 1
              });
              studentsCreated.push(newStudent);
            }
          }
          fs.unlinkSync(req.file.path); // remove temp file
          res.status(200).json({
            success: true,
            message: `Successfully processed ${results.length} records. Created ${studentsCreated.length} students.`,
            count: studentsCreated.length
          });
        } catch (err) {
          next(err);
        }
      });
  } catch (error) {
    next(error);
  }
};

const exportStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student', isActive: true });
    const fields = ['name', 'email', 'phone', 'department', 'year'];
    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(students);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
    res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  bulkUpload,
  exportStudents
};