require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Room = require('./models/Room');
const Allocation = require('./models/Allocation');
const Complaint = require('./models/Complaint');
const MessMenu = require('./models/MessMenu');
const Notification = require('./models/Notification');
const Staff = require('./models/Staff');
const AuditLog = require('./models/AuditLog');
const Attendance = require('./models/Attendance');
const GatePass = require('./models/GatePass');

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_management';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(dbURI);
    console.log('Connected to Database. Dropping existing collections...');

    await User.deleteMany({});
    await Room.deleteMany({});
    await Allocation.deleteMany({});
    await Complaint.deleteMany({});
    await Attendance.deleteMany({});
    await GatePass.deleteMany({});
    await MessMenu.deleteMany({});
    await Notification.deleteMany({});
    await Staff.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('Seeding admin...');
    const admin = await User.create({
      name: 'Hostel Warden',
      email: 'admin@hostel.com',
      password: 'admin123',
      role: 'admin',
      phone: '+919876543210',
      isActive: true
    });

    console.log('Seeding staff...');
    const staffUsers = [
      { name: 'Ramesh Kumar', email: 'plumber@hostel.com', role: 'staff', staffRole: 'plumber', phone: '+919988776655' },
      { name: 'Suresh Singh', email: 'electrician@hostel.com', role: 'staff', staffRole: 'electrician', phone: '+919988776644' },
      { name: 'Amit Sharma', email: 'cleaner@hostel.com', role: 'staff', staffRole: 'cleaner', phone: '+919988776633' }
    ];

    const createdStaff = [];
    for (let su of staffUsers) {
      const user = await User.create({
        name: su.name,
        email: su.email,
        password: 'staff123',
        role: su.role,
        staffRole: su.staffRole,
        phone: su.phone,
        isActive: true
      });
      
      const staffRecord = await Staff.create({
        user: user._id,
        specialization: su.staffRole,
        availability: true
      });
      createdStaff.push(user);
    }

    console.log('Seeding rooms...');
    const blocks = ['A', 'B', 'C', 'D'];
    const roomsCreated = [];

    for (let block of blocks) {
      for (let floor = 1; floor <= 3; floor++) {
        for (let roomNum = 1; roomNum <= 3; roomNum++) {
          const roomNumber = `${block}${floor}0${roomNum}`;
          let capacity = 3;
          let roomType = 'triple';

          if (roomNum === 1) {
            capacity = 1;
            roomType = 'single';
          } else if (roomNum === 2) {
            capacity = 2;
            roomType = 'double';
          }

          const room = await Room.create({
            block,
            floor,
            roomNumber,
            capacity,
            roomType,
            status: 'available',
            occupants: [],
            amenities: ['Bed', 'Study Table', 'Chair', 'Fan', 'Almirah']
          });
          roomsCreated.push(room);
        }
      }
    }

    console.log('Seeding students and allocating rooms...');
    const indianNames = [
      'Aarav Sharma', 'Priya Patel', 'Rahul Kumar', 'Sneha Reddy', 'Aditya Iyer',
      'Ananya Rao', 'Vikram Singh', 'Divya Nair', 'Rohan Mehta', 'Neha Gupta',
      'Siddharth Joshi', 'Kavita Verma', 'Manish Pandey', 'Pooja Choudhary', 'Arjun Saxena',
      'Shreya Mishra', 'Kunal Sen', 'Ritu Kapoor', 'Sanjay Dutt', 'Jyoti Prasad'
    ];

    const departments = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT'];

    for (let i = 0; i < indianNames.length; i++) {
      const email = `student${i + 1}@hostel.com`;
      const dept = departments[i % departments.length];
      const year = (i % 4) + 1;

      const student = await User.create({
        name: indianNames[i],
        email,
        password: 'student123',
        role: 'student',
        phone: `+9198000000${i < 10 ? '0' + i : i}`,
        department: dept,
        year,
        emergencyContact: {
          name: `Parent of ${indianNames[i]}`,
          phone: '+919900000000',
          relation: 'Father'
        },
        isActive: true
      });

      // Allocate first 15 students to rooms
      if (i < 15) {
        const availableRoom = roomsCreated.find(r => r.occupants.length < r.capacity);
        if (availableRoom) {
          availableRoom.occupants.push(student._id);
          availableRoom.occupancy = availableRoom.occupants.length;
          // Auto update status based on occupancy
          if (availableRoom.occupancy === availableRoom.capacity) {
            availableRoom.status = 'full';
          } else {
            availableRoom.status = 'partial';
          }
          await availableRoom.save();

          await Allocation.create({
            student: student._id,
            room: availableRoom._id,
            allocatedBy: admin._id,
            isActive: true
          });
        }
      }
    }

    console.log('Seeding mess menu...');
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const meals = {
      monday: { b: ['Poha', 'Tea', 'Boiled Eggs'], l: ['Roti', 'Dal Tadka', 'Rice', 'Alloo Gobhi'], d: ['Roti', 'Egg Curry', 'Rice', 'Salad'], s: ['Samosa', 'Tea'] },
      tuesday: { b: ['Idli Sambhar', 'Coconut Chutney', 'Tea'], l: ['Roti', 'Rajma Chawal', 'Bhindi Fry'], d: ['Roti', 'Mix Veg', 'Rice', 'Kheer'], s: ['Biscuits', 'Tea'] },
      wednesday: { b: ['Aloo Paratha', 'Curd', 'Pickle'], l: ['Roti', 'Kadi Pakoda', 'Rice', 'Alloo Gajar'], d: ['Roti', 'Chicken Curry', 'Paneer Butter Masala', 'Rice'], s: ['Veg Cutlet', 'Tea'] },
      thursday: { b: ['Methi Paratha', 'Butter', 'Tea'], l: ['Roti', 'Chana Masala', 'Rice', 'Cabbage Sabzi'], d: ['Roti', 'Dal Makhani', 'Rice', 'Ice Cream'], s: ['Puff', 'Coffee'] },
      friday: { b: ['Veg Sandwich', 'Ketchup', 'Tea'], l: ['Roti', 'Black Chana', 'Rice', 'Baingan Bharta'], d: ['Roti', 'Fish Curry', 'Shahi Paneer', 'Rice'], s: ['Pakora', 'Tea'] },
      saturday: { b: ['Puri Sabzi', 'Halwa', 'Tea'], l: ['Veg Biryani', 'Raita', 'Salad'], d: ['Roti', 'Aloo Methi', 'Dal Fry', 'Rice'], s: ['Kachori', 'Tea'] },
      sunday: { b: ['Chole Bhature', 'Lassi'], l: ['Paneer Pulao', 'Dal', 'Roti', 'Gulab Jamun'], d: ['Roti', 'Kadai Paneer', 'Rice', 'Custard'], s: ['Dhokla', 'Tea'] }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const dayName = days[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1];
      const meal = meals[dayName];

      await MessMenu.create({
        date: currentDate,
        day: dayName,
        breakfast: meal.b,
        lunch: meal.l,
        dinner: meal.d,
        snacks: meal.s,
        isHoliday: false,
        isSpecial: dayName === 'sunday',
        specialNote: dayName === 'sunday' ? 'Sunday Feast' : ''
      });
    }

    console.log('Seeding complaints...');
    const students = await User.find({ role: 'student' });
    const complaintCategories = ['water', 'electricity', 'internet', 'cleaning', 'furniture', 'security', 'others'];
    const complaintPriorities = ['low', 'medium', 'high', 'critical'];

    const sampleComplaints = [
      { title: 'Water leakage in bathroom', desc: 'The tap is leaking continuously.', cat: 'water', pri: 'high' },
      { title: 'Internet speed very slow', desc: 'Not getting more than 1Mbps.', cat: 'internet', pri: 'medium' },
      { title: 'Fan not working', desc: 'The fan in room makes noise and stops.', cat: 'electricity', pri: 'medium' },
      { title: 'Room cleaning requested', desc: 'The corridor needs cleaning.', cat: 'cleaning', pri: 'low' },
      { title: 'Broken study chair leg', desc: 'One leg of the study chair is broken.', cat: 'furniture', pri: 'low' }
    ];

    for (let i = 0; i < 10; i++) {
      const student = students[i % students.length];
      const sample = sampleComplaints[i % sampleComplaints.length];
      const statusList = ['pending', 'assigned', 'in-progress', 'resolved'];
      const status = statusList[i % statusList.length];

      const complaint = await Complaint.create({
        title: sample.title,
        description: sample.desc,
        category: sample.cat,
        priority: sample.pri,
        status,
        student: student._id,
        assignedTo: status !== 'pending' ? createdStaff[i % createdStaff.length]._id : undefined,
        timeline: [
          { status: 'pending', notes: 'Complaint submitted.', updatedBy: student._id }
        ]
      });

      if (status !== 'pending') {
        complaint.timeline.push({
          status: 'assigned',
          notes: 'Assigned to maintenance team.',
          updatedBy: admin._id
        });
      }

      if (status === 'in-progress') {
        complaint.timeline.push({
          status: 'in-progress',
          notes: 'Work started.',
          updatedBy: complaint.assignedTo
        });
      }

      if (status === 'resolved') {
        complaint.timeline.push({
          status: 'resolved',
          notes: 'Issue fixed completely.',
          updatedBy: complaint.assignedTo
        });
        complaint.resolutionNotes = 'Fixed the issue.';
        await complaint.save();

        await Staff.findOneAndUpdate(
          { user: complaint.assignedTo },
          { $inc: { completedCount: 1 } }
        );
      }

      await complaint.save();
    }

    console.log('Seeding attendance...');
    const attendanceToday = new Date();
    attendanceToday.setHours(0, 0, 0, 0);
    // Seed attendance for first 12 students
    for (let i = 0; i < 12; i++) {
      await Attendance.create({
        student: students[i]._id,
        date: attendanceToday,
        status: 'present'
      });
    }

    console.log('Seeding gate passes...');
    await GatePass.create({
      student: students[0]._id,
      reason: 'Family wedding function in hometown.',
      departureDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      arrivalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'pending'
    });

    await GatePass.create({
      student: students[1]._id,
      reason: 'Medical appointment with dentist.',
      departureDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      arrivalDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'approved',
      approvedBy: admin._id
    });

    await GatePass.create({
      student: students[2]._id,
      reason: 'Weekend visit to cousins house.',
      departureDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      arrivalDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'rejected',
      approvedBy: admin._id,
      rejectionReason: 'Curfew dates overlapping with upcoming semester exams.'
    });

    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error);
    process.exit(1);
  }
};

seedDatabase();