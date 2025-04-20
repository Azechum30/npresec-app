import { CourseResponseType } from "@/lib/types";
import moment from "moment";

export const coursesTransformer = (course: CourseResponseType) => ({
  "Course Code": course.code,
  "Course Title": course.title,
  Credits: course.credits,
  Departments: course.departments.map((dept) => dept.name).join(", "),
  Classes: course.classes.map((cls) => cls.name).join(", "),
  "Created Date": moment(course.createdAt).format("MM/DD/YYYY"),
  Teachers: course.teachers
    .map(
      (teacher) =>
        `${teacher.lastName} ${teacher.firstName} ${teacher.middleName}`
    )
    .join(", "),
});
