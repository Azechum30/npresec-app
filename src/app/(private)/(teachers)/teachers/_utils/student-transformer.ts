import { StudentResponseType } from "@/lib/types";
import moment from "moment";

export const StudentTransformer = (student: StudentResponseType) => {
  return {
    "Student ID": student.studentNumber,
    "First Name": student.firstName,
    "Last Name": student.lastName,
    "Middle Name": student.middleName,
    Gender: student.gender,
    "Birth Date": moment(student.birthDate).format("MM/DD/YYYY"),
    Class: (student.currentClass?.name as string) || "N/A",
    Department: (student.department?.name as string) || "N/A",
    Batch: new Date(student.dateEnrolled).getFullYear(),
    "Current Level": student.currentLevel.split("_").join(" "),
  };
};
