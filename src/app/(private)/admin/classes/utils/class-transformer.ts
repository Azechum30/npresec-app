import { ClassesResponseType } from "@/lib/types";

export const classTransformer = (classItem: ClassesResponseType) => ({
  "Class Code": classItem.code,
  "Class Name": classItem.name,
  Department: classItem.department?.name ?? "N/A",
  Level: classItem.level.split("_").join(" "),
  Courses: classItem.courses?.map((cls) => cls.title).join(", "),
});
