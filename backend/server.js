require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { initializeSocket } = require('./services/socketService');
const errorHandler = require('./middlewares/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const roomRoutes = require('./routes/roomRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const messRoutes = require('./routes/messRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const gatePassRoutes = require('./routes/gatePassRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file hosting for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/mess', messRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/gatepasses', gatePassRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});