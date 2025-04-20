import { StudentResponseType } from "@/lib/types";
import moment from "moment";

export const studentTransformer = (student: StudentResponseType) => ({
  "Student ID": student.studentNumber,
  Name: `${student.lastName} ${student.firstName}`,
  Gender: student.gender,
  Age: moment(student.birthDate).format("MM/DD/YYYY"),
  Class: student.currentClass?.name ?? "N/A",
  department: student.department?.name ?? "N/A",
  Batch: new Date(student.dateEnrolled).getFullYear(),
  "Current Level": student.currentLevel.split("_").join(" "),
});
