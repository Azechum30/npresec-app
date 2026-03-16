import { auth } from "@/lib/auth";
import { commonErrors } from "@/lib/commonErrors";
import { ChangePasswordSchema } from "@/lib/validation";
import { authMiddleware } from "@/middlewares/auth";
import { headers } from "next/headers";
import { z } from "zod";

export const updatePassword = authMiddleware
  .input(ChangePasswordSchema)
  .errors({ ...commonErrors })
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input, errors }) => {
    try {
      const requestHeaders = await headers();
      const userWithPasswordChange = await auth.api.changePassword({
        body: {
          currentPassword: input.oldPassword,
          newPassword: input.newPassword,
          revokeOtherSessions: true,
        },
        headers: requestHeaders,
      });

      if (!userWithPasswordChange.user) {
        throw errors.NOT_FOUND({ message: "Failed to update user password" });
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to update user password:", error);
      throw error;
    }
  });
