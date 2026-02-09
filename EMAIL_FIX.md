# 🔧 Email Verification Not Working - FIX

## Problem
Gmail is blocking login with error: "Please log in with your web browser"

## Root Cause
Your Gmail App Password is either:
1. Incorrect
2. Has spaces that need to be removed
3. 2-Step Verification not enabled

## ✅ SOLUTION - Follow These Steps:

### Step 1: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow steps to enable it

### Step 2: Generate NEW App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it: "AAZ Medical Backend"
4. Click "Generate"
5. Copy the 16-character password (NO SPACES)

### Step 3: Update .env File
Open `backend/.env` and update:
```env
SMTP_PASSWORD=your16characterpassword
```
**IMPORTANT:** Remove ALL spaces from the password!

Current password in .env: `jses tjun yets zkiv`
Should be: `jsestjunyetszkiv` (no spaces)

### Step 4: Test Email
```bash
cd backend
node test-email.js
```

Should see: "Message sent successfully"

### Step 5: Restart Backend
```bash
cd backend
npm start
```

## Alternative: Use Different Email Service

If Gmail still doesn't work, use SendGrid (FREE):

### SendGrid Setup:
1. Sign up: https://signup.sendgrid.com/
2. Create API Key
3. Update .env:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_EMAIL=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

## Quick Fix (Temporary)
If you need to test NOW without email:
- The code already auto-verifies users if SMTP fails
- Users can still register and login
- Email verification is skipped with warning

## Verify It's Working
1. Register new user
2. Check console for OTP (development mode)
3. Check email inbox
4. If email arrives = FIXED ✅

## Common Issues

### "Invalid login" error
- App password has spaces (remove them)
- 2-Step Verification not enabled
- Using regular password instead of app password

### "Connection timeout"
- Check firewall/antivirus
- Try port 465 with secure: true
- Check internet connection

### Still not working?
Use this temporary .env config:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_EMAIL=aazinter92@gmail.com
SMTP_PASSWORD=jsestjunyetszkiv
```

And update sendEmail.js line 9:
```js
secure: true, // Use SSL
```
