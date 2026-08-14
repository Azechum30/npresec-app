import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { StudentsForExeatSelect } from "@/lib/types";

export const getStudentsForExeats = async (filters: {
  houseMastersId?: string;
}) => {
  const query: Prisma.StudentWhereInput = filters.houseMastersId
    ? {
        deletedAt: null,
        allocations: {
          some: {
            house: {
              houseMaster: { userId: filters.houseMastersId },
              rooms: {
                some: { students: { some: { roomId: { not: null } } } },
              },
            },
          },
        },
      }
    : {
        deletedAt: null,
        allocations: {
          some: {
            house: {
              houseMaster: { isNot: null },
              rooms: {
                some: { students: { some: { roomId: { not: null } } } },
              },
            },
          },
        },
      };

  return await prisma.student.findMany({
    where: query,
    select: StudentsForExeatSelect,
  });
};
