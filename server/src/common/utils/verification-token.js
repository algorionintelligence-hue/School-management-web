import crypto from "node:crypto";
export function generateVerificationToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return {
    rawToken,
    tokenHash,
  };
}

export function hashVerificationToken(rawToken) {
  return crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
}

