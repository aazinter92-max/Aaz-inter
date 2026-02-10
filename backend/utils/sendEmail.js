const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email using Resend API
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @returns {Promise<Object>} - Resend response
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const { data, error } = await resend.emails.send({
      // TEMPORARY: Using default Resend email until aaz-international.com DNS is verified
      // TODO: Switch to 'AAZ International <noreply@aaz-international.com>' after domain verification
      from: 'AAZ International <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('❌ Resend Email Error:', error);
      throw error;
    }

    console.log('✅ Email sent successfully via Resend:', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('❌ Failed to send email via Resend:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
