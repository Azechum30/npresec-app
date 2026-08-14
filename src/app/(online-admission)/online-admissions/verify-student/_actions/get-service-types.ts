/** biome-ignore-all assist/source/organizeImports: reason */
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import "server-only";

export const getServiceTypes = async () =>
  nextSafeAction(async () => {
    const serviceTypes = await prisma.fee.findMany({
      select: { id: true, name: true, deadline: true, status: true },
    });
    return { serviceTypes: serviceTypes };
  });
