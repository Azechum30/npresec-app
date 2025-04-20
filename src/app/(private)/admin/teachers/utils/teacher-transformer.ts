import { TeacherResponseType } from "@/lib/types";
import moment from "moment";

export const TeacherTransformer = (teacher: TeacherResponseType) => ({
  "Staff ID": teacher.employeeId,
  Name: `${teacher.lastName} ${teacher.firstName} ${teacher.middleName}`,
  Gender: teacher.gender,
  "Marital Status": teacher.maritalStatus,
  "Date of Birth": moment(teacher.birthDate).format("MM/DD/YYYY"),
  "Academic Qualification": teacher.academicQual,
  "Phone Number": teacher.phone,
  Email: teacher.user?.email as string,
  "Ghana Card Number": teacher.ghcardNumber,
  "Registered Number": teacher.rgNumber,
  "SSNIT Number": teacher.ssnitNumber,
  "Current Rank": teacher.rank,
  "Date of First Appointment": moment(teacher.dateOfFirstAppointment).format(
    "MM/DD/YYYY"
  ),
});
