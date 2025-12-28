import { StaffType } from "./validation";

export const resolveRole = (
  staffData: Pick<StaffType, "staffCategory" | "staffType">
) => {
  if (staffData.staffType === "Teaching") {
    return "teaching_staff";
  } else if (
    staffData.staffType === "Non_Teaching" &&
    staffData.staffCategory === "Professional"
  ) {
    return "admin_staff";
  } else if (
    staffData.staffType === "Non_Teaching" &&
    staffData.staffCategory === "Non_Professional"
  ) {
    return "support_staff";
  } else {
    return "staff";
  }
};
