/** biome-ignore-all assist/source/organizeImports: reason */

import { prisma } from "@/lib/prisma";
import { StudentSelect } from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";
import { getQueryKey } from "../../staff/utils/get-query-key";

export const getSingleCachedStudent = async (studentId: string) => {
  "use cache";
  cacheTag(...getQueryKey(studentId).student.single[1]);
  cacheLife("max");

  return await prisma.student.findUnique({
    where: { id: studentId },
    select: StudentSelect,
  });
};
