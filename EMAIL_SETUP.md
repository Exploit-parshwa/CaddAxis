
# 📧 CaddAxis Email Configuration Instructions

To enable "Forgot Password" and other email features, you must configure SMTP in your `.env` file.
We recommend using Gmail for immediate setup.

## Option 1: Gmail (Fastest)

1.  **Go to Google Account Security**: https://myaccount.google.com/security
2.  **Enable 2-Step Verification** (if not already enabled).
3.  **Search for "App Passwords"** in the top search bar (or go to https://myaccount.google.com/apppasswords).
4.  **Create a new App Password**:
    *   App name: `CaddAxis`
    *   Click "Create".
5.  **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`).
6.  **Add to your `.env` file**:

```env
SMTP_USER=your.actual.email@gmail.com
SMTP_PASS=paste-16-char-password-here
```

(Remove spaces from the password if you want, though generally it works with/without).

## Option 2: Custom SMTP (Hostinger, GoDaddy, AWS, etc.)

If you have a domain email (e.g., `admin@caddaxis.com`), use these settings:

```env
SMTP_HOST=smtp.hostinger.com  # or your provider
SMTP_PORT=465                 # or 587
SMTP_SECURE=true              # true for 465, false for 587
SMTP_USER=admin@caddaxis.com
SMTP_PASS=your-email-password
SMTP_FROM="CaddAxis Admin <admin@caddaxis.com>"
```

---

## 🧪 How to Test

After setting up `.env`, run this command in your terminal:

```bash
node scripts/test-email.js
```

If it says "✅ SUCCESS", you are ready for deployment!
