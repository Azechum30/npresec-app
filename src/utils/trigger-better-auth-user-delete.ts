import { prisma } from "@/lib/prisma";

export const triggerRollback = async (userId: string) => {
  try {
    await prisma.user.delete({ where: { id: userId } });
    return { success: true };
  } catch (error) {
    console.log("Error during rollback user deletion:", error);
    throw error;
  }
};
