import { StudentResponseType } from "@/lib/types";
import { DateFormatType } from "@/lib/validation";
import { formatOrEmpty } from "@/utils/format-or-empty";

export const studentTransformer =
  (dateFormat: DateFormatType) => (student: StudentResponseType) => ({
    "Student ID": student.studentNumber,
    Name: `${student.lastName} ${student.firstName}`,
    Gender: student.gender,
    BirthDate: formatOrEmpty(student.birthDate, dateFormat),
    Class: student.currentClass?.name ?? "N/A",
    department: student.department?.name ?? "N/A",
    Batch: new Date(student.dateEnrolled).getFullYear(),
    "Current Level": student.currentLevel.split("_").join(" "),
  });
