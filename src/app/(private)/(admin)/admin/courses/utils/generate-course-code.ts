import { CONSTANTS } from "@/utils/generateStudentIndex";

/**
 * Generates a course code based on the provided format and sequence number
 * @param sequence - The sequence number for the course
 * @param codeFormat - The format pattern (e.g., "CS{sequence}", "MATH{sequence:3}", etc.)
 * @returns The generated course code
 */
export const generateCourseCode = (
  sequence: number,
  codeFormat: string
): string => {
  // If no format provided, use a default format
  if (!codeFormat || codeFormat.trim() === "") {
    return `CRS${sequence.toString().padStart(CONSTANTS.SEQUENCE_LENGTH, "0")}`;
  }

  // Replace {sequence} or {sequence:number} placeholders
  let code = codeFormat;

  // Handle {sequence} placeholder
  if (code.includes("{sequence}")) {
    code = code.replace("{sequence}", sequence.toString());
  }

  // Handle {sequence:number} placeholder for padded sequences
  const sequenceMatch = code.match(/\{sequence:(\d+)\}/);
  if (sequenceMatch) {
    const padding = parseInt(sequenceMatch[1], 10);
    const paddedSequence = sequence.toString().padStart(padding, "0");
    code = code.replace(/\{sequence:\d+\}/, paddedSequence);
  }

  // Handle {year} placeholder for current year
  if (code.includes("{year}")) {
    const currentYear = new Date().getFullYear().toString().slice(-2); // Last 2 digits
    code = code.replace("{year}", currentYear);
  }

  // Handle {year:4} placeholder for full year
  if (code.includes("{year:4}")) {
    const currentYear = new Date().getFullYear().toString();
    code = code.replace("{year:4}", currentYear);
  }

  return code;
};

/**
 * Predefined course code formats for common use cases
 */
export const COURSE_CODE_FORMATS = {
  DEFAULT: "CRS{sequence:3}",
  SUBJECT_SEQUENCE: "{subject}{sequence:3}",
  YEAR_SEQUENCE: "C{year}{sequence:3}",
  FULL_YEAR: "C{year:4}{sequence:3}",
} as const;

/**
 * Generates a course code using predefined formats
 * @param sequence - The sequence number
 * @param format - The predefined format to use
 * @param subjectCode - Optional subject code (used with SUBJECT_SEQUENCE format)
 * @returns The generated course code
 */
export const generateCourseCodeWithFormat = (
  sequence: number,
  format: keyof typeof COURSE_CODE_FORMATS,
  subjectCode?: string
): string => {
  let codeFormat: string = COURSE_CODE_FORMATS[format];

  // Replace {subject} placeholder if provided
  if (subjectCode && codeFormat.includes("{subject}")) {
    codeFormat = codeFormat.replace("{subject}", subjectCode.toUpperCase());
  }

  return generateCourseCode(sequence, codeFormat);
};
