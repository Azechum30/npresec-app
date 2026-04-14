import { PlacementListType } from "@/lib/types";
import { DateFormatType } from "@/lib/validation";
import { formatOrEmpty } from "@/utils/format-or-empty";

export const admittedListTransformer =
  (dateFormat: DateFormatType) => (admittedStudent: PlacementListType) => ({
    "INDEX NUMBER": admittedStudent.jhsIndexNumber,
    "ENROLLMENT CODE": admittedStudent.enrollmentCode ?? "N/A",
    FULLNAME: admittedStudent.lastName + " " + admittedStudent.otherNames,
    GENDER: admittedStudent.gender,
    CONTACT: admittedStudent.guardianPhoneNumber,
    "DATE OF BIRTH": formatOrEmpty(admittedStudent.birthDate, dateFormat),
    COURSE: admittedStudent.programme,
  });
