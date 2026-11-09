import crypto from "node:crypto";
import { env } from "./server-only-actions/validate-env";
export const generateAdmissionLetterHash = (admissionId: string): string => {
  return crypto
    .createHmac("sha256", env.JWT_SECRET)
    .update(admissionId)
    .digest("base64url");
};

/**
 * Validates if the incoming scanned URL parameter matches our server signature.
 * @param {string} admissionId - The ID received from the scanned URL.
 * @param {string} token - The hash string received from the scanned URL.
 * @returns {boolean} True if the document is authentic; false if tampered.
 */

export const verifyAdmissionLetterHash = (
  admissionId: string,
  token: string,
): boolean => {
  const expectedHash = generateAdmissionLetterHash(admissionId);
  const expectedBuffer = Buffer.from(expectedHash);
  const incomingBuffer = Buffer.from(token);

  if (expectedBuffer.length !== incomingBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, incomingBuffer);
};
