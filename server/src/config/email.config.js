import 'dotenv/config';
import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 587);

export const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: false || smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

emailTransporter.verify((error, success) => {
  if (error) {
    console.error("❌ [SMTP ERROR]:", error.message || error);
  } else {
    console.log("✅ [SMTP READY]: Transporter is ready to send emails");
  }
});