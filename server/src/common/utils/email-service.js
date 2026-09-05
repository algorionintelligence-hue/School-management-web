import { emailTransporter } from "../../config/email.config"; 

export async function sendVerificationEmail({
  to,
  firstName,
  verificationToken,
}) {
  const verificationUrl = new URL(
    "/auth/verify-email",
    process.env.CLIENT_URL
  );

  verificationUrl.searchParams.set("token", verificationToken);

  const info = await emailTransporter.sendMail({
    from: process.env.SMTP_FROM,
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