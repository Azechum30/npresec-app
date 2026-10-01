import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import type { ExeatFormValues } from "@/lib/validation";

export const createStudentExeatService = async (
  payload: ExeatFormValues,
): Promise<{ id: string; exeatNumber: string }> => {
  const newExeat = await prisma.$transaction(
    async (tsx) => {
      const currentYear = new Date().getFullYear();

      const countForCurrentYear = await tsx.exeat.count({
        where: {
          createdAt: {
            gte: new Date(currentYear, 0, 1),
            lt: new Date(currentYear + 1, 0, 1),
          },
        },
      });

      const nextSequence = String(countForCurrentYear + 1).padStart(5, "0");
      const generatedExeatNumber = `EXE-${currentYear}-${nextSequence}`;

      console.log("Exeat number", generatedExeatNumber);

      return await tsx.exeat.create({
        data: {
          exeatNumber: generatedExeatNumber,
          studentId: payload.studentId,
          level: payload.level,
          type: payload.type,
          destination: payload.destination,
          reason: payload.reason,
          classId: payload.classId,
          houseId: payload.houseId,
          departureDate: new Date(payload.departureDate),
          expectedReturnDate: new Date(payload.expectedReturnDate),
          guardianContact: payload.guardianContact,
          guardianName: payload.guardianName,
          status: "PENDING",
        },
        select: {
          id: true,
          exeatNumber: true,
        },
      });
    },
    { isolationLevel: "Serializable" },
  );

  await pusher.trigger("cache-invalidation-settings", "create-exeat", {});

  return newExeat;
};
