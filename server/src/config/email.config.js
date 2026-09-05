import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 587);

export const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});