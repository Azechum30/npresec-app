import { CourseResponseType } from "@/lib/types";
import { DateFormatType } from "@/lib/validation";
import { formatOrEmpty } from "@/utils/format-or-empty";
import moment from "moment";

export const coursesTransformer =
  (dateFormat: DateFormatType) => (course: CourseResponseType) => ({
    "Course Code": course.code,
    "Course Title": course.title,
    Credits: course.credits,
    Departments: course.departments.map((dept) => dept.name).join(", "),
    Classes: course.classes.map((cls) => cls.name).join(", "),
    "Created Date": formatOrEmpty(course.createdAt, dateFormat),
    staffs: course.staff
      .map(
        (staff) => `${staff.lastName} ${staff.firstName} ${staff.middleName}`
      )
      .join(", "),
  });
