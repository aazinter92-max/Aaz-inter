const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: {
      user: 'resend',
      pass: process.env.SMTP_PASSWORD || process.env.RESEND_API_KEY
    }
  });

  const message = {
    from: process.env.FROM_EMAIL || 'AAZ International <onboarding@resend.dev>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent via Resend: %s', info.messageId);
};

module.exports = sendEmail;
