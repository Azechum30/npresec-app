"use server";

import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export const approveOrDisapproveLogin = async (
  prevState: any,
  formData: FormData,
): Promise<{ success?: boolean; error?: string }> => {
  try {
    const { hasPermission } = await getUserPermissions("create:users");

    if (!hasPermission)
      return {
        error: "You do not have sufficient permissions to perform this task!",
      };

    const userId = formData.get("userId");
    const emailVerified = formData.get("emailVerified");

    if (!userId || !emailVerified) return { error: "Invalid parameters" };

    const approvedOrBarnishedUser = await prisma.user.update({
      where: { id: userId as string },
      data: { emailVerified: emailVerified === "true" ? false : true },
      select: { id: true },
    });

    if (!approvedOrBarnishedUser)
      return { error: "Failed to either banish or approve user login." };

    revalidateTag("users-list", "seconds");
    return { success: true };
  } catch (e) {
    console.error("Failed to either approve or barnish user", e);
    return { error: getErrorMessage(e) };
  }
};
