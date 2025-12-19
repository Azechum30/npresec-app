import { prisma } from "@/lib/prisma";
import { StaffSelect } from "@/lib/types";
import { StaffSchema } from "@/lib/validation";
import { authMiddleware } from "@/middlewares/auth";
import { requirePermissions } from "@/middlewares/permissions";
import {} from "@orpc/server";
import { z } from "zod";

export const getStaff = authMiddleware
  .use(requirePermissions("view:staff"))
  .output(
    z.array(
      StaffSchema.extend({ id: z.string().cuid() }).omit({
        imageFile: true,
        isDepartmentHead: true,
        imageURL: true,
        classes: true,
        email: true,
        username: true,
        courses: true,
      })
    )
  )
  .handler(async ({ context }) => {
    const staff = await prisma.staff.findMany({ select: StaffSelect });

    return staff;
  });
