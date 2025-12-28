"use server";

import { getStaff } from "@/app/(private)/(admin)/admin/staff/actions/server";

export async function fetchStaffData() {
  // Direct call to getStaff since permission checks are removed
  return await getStaff();
}
