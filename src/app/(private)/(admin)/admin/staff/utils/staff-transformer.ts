import { StaffResponseType } from "@/lib/types";
import { DateFormatType } from "@/lib/validation";
import { formatDate } from "@/lib/format-date";

const formatOrEmpty = (
  value: Date | string | null,
  dateFormat: DateFormatType
) => (value ? formatDate(value, dateFormat) : "");

export const createStaffTransformer =
  (dateFormat: DateFormatType) => (staff: StaffResponseType) => ({
    "Staff ID": staff.employeeId,
    Name: `${staff.lastName} ${staff.firstName} ${staff.middleName}`,
    "Staff Type": staff.staffType,
    "Staff Category": staff.staffCategory,
    Gender: staff.gender,
    "Marital Status": staff.maritalStatus,
    "Date of Birth": formatOrEmpty(staff.birthDate, dateFormat),
    "Academic Qualification": staff.academicQual,
    "Phone Number": staff.phone,
    Email: staff.user?.email as string,
    "Ghana Card Number": staff.ghcardNumber,
    "Registered Number": staff.rgNumber,
    "SSNIT Number": staff.ssnitNumber,
    "Current Rank": staff.rank,
    "Date of First Appointment": formatOrEmpty(
      staff.dateOfFirstAppointment,
      dateFormat
    ),
  });
