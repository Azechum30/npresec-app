import { prisma } from "@/lib/prisma";
import { HouseSchema } from "@/lib/validation";
import { authMiddleware } from "@/middlewares/auth";
import { requirePermissions } from "@/middlewares/permissions";
import { z } from "zod";

export const createHouse = authMiddleware
  .use(requirePermissions("create:houses"))
  .input(HouseSchema)
  .output(HouseSchema.extend({ id: z.string().cuid() }))
  .errors({
    FORBIDDEN: {
      message: "You do not have permission to perform this action",
      status: 403,
    },
  })
  .handler(async ({ context, input }) => {
    const house = await prisma.house.create({
      data: input,
    });

    return house;
  });

export const getHouses = authMiddleware
  .use(requirePermissions("view:houses"))
  .output(z.array(HouseSchema.extend({ id: z.string().cuid() })))
  .handler(async ({ context }) => {
    const houses = await prisma.house.findMany();
    return houses;
  });
