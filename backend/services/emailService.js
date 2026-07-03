const nodemailer = require('nodemailer');

let transporter;

try {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
} catch (error) {
  console.warn('Nodemailer configuration error. Email service offline.', error.message);
}

const sendEmail = async ({ to, subject, html }) => {
  if (!transporter || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(`Email mock sent to ${to}: Subject: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"Smart Hostel" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Failed to send email:', error.message);
  }
};

const sendComplaintStatusEmail = async (complaint, student) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Complaint Update</h2>
      <p>Hello ${student.name},</p>
      <p>Your complaint "<strong>${complaint.title}</strong>" status has been updated to <strong>${complaint.status}</strong>.</p>
      ${complaint.resolutionNotes ? `<p><strong>Notes:</strong> ${complaint.resolutionNotes}</p>` : ''}
      <br/>
      <p>Regards,<br/>Smart Hostel Management Team</p>
    </div>
  `;
  await sendEmail({ to: student.email, subject: `Complaint Status Update: ${complaint.status}`, html });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Password Reset Request</h2>
      <p>Hello ${user.name},</p>
      <p>Please click on the link below to reset your password. This link is valid for 10 minutes.</p>
      <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      <p>Or copy this link: ${resetUrl}</p>
      <br/>
      <p>Regards,<br/>Smart Hostel Management Team</p>
    </div>
  `;
  await sendEmail({ to: user.email, subject: 'Smart Hostel - Password Reset Request', html });
};

const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Welcome to Smart Hostel</h2>
      <p>Hello ${user.name},</p>
      <p>Your account has been created successfully. Welcome to the hostel community!</p>
      <p>Login URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login</p>
      <p>Username: ${user.email}</p>
      <br/>
      <p>Regards,<br/>Smart Hostel Management Team</p>
    </div>
  `;
  await sendEmail({ to: user.email, subject: 'Welcome to Smart Hostel', html });
};

module.exports = {
  sendEmail,
  sendComplaintStatusEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};