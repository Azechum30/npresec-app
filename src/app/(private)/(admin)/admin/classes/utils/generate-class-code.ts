import { CONSTANTS } from "@/utils/generateStudentIndex";

export const generateUniqueClassCode = (
  admissionYear: number,
  stream: string,
  sequence: number
): string => {
  const sequenceNumber = sequence
    .toString()
    .padStart(CONSTANTS.SEQUENCE_LENGTH, "0");

  const last2Digits = admissionYear.toString().slice(-2);

  const code = `C${stream.charAt(0).toUpperCase()}${last2Digits}${sequenceNumber}`;
  return code;
};
