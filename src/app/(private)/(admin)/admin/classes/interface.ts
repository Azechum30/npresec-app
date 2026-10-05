import type { ClassesResponseType } from "@/lib/types";
import type { BulkClassesType, ClassesType } from "@/lib/validation";

export interface IClassStream {
  createClass: (data: ClassesType) => Promise<ClassesResponseType>;
  listClasses: () => Promise<ClassesResponseType[]>;
  getClass: (classId: string) => Promise<ClassesResponseType>;
  updateClass: (
    classId: string,
    data: ClassesType,
  ) => Promise<ClassesResponseType>;

  deleteClass: (classId: string) => Promise<void>;
  deleteClasses: (classIds: string[]) => Promise<{ count: number }>;
  updateClassEnrollment: (
    classId: string,
    enrollmentCount: number,
  ) => Promise<ClassesResponseType>;

  bulkCreateClasses: (data: BulkClassesType) => Promise<{ count: number }>;
}
