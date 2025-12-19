import { CONSTANTS } from "@/utils/generateStudentIndex";

export const generateRoomCode = (
  houseName: string,
  sequenceNumber: number
): string => {
  const characters = houseName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  const sequence = sequenceNumber
    .toString()
    .padStart(CONSTANTS.SEQUENCE_LENGTH, "0");

  return `${characters}${sequence}`;
};
