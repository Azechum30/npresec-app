
import { auth } from "@/lib/auth";
import { generatePassword } from "@/lib/generatePassword";
import { prisma } from "@/lib/prisma";
import { resolveRole } from "@/lib/resolve-staff-role";
import { headers } from "next/headers";

export const createStaffUser = async (staffData: any, roleMap: Map<string, string>) => {
  try {
    const password = generatePassword();

    await auth.api.signUpEmail({
      body: {
        email: staffData.email.toLowerCase(),
        username: staffData.username.toLowerCase(),
        name: `${staffData.firstName} ${staffData.lastName}`,
        password,
        callbackURL: "/email-verified",
      },
      headers: await headers(),
    });

    const user = await prisma.user.findUnique({
      where: { email: staffData.email.toLowerCase() },
      select: { id: true, name: true, email: true },
    });

    if (user) {
      const roleName = resolveRole(staffData);
      const roleId = roleMap.get(roleName);

      if (roleId) {
        await prisma.user.update({
          where: { id: user.id },
          data: { roleId },
        });
      }

      return { ...user, password };
    }
  } catch (e) {
    console.log(`Failed to create user with email ${staffData.email}`);
  }

  return null;
};
