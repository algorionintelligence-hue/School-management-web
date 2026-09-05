import { emailTransporter } from "../../config/email.config.js"; 

export async function sendVerificationEmail({
  to,
  firstName,
  verificationToken,
}) {
  const clientBaseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const verificationUrl = new URL(
    "/auth/verify-email",
    clientBaseUrl
  );

  verificationUrl.searchParams.set("token", verificationToken);

  const info = await emailTransporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@school.com",
    to,
    subject: "Verify your email address",
    text: `Hello ${firstName || "there"},

Please verify your email address by opening this link:

${verificationUrl.toString()}

This link expires in 24 hours.

If you did not create this account, you can safely ignore this email.
    `.trim(),
    html: `
    <p>Hello ${firstName || "there"},</p>

    <p>
        Please verify your email address by clicking the button below:
    </p>

    <p>
        <a
        href="${verificationUrl.toString()}"
        style="
            display: inline-block;
            padding: 12px 18px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 6px;
        "
        >
        Verify email address
        </a>
    </p>

    <p>This link expires in 24 hours.</p>

    <p>
        If you did not create this account, you can safely ignore this email.
    </p>`,
  });

  return info;
}

export async function sendPasswordResetEmail({
  to,
  firstName,
  resetToken,
}) {
  const clientBaseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const resetUrl = new URL(
    "/auth/reset-password",
    clientBaseUrl
  );

  resetUrl.searchParams.set("token", resetToken);

  const info = await emailTransporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@school.com",
    to,
    subject: "Reset your password",
    text: `Hello ${firstName || "there"},

You requested a password reset. Please click the link below to set a new password:

${resetUrl.toString()}

This link expires in 1 hour.

If you did not request a password reset, please ignore this email.
    `.trim(),
    html: `
    <p>Hello ${firstName || "there"},</p>

    <p>You requested a password reset. Please click the button below to set a new password:</p>

    <p>
        <a
        href="${resetUrl.toString()}"
        style="
            display: inline-block;
            padding: 12px 18px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 6px;
        "
        >
        Reset Password
        </a>
    </p>

    <p>This link expires in 1 hour.</p>

    <p>If you did not request a password reset, please ignore this email.</p>`,
  });

  return info;
}