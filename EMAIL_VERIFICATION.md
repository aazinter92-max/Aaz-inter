# Email Verification System - Resend API

## Overview

This application uses **Resend Email API** for reliable, production-ready email verification. No SMTP configuration required.

## Features

- ✅ **Token-based verification** - Secure, one-time use links
- ✅ **Non-blocking registration** - Users can register even if email fails
- ✅ **24-hour expiry** - Verification links expire after 24 hours
- ✅ **Professional email templates** - Branded HTML emails
- ✅ **Enforced at checkout** - Users must verify before placing orders
- ✅ **Works on Railway** - No SMTP port issues

## Setup

### 1. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add to `.env`:
   ```
   RESEND_API_KEY=re_your_actual_key_here
   FRONTEND_URL=https://aaz-international.vercel.app
   ```

### 2. Environment Variables

Required in `.env`:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
FRONTEND_URL=https://your-frontend-url.com
```

## How It Works

### Registration Flow

1. User registers with email, password, and security question
2. System creates account with `isVerified: false`
3. Verification email sent via Resend (non-blocking)
4. User clicks link in email → redirected to `/verify-email/:token`
5. Backend validates token and marks `isVerified: true`

### Verification Enforcement

- **Login**: Blocked if `isVerified === false`
- **Protected Routes**: Blocked via middleware
- **Checkout/Orders**: Blocked with user-friendly message

### Email Template

Professional HTML email with:

- AAZ International branding
- Clear call-to-action button
- Expiry warning (24 hours)
- Fallback link for manual copy-paste

## API Endpoints

### POST /api/auth/register

Creates user and sends verification email

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "securityQuestion": "What city were you born in?",
  "securityAnswer": "karachi"
}
```

**Response:**

```json
{
  "message": "Registration successful! Please check your email for verification link.",
  "email": "john@example.com",
  "isVerified": false
}
```

### GET /api/auth/verify-email/:token

Verifies email using token from link

**Response (Success):**

```json
{
  "success": true,
  "message": "Email verified successfully! You can now login."
}
```

**Response (Error):**

```json
{
  "message": "Invalid or expired verification token"
}
```

## Frontend Integration

### Verification Page

Route: `/verify-email/:token`

The page automatically:

1. Extracts token from URL
2. Calls backend verification endpoint
3. Shows success/error message
4. Redirects to login on success

### Error Handling at Checkout

If user tries to checkout without verification:

```javascript
// Backend returns 403
{
  "message": "Please verify your email address before placing an order. Check your inbox for the verification link."
}

// Frontend displays this in error banner
```

## Testing

### Local Development

1. Register a new account
2. Check backend console for verification URL:
   ```
   ✅ Verification email sent to: user@example.com
   ```
3. In production, user receives email
4. In development, copy URL from console and visit manually

### Production

1. Ensure `RESEND_API_KEY` is set in Railway
2. Ensure `FRONTEND_URL` points to Vercel deployment
3. Register and check email inbox
4. Click verification link

## Troubleshooting

### Email not received

- Check Resend dashboard for delivery status
- Verify API key is correct
- Check spam folder
- Ensure "from" email is verified in Resend (onboarding@resend.dev works by default)

### Verification link doesn't work

- Check if token expired (24 hours)
- Verify frontend route `/verify-email/:token` exists
- Check browser console for errors

### User can't login

- Ensure email is verified (`isVerified: true` in database)
- Check if verification enforcement is enabled in `authController.js` and `authMiddleware.js`

## Security Features

- ✅ Tokens are hashed (SHA-256) before storage
- ✅ One-time use (invalidated after verification)
- ✅ 24-hour expiry
- ✅ Secure random token generation (crypto.randomBytes)
- ✅ No sensitive data in URLs

## Migration from SMTP

If upgrading from Nodemailer/SMTP:

1. ✅ Nodemailer removed
2. ✅ `sendEmail.js` replaced with Resend implementation
3. ✅ All SMTP env vars can be removed
4. ✅ Email sending logic unchanged (same function signature)

## Files Modified

- `backend/utils/sendEmail.js` - Resend implementation
- `backend/controllers/authController.js` - Registration & verification
- `backend/controllers/orderController.js` - Checkout verification
- `backend/middleware/authMiddleware.js` - Protected route verification
- `frontend/src/pages/VerifyEmail.jsx` - Verification UI
- `frontend/src/context/AuthContext.jsx` - Verification API calls

## Support

For issues, check:

1. Resend dashboard for email delivery logs
2. Backend console for error messages
3. Browser console for frontend errors
4. Database to verify `isVerified` status
