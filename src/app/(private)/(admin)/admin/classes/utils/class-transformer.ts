import type { ClassesResponseType } from "@/lib/types";
import type { DateFormatType } from "@/lib/validation";
import { formatOrEmpty } from "@/utils/format-or-empty";

export const classTransformer =
  (dataFormat: DateFormatType) => (classItem: ClassesResponseType) => ({
    "Class Code": classItem.code,
    "Class Name": classItem.name,
    Programme: classItem.department?.name ?? "N/A",
    "Course Count": classItem._count.courses,
    Quota: classItem.maxCapacity ?? 0,
    Allocated: classItem.currentEnrollment ?? 0,
    Vacancy: classItem.maxCapacity
      ? classItem.maxCapacity - classItem.currentEnrollment
      : 0,
    Level: classItem.level.split("_").join(" "),
    CreateAt: formatOrEmpty(classItem.createdAt, dataFormat),
    Courses: classItem.courses?.map((cls) => cls.title).join(", "),
  });
