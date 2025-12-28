import { generatePassword } from "@/lib/generatePassword";
import { BulkCreateStaffType, StaffType } from "@/lib/validation";

type Department = { id: string; name: string };
type Class = { id: string; name: string };
type Course = { id: string; title: string };

export const transformStaffData = (
  data: BulkCreateStaffType["data"],
  departments: Department[],
  classes: Class[],
  courses: Course[]
) => {
  const departmentMap = new Map(departments.map((d) => [d.name, d.id]));
  const classMap = new Map(classes.map((cl) => [cl.name, cl.id]));
  const courseMap = new Map(courses.map((c) => [c.title, c.id]));

  const missingDepartments = data
    .map((d) => d.departmentId)
    .filter((name) => name && !departmentMap.has(name));
  const missingClasses = data
    .flatMap((d) => d.classes || [])
    .filter((title) => !classMap.has(title));
  const missingCourses = data
    .flatMap((d) => d.courses || [])
    .filter((name) => !courseMap.has(name));

  const dataWithIds = data.map((item) => ({
    ...item,
    classes:
      typeof item.classes === "string"
        ? classMap.get(item.classes)
        : item.classes?.map((cl) => classMap.get(cl)).filter(Boolean),
    departmentId: item.departmentId && departmentMap.get(item.departmentId),
    courses:
      typeof item.courses === "string"
        ? courseMap.get(item.courses)
        : item.courses?.map((c) => courseMap.get(c)),
  }));

  return { dataWithIds, missingDepartments, missingClasses, missingCourses };
};

export const transformAndValidateStaffData = (data: StaffType) => {
  const transformedData = {
    ...data,
    employeeId: data.employeeId.trim(),
    rgNumber: data.rgNumber?.trim() || null,
    ghcardNumber: data.ghcardNumber?.trim() || null,
    licencedNumber: data.licencedNumber?.trim() || null,
    ssnitNumber: data.ssnitNumber?.trim() || null,
    dateOfFirstAppointment: data.dateOfFirstAppointment
      ? new Date(data.dateOfFirstAppointment)
      : undefined,
    password: generatePassword(),
    imageFile: data.imageFile ? (data.imageFile as File) : undefined,
  };

  return transformedData;
};
