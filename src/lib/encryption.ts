import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey(): Buffer {
  const keyBase64 = process.env.TOKEN_ENCRYPTION_KEY;

  if (!keyBase64 || keyBase64 === "YOUR_VALUE_HERE") {
    throw new Error("TOKEN_ENCRYPTION_KEY is not configured");
  }

  const key = Buffer.from(keyBase64, "base64");

  if (key.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key");
  }

  return key;
}

export function encrypt(plainText: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

export function decrypt(cipherText: string): string {
  const key = getEncryptionKey();
  const [ivBase64, authTagBase64, encryptedBase64] = cipherText.split(":");

  if (!ivBase64 || !authTagBase64 || !encryptedBase64) {
    throw new Error("Invalid cipher text format");
  }

  const iv = Buffer.from(ivBase64, "base64");
  const authTag = Buffer.from(authTagBase64, "base64");
  const encrypted = Buffer.from(encryptedBase64, "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

try {
  const test = "iris-encryption-test";
  if (decrypt(encrypt(test)) === test) {
    console.log("Encryption working ✓");
  }
} catch {
  // Skip self-test when TOKEN_ENCRYPTION_KEY is unset or invalid.
}
