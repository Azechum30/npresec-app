import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";
import "server-only";

export const getCachedPlacedStudent = async (id: string) => {
  "use cache";
  cacheTag(`placed-student-${id}`);
  cacheLife("seconds");

  return await prisma.admission.findUnique({
    where: { id: id },
  });
};
