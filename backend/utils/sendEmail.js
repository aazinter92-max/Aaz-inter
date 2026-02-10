const nodemailer = require('nodemailer');

/**
 * Send email using Gmail SMTP (Free method - sends to everyone)
 * @param {Object} options
 * @param {string} options.email - Recipient
 * @param {string} options.subject - Subject
 * @param {string} options.html - HTML content
 */
const sendEmail = async (options) => {
  try {
    // Check required variables
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      throw new Error('SMTP credentials missing. Please check SMTP_EMAIL and SMTP_PASSWORD in .env');
    }

    // Create transporter (Use Port 465 for SSL - more reliable on Railway)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // Fixes some certificate issues on cloud servers
      }
    });

    // Verify connection config
    await transporter.verify();
    console.log('✅ SMTP Connection verified');

    const message = {
      from: process.env.FROM_EMAIL || `AAZ International <${process.env.SMTP_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    console.log(`📧 Sending email to: ${options.email}`);
    
    const info = await transporter.sendMail(message);
    console.log('✅ Email sent successfully! Message ID:', info.messageId);
    return info;

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    // Log full error for debugging
    if (error.response) console.error('SMTP Response:', error.response);
    
    // Don't throw - allow registration to proceed
  }
};

module.exports = sendEmail;
