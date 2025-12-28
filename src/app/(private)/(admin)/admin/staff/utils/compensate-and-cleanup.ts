import { prisma } from "@/lib/prisma";

export const compensateAndCleanup = async (
  userIds: string[],
  employeeIds: string[]
) => {
  const [users, staff] = await Promise.all([
    prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: { id: true, email: true },
    }),

    prisma.staff.findMany({
      where: {
        id: { in: employeeIds },
      },
      select: { id: true, userId: true },
    }),
  ]);

  const foundUserIds = users.map((user) => user.id);
  const foundStaffUserIds = staff
    .map((staffMember) => staffMember.userId)
    .filter(Boolean) as string[];
  const userIdsToDelete = foundUserIds.filter(
    (id) => !foundStaffUserIds.includes(id)
  );
  if (userIdsToDelete.length > 0) {
    console.log(
      `Deleting ${userIdsToDelete.length} orphaned users... ${userIdsToDelete.join(", ")}`
    );
    await prisma.user.deleteMany({
      where: {
        id: { in: userIdsToDelete },
      },
    });
  }
};
