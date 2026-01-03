const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const sendEmail = async (to, subject, html) => {
  try {
    if (!resend) {
      console.warn('Email service not configured - skipping email to:', to);
      return { success: true, data: { message: 'Email service not configured' } };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@dayflow-hrms.com',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
};

const emailTemplates = {
  welcome: (firstName, employeeId) => `
    <h2>Welcome to Dayflow HRMS!</h2>
    <p>Hi ${firstName},</p>
    <p>Welcome to the team! Your employee ID is <strong>${employeeId}</strong>.</p>
    <p>You can now access the HRMS system to manage your attendance, apply for leaves, and view your profile.</p>
    <p>Best regards,<br>HR Team</p>
  `,

  leaveRequest: (employeeName, leaveType, startDate, endDate, reason) => `
    <h2>New Leave Request</h2>
    <p><strong>Employee:</strong> ${employeeName}</p>
    <p><strong>Leave Type:</strong> ${leaveType}</p>
    <p><strong>Duration:</strong> ${startDate} to ${endDate}</p>
    <p><strong>Reason:</strong> ${reason}</p>
    <p>Please review and approve/reject this request in the HRMS system.</p>
  `,

  leaveApproval: (firstName, leaveType, startDate, endDate, status, comments) => `
    <h2>Leave Request ${status}</h2>
    <p>Hi ${firstName},</p>
    <p>Your ${leaveType} leave request from ${startDate} to ${endDate} has been <strong>${status.toLowerCase()}</strong>.</p>
    ${comments ? `<p><strong>Comments:</strong> ${comments}</p>` : ''}
    <p>Best regards,<br>HR Team</p>
  `,

  passwordReset: (firstName, resetLink) => `
    <h2>Password Reset Request</h2>
    <p>Hi ${firstName},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <p><a href="${resetLink}">Reset Password</a></p>
    <p>If you didn't request this, please ignore this email.</p>
    <p>Best regards,<br>HR Team</p>
  `
};

module.exports = {
  sendEmail,
  emailTemplates
};