import 'dotenv/config';
import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 25);

export const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '127.0.0.1',
  port: smtpPort,
  secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
  auth: (process.env.SMTP_USER && process.env.SMTP_PASS) ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
  tls: {
    rejectUnauthorized: false, // Accepts self-signed TLS certificates from VPS Host / Postfix
  },
});


emailTransporter.verify((error, success) => {
  if (error) {
    console.error("❌ [SMTP ERROR]:", error.message || error);
  } else {
    console.log("✅ [SMTP READY]: Transporter is ready to send emails");
  }
});