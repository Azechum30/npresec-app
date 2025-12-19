import { DepartmentResponseType } from "@/lib/types";
import { DateFormatType } from "@/lib/validation";
import { formatOrEmpty } from "@/utils/format-or-empty";

export const departmentTransformer =
  (dateFormat: DateFormatType) => (department: DepartmentResponseType) => ({
    "Department Code": department.code,
    "Department Name": department.name,
    "Created Date": formatOrEmpty(department.createdAt, dateFormat),
    "Head of Department": department.head
      ? department.head.firstName + " " + department.head.lastName
      : "",
    Classes: department.classes?.map((cls) => cls.name).join(", "),
  });
