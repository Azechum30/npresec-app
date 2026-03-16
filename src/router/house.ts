import { prisma } from "@/lib/prisma";
import { HouseSelect } from "@/lib/types";
import { HouseSchema } from "@/lib/validation";
import { authMiddleware } from "@/middlewares/auth";
import { requirePermissions } from "@/middlewares/permissions";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { commonErrors } from "@/lib/commonErrors";
import { getCachedHouses } from "@/utils/get-cached-houses";

export const createHouse = authMiddleware
  .use(requirePermissions("create:houses"))
  .input(HouseSchema)
  .output(HouseSchema.extend({ id: z.string().cuid() }))
  .errors({
    ...commonErrors,
  })
  .handler(async ({ input, errors }) => {
    try {
      const house = await prisma.house.create({
        data: {
          name: input.name,
          houseGender: input.houseGender,
          residencyType: input.residencyType,
          occupancy: input.occupancy,
          houseMaster: input.houseMasterId
            ? { connect: { id: input.houseMasterId } }
            : undefined,
        },
      });

      revalidateTag("houses-list", "seconds");
      return {
        ...house,
        occupancy: HouseSchema.shape.occupancy.parse(house.occupancy),
        houseMasterId: house.houseMasterId as string,
      };
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case "P2002":
            throw errors.UNIQUE_CONSTRAINT();
          case "P2003":
            throw errors.FOREIGN_KEY_ERROR();
          case "P2025":
            throw errors.BAD_REQUEST();
        }
      }
      if (err instanceof Prisma.PrismaClientValidationError) {
        throw errors.BAD_REQUEST();
      }
      throw err;
    }
  });

export const getHouses = authMiddleware
  .use(requirePermissions("view:houses"))
  .output(
    z.array(
      HouseSchema.extend({
        id: z.string().cuid(),
        houseMaster: z
          .object({
            id: z.string().cuid(),
            firstName: z.string(),
            lastName: z.string(),
          })
          .nullable(),
      })
    )
  )
  .errors({
    ...commonErrors,
  })
  .handler(async () => {
    const houses = await getCachedHouses();

    return houses.map((house) => ({
      ...house,
      occupancy: HouseSchema.shape.occupancy.parse(house.occupancy),
      houseMasterId: house.houseMasterId as string,
    }));
  });

export const getHouseById = authMiddleware
  .use(requirePermissions("view:houses"))
  .input(z.object({ id: z.string().cuid() }))
  .output(
    HouseSchema.extend({
      id: z.string().cuid(),
      houseMaster: z
        .object({
          id: z.string().cuid(),
          firstName: z.string(),
          lastName: z.string(),
        })
        .nullable(),
    })
  )
  .errors({
    ...commonErrors,
  })
  .handler(async ({ input, errors }) => {
    try {
      const house = await prisma.house.findUnique({
        where: { id: input.id },
        select: HouseSelect,
      });

      if (!house) {
        throw errors.NOT_FOUND();
      }

      return {
        ...house,
        occupancy: HouseSchema.shape.occupancy.parse(house?.occupancy),
        houseMasterId: house?.houseMasterId as string,
      };
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientValidationError) {
        throw errors.BAD_REQUEST();
      }
      throw err;
    }
  });

export const deleteHouse = authMiddleware
  .use(requirePermissions("delete:houses"))
  .input(z.object({ id: z.string().cuid() }))
  .output(z.object({ success: z.boolean() }))
  .errors({
    ...commonErrors,
  })
  .handler(async ({ input, errors }) => {
    try {
      await prisma.$transaction(async (tsx) => {
        const house = await tsx.house.findUnique({
          where: { id: input.id },
        });

        if (!house) {
          throw errors.NOT_FOUND();
        }

        await tsx.house.delete({
          where: { id: input.id },
        });
      });

      revalidateTag("houses-list", "seconds");

      return { success: true };
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientValidationError) {
        throw errors.BAD_REQUEST();
      }
      throw err;
    }
  });

export const updateHouse = authMiddleware
  .use(requirePermissions("edit:houses"))
  .input(z.object({ id: z.string().cuid() }).and(HouseSchema))
  .output(HouseSchema.extend({ id: z.string().cuid() }))
  .errors({
    ...commonErrors,
  })
  .handler(async ({ input, errors }) => {
    try {
      const { id, ...data } = input;

      const updatedHouse = await prisma.$transaction(async (tsx) => {
        const house = await tsx.house.findUnique({
          where: { id },
        });

        if (!house) {
          throw errors.NOT_FOUND();
        }

        return await tsx.house.update({
          where: { id },
          data: {
            name: data.name,
            houseGender: data.houseGender,
            residencyType: data.residencyType,
            occupancy: data.occupancy,
            houseMaster: data.houseMasterId
              ? { connect: { id: data.houseMasterId } }
              : { disconnect: true },
          },
        });
      });

      revalidateTag("houses-list", "seconds");

      return {
        ...updatedHouse,
        occupancy: HouseSchema.shape.occupancy.parse(updatedHouse.occupancy),
        houseMasterId: updatedHouse.houseMasterId as string,
      };
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case "P2002":
            throw errors.UNIQUE_CONSTRAINT();
          case "P2003":
            throw errors.FOREIGN_KEY_ERROR();
          case "P2025":
            throw errors.NOT_FOUND();
        }
      }
      if (err instanceof Prisma.PrismaClientValidationError) {
        throw errors.BAD_REQUEST();
      }
      throw err;
    }
  });

export const bulkdeleteHouses = authMiddleware
  .use(requirePermissions("delete:houses"))
  .input(z.object({ ids: z.array(z.string()) }))
  .output(z.object({ success: z.boolean(), count: z.coerce.number() }))
  .errors({
    ...commonErrors,
  })
  .handler(async ({ input, errors }) => {
    try {
      const { ids } = input;

      const deletedResults = await prisma.$transaction(async (tsx) => {
        const existingHouses = await tsx.house.findMany({
          where: { id: { in: ids } },
        });

        const ExistingIDsMap = new Map(ids.map((id) => [id, false]));

        for (const record of existingHouses) {
          if (ExistingIDsMap.has(record.id)) {
            ExistingIDsMap.set(record.id, true);
          }
        }

        const matchIds = Array.from(ExistingIDsMap.entries())
          .filter(([id, found]) => found)
          .map(([id, found]) => id);

        if (!matchIds.length) {
          throw errors.NOT_FOUND();
        }

        return await tsx.house.deleteMany({
          where: { id: { in: matchIds } },
        });
      });

      revalidateTag("houses-list", "seconds");

      return { success: true, count: deletedResults.count };
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientValidationError) {
        throw errors.BAD_REQUEST();
      }

      throw err;
    }
  });
