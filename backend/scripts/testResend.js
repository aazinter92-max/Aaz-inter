require('dotenv').config();
const { Resend } = require('resend');

const testResend = async () => {
  console.log('🧪 Testing Resend Email API...\n');
  
  // Check API key
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in .env file!');
    process.exit(1);
  }
  
  console.log('✅ API Key found:', process.env.RESEND_API_KEY.substring(0, 10) + '...');
  
  // Initialize Resend
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // Prompt for test email
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Enter your email address to receive test email: ', async (email) => {
    console.log(`\n📧 Sending test email to: ${email}\n`);
    
    try {
      const { data, error } = await resend.emails.send({
        from: 'AAZ International <onboarding@resend.dev>',
        to: [email],
        subject: 'Test Email from AAZ International',
        html: `
          <h1>✅ Resend API is Working!</h1>
          <p>This is a test email from your AAZ International backend.</p>
          <p>If you received this, your Resend integration is configured correctly.</p>
          <hr>
          <p><small>Sent from: AAZ International Backend</small></p>
        `
      });
      
      if (error) {
        console.error('❌ Resend Error:', error);
        rl.close();
        process.exit(1);
      }
      
      console.log('✅ Email sent successfully!');
      console.log('📬 Email ID:', data.id);
      console.log('\n🎉 Check your inbox!');
      
      rl.close();
      process.exit(0);
    } catch (err) {
      console.error('❌ Error:', err.message);
      rl.close();
      process.exit(1);
    }
  });
};

testResend();
