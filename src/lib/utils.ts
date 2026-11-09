/** biome-ignore-all assist/source/organizeImports:reason */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a secure, URL-safe cryptograhic hash for a student admission letter.
 * @param {string} admissionId, the Unique ID of the student admission record.
 * @returns {string} A URL-safe base64 encoded hash signature.
 */
