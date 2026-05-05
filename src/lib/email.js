
const nodemailer = require('nodemailer');

export async function sendEmail(to, subject, text) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials not found. Email not sent.");
        console.log(`[Mock Email] To: ${to}, Subject: ${subject}, Body: ${text}`);
        return { success: true, mock: true };
    }

    const transportConfig = process.env.SMTP_HOST ? {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
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
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"CaddAxis Support" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text
        });
        console.log("Email sent: %s", info.messageId);
        return { success: true };
    } catch (error) {
        console.error("Email send failed:", error);
        return { success: false, error: error.message };
    }
}
