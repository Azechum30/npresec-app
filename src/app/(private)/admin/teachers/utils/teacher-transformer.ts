import { TeacherResponseType } from "@/lib/types";
import { DateFormatType } from "@/lib/validation";
import { formatDate } from "@/lib/format-date";

const formatOrEmpty = (
  value: Date | string | null,
  dateFormat: DateFormatType
) => (value ? formatDate(value, dateFormat) : "");

export const createTeacherTransformer =
  (dateFormat: DateFormatType) => (teacher: TeacherResponseType) => ({
    "Staff ID": teacher.employeeId,
    Name: `${teacher.lastName} ${teacher.firstName} ${teacher.middleName}`,
    Gender: teacher.gender,
    "Marital Status": teacher.maritalStatus,
    "Date of Birth": formatOrEmpty(teacher.birthDate, dateFormat),
    "Academic Qualification": teacher.academicQual,
    "Phone Number": teacher.phone,
    Email: teacher.user?.email as string,
    "Ghana Card Number": teacher.ghcardNumber,
    "Registered Number": teacher.rgNumber,
    "SSNIT Number": teacher.ssnitNumber,
    "Current Rank": teacher.rank,
    "Date of First Appointment": formatOrEmpty(
      teacher.dateOfFirstAppointment,
      dateFormat
    ),
  });
