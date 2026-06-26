/** biome-ignore-all assist/source/organizeImports: reason */
import { getQueryKey } from "@/app/(private)/(admin)/admin/staff/utils/get-query-key";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { StudentSelect } from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";

export const getCachedStudentService = async (studentIds?: string[]) => {
  "use cache";
  cacheTag(getQueryKey().student.all[0]);
  cacheLife("max");

  let query: Prisma.StudentWhereInput = {};

  if (studentIds) {
    query = {
      studentNumber: { in: studentIds },
    };
  }
  return await prisma.student.findMany({
    where: query,
    select: StudentSelect,
    orderBy: [{ lastName: "asc" }, { createdAt: "desc" }],
  });
};
