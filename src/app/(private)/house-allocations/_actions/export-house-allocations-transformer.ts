import { toProperCase } from "@/lib/to-proper-case";
import type { TAllocations } from "@/lib/types";

export const exportHouseAllocationsTransformer = (
  allocation: TAllocations,
) => ({
  "Student Number": allocation.student.studentNumber,
  "Full Name": `${allocation.student.lastName} ${allocation.student.firstName} ${allocation.student.middleName ?? ""}`,
  Gender: toProperCase(allocation.student.gender),
  "Current Level": toProperCase(allocation.student.currentLevel),
  "House Assigned": allocation.house.name,
  "Residential Status": allocation.status,
});
