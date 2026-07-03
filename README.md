# Smart Hostel Management System

A production-ready, full-stack **Smart Hostel Management System** built using the **MERN Stack** (MongoDB, Express, React, Node.js). This system handles hostel admissions, room allocation, complaint registration, real-time maintenance assignment, mess menus, and analytics.

## Technology Stack

### Frontend
- **React.js**: Modern single-page app architecture.
- **Vite**: Rapid hot module replacement bundling.
- **React Router v6**: Protected role-based declarative routes.
- **Tailwind CSS**: Sleek dashboard layouts with light/dark theme toggle support.
- **Recharts**: Responsive SVG charts representing occupancy and complaint statistics.
- **React Hook Form**: Form validations and input helpers.
- **Socket.IO-Client**: Live WebSocket updates and notifications.

### Backend
- **Node.js & Express**: Secure REST APIs.
- **MongoDB & Mongoose**: Object modeling with indexing, relationships, and validation.
- **JWT (JSON Web Token)**: Hashed authentication flow with token refresh support.
- **Bcrypt.js**: Cryptographic password hashing.
- **Multer**: Multi-image file uploads for complaint registry.
- **Nodemailer**: Email alerts for complaint status tracking.
- **Socket.IO**: Real-time websocket server.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or MongoDB Atlas URI

### Installation & Setup

1. **Clone the repository and explore directories:**
   - `backend/` Contains database configurations, routes, and services.
   - `frontend/` Contains React dashboard pages, charts, layouts, and services.

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` folder (or copy `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hostel_management
   JWT_SECRET=hostel_jwt_secret_2024
   JWT_REFRESH_SECRET=hostel_jwt_refresh_secret_2024
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. **Seeding the Database:**
   Populate the database with dummy students, blocks (A-D), rooms, mess menus, and sample complaints:
   ```bash
   npm run seed
   ```

4. **Start the Backend Server:**
   ```bash
   npm run dev
   ```

5. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

6. **Open Dashboard:**
   Visit [http://localhost:5173](http://localhost:5173).

---

## Seed Accounts (For Testing)

| Role | Username (Email) | Password | Details |
|------|------------------|----------|---------|
| **Admin** | `admin@hostel.com` | `admin123` | Control room allocations, mess schedules, complaints, and student records |
| **Student** | `student1@hostel.com` | `student123` | View room details, file complaints, check mess menus |
| **Staff (Plumber)** | `plumber@hostel.com` | `staff123` | View assigned plumbing complaints, update progress, resolve with completion image |
| **Staff (Electrician)** | `electrician@hostel.com` | `staff123` | View electrician tasks |

---

## Key Features

- **Automated Room Allocation**: Smart logic balances occupancy across Blocks A, B, C, and D, matching single/double/triple capacity rules.
- **Complaint Management Timeline**: Complete history logs for every status transition (Pending → Assigned → In-Progress → Resolved).
- **Responsive Dark Mode**: Smooth HSL tailored color schemes togglable in the top navigation bar.
- **CSV Data Portal**: Admin can bulk upload student CSVs or export active registers instantly.
- **Printable Reports**: Generates professional print-ready clean CSS summaries of occupancy rates.
