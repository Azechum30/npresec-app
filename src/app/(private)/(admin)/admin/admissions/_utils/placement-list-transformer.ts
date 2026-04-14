import { PlacementListType } from "@/lib/types";
import { DateFormatType } from "@/lib/validation";
import { formatOrEmpty } from "@/utils/format-or-empty";

export const placementListTransformer =
  (dateFormat: DateFormatType) => (placement: PlacementListType) => ({
    "INDEX NUMBER": placement.jhsIndexNumber,
    FULLNAME: placement.lastName + " " + placement.otherNames,
    GENDER: placement.gender,
    CONTACT: placement.guardianPhoneNumber,
    "DATE OF BIRTH": formatOrEmpty(placement.birthDate, dateFormat),
    COURSE: placement.programme,
    STATUS: placement.isAcceptancePaid ? "PAID" : "NOT PAID",
  });
