/** biome-ignore-all assist/source/organizeImports: reason */
"use server";

import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";

export const getStudentsWithoutHouseAllocations = async () =>
  nextSafeAction(
    async () => {
      return await prisma.student.findMany({
        where: {
          house: {
            is: null,
          },
        },
        select: {
          firstName: true,
          id: true,
          studentNumber: true,
          gender: true,
          lastName: true,
          middleName: true,
          currentLevel: true,
        },

        orderBy: [{ lastName: "asc" }],
        take: 100,
      });
    },
    { permission: "view:students" },
  );
