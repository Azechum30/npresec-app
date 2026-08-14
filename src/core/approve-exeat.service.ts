import { ActionError } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export const approveExeatService = async (
  exeatNumber: string,
  userId: string,
) => {
  const [existingExeat, staff] = await Promise.all([
    prisma.exeat.findFirst({
      where: { exeatNumber },
      select: { id: true },
    }),
    prisma.staff.findFirst({
      where: { userId },
      select: { id: true },
    }),
  ]);

  if (!existingExeat)
    throw new ActionError("No record matched the provided exeat number");
  if (!staff) throw new ActionError("No staff matched the provided ID.");

  await prisma.exeat.update({
    where: { id: existingExeat.id },
    data: {
      status: "APPROVED",
      approvedById: staff.id,
    },
  });

  await pusher.trigger("cache-invalidation-settings", "exeat-approved", {});
};
