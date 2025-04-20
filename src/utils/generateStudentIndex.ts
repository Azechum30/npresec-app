export const departments = [
  "General Arts",
  "Technical",
  "Home Economics",
  "Visual Arts",
  "Agriculture",
] as const;

export const gradelevels = ["Year_One", "Year_Two", "Year_Three"] as const;

export type Department = (typeof departments)[number];

export const CONSTANTS = {
  SCHOOL_CODE: "0080505",
  YEAR_LENGTH: 2,
  SEQUENCE_LENGTH: 3,
} as const;

const DEPARTMENT_CODES: Record<Department, string> = {
  "General Arts": "01",
  "Home Economics": "02",
  Agriculture: "03",
  Technical: "04",
  "Visual Arts": "05",
};

interface GenerateIndexOptions {
  department: Department;
  admissionYear: number;
  sequenceNumber: number;
}

export const generateStudentIndex = ({
  department,
  admissionYear,
  sequenceNumber,
}: GenerateIndexOptions) => {
  const yearCode = admissionYear.toString().slice(-2);

  const deptCode = DEPARTMENT_CODES[department];
  const sequence = sequenceNumber
    .toString()
    .padStart(CONSTANTS.SEQUENCE_LENGTH, "0");

  return `${CONSTANTS.SCHOOL_CODE}${yearCode}${deptCode}${sequence}`;
};
