
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log("Testing Email Configuration...");
    console.log("SMTP_USER:", process.env.SMTP_USER || "Not Set");
    console.log("SMTP_HOST:", process.env.SMTP_HOST || "Defaulting to Gmail");

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("❌ ERROR: SMTP_USER or SMTP_PASS not found in .env");
        console.log("Please add them to your .env file.");
        return;
    }

    const transportConfig = process.env.SMTP_HOST ? {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    } : {
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    };

    const transporter = nodemailer.createTransport(transportConfig);

    try {
        console.log("Attempting to send email to:", process.env.SMTP_USER);
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Test Script" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to self
            subject: "CaddAxis Email Test",
            text: "If you are reading this, your email configuration is working perfectly! 🚀"
        });
        console.log("✅ SUCCESS: Email sent!");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("❌ FAILURE: Could not send email.");
        console.error(error);
    }
}

testEmail();
