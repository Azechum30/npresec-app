import { ClassesResponseType } from "@/lib/types";
import { DateFormatType } from "@/lib/validation";
import { formatOrEmpty } from "@/utils/format-or-empty";

export const classTransformer =
  (dataFormat: DateFormatType) => (classItem: ClassesResponseType) => ({
    "Class Code": classItem.code,
    "Class Name": classItem.name,
    "Laerning Area": classItem.department?.name ?? "N/A",
    Level: classItem.level.split("_").join(" "),
    CreateAt: formatOrEmpty(classItem.createdAt, dataFormat),
    Courses: classItem.courses?.map((cls) => cls.title).join(", "),
  });
