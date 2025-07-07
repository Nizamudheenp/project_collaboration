const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

const sendInvitationEmail = async ({ to, invitedBy, teamName, inviteId }) => {
  const link = `https://localhost:5173`; 
  const mailOptions = {
    from: `"Collabix" <${process.env.EMAIL_USER}>`,
    to,
    subject: `You're invited to join team "${teamName}" on Collabix`,
    html: `
      <p>Hello,</p>
      <p><strong>${invitedBy}</strong> has invited you to join the team <strong>${teamName}</strong> on Collabix.</p>
      <p>Please <a href="${link}">click here</a> to accept or reject the invitation.</p>
      <p>If you don't recognize this, you can safely ignore it.</p>
      <br/>
      <p>– The Collabix Team</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendInvitationEmail };
