import { prisma } from "@/lib/prisma";
import { StudentSelect } from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";

export const getCachedStudentService = async () => {
  "use cache";
  cacheTag("students-list");
  cacheLife("max");

  const students = await prisma.student.findMany({
    select: StudentSelect,
    orderBy: { createdAt: "desc" },
  });

  return students;
};
