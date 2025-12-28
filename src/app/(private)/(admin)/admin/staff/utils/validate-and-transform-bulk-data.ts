import { BulkCreateStaffType, StaffEditType } from "@/lib/validation";

export const validateAndTransformBulkData = ({ data }: BulkCreateStaffType) => {
  const transformedData = data.map((item) => ({
    ...item,
    email: item.email.trim(),
    username: item.username.trim(),
    employeeId: item.employeeId.trim(),
    rgNumber: item.rgNumber?.trim() || null,
    ghcardNumber: item.ghcardNumber?.trim() || null,
    licencedNumber: item.licencedNumber?.trim() || null,
    ssnitNumber: item.ssnitNumber?.trim() || null,
    birthDate: new Date(item.birthDate),
    dateOfFirstAppointment: item.dateOfFirstAppointment
      ? new Date(item.dateOfFirstAppointment)
      : undefined,
    classes:
      typeof item.classes === "string"
        ? item.classes
            .split(",")
            .map((cl) => cl.trim())
            .filter(Boolean)
        : item.classes,
    courses:
      typeof item.courses === "string"
        ? item.courses
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : item.courses,
  }));

  return transformedData;
};
