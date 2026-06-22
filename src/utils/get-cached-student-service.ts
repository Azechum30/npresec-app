/** biome-ignore-all assist/source/organizeImports: reason */
import { getQueryKey } from "@/app/(private)/(admin)/admin/staff/utils/get-query-key";
import { prisma } from "@/lib/prisma";
import { StudentSelect } from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";

export const getCachedStudentService = async () => {
  "use cache";
  cacheTag(getQueryKey().student.all[0]);
  cacheLife("max");

  return await prisma.student.findMany({
    select: StudentSelect,
    orderBy: [{ studentNumber: "asc" }, { lastName: "asc" }],
  });
};
