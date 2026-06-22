import { staffQueryOptions } from "@/app/(private)/(admin)/admin/staff/actions/queries";
import { studentsQueryOptions } from "@/app/(private)/(admin)/admin/students/actions/queries";

export const EVENT_TO_QUERY_KEY: Record<string, string[]> = {
  "staff-onboarding-success": staffQueryOptions.queryKey,
  "student-scores-uploaded": ["student-scores"],
  "staff-bulk-creation-success": staffQueryOptions.queryKey,
  "single-student-onboard-success": studentsQueryOptions.queryKey,
  "student-bulk-creation-success": studentsQueryOptions.queryKey,
};
