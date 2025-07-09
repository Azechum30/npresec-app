import { DepartmentResponseType } from "@/lib/types";
import moment from "moment";

export const departmentTransformer = (department: DepartmentResponseType) => ({
  "Department Code": department.code,
  "Department Name": department.name,
  "Created Date": moment(department.createdAt).format("MM/DD/YYYY"),
  "Head of Department": `${department.head?.lastName} ${department.head?.firstName}`,
  Classes: department.classes?.map((cls) => cls.name).join(", "),
});
