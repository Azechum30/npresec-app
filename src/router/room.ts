/** biome-ignore-all assist/source/organizeImports: reason */
import { type HouseGender, Prisma } from "@/generated/prisma/client";
import { commonErrors } from "@/lib/commonErrors";
import { generateRoomCode } from "@/lib/generate-room-code";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import { RoomSelect } from "@/lib/types";
import { HouseSchema, RoomSchema } from "@/lib/validation";
import { authMiddleware } from "@/middlewares/auth";
import { requirePermissions } from "@/middlewares/permissions";
import { CONSTANTS } from "@/utils/generateStudentIndex";
import { z } from "zod";

const ROOM_GENDER_MISMATCH_MESSAGE =
  "Room gender must align with the selected house.";

const ensureGenderCompatibility = (
  houseGender: HouseGender,
  roomGender: "MALE" | "FEMALE" | "BOTH",
) => {
  if (houseGender === "BOTH") {
    return;
  }

  if (roomGender === "BOTH" || roomGender !== houseGender) {
    throw new Error(ROOM_GENDER_MISMATCH_MESSAGE);
  }
};

export const createRoom = authMiddleware
  .use(requirePermissions("create:rooms"))
  .input(RoomSchema)
  .output(
    RoomSchema.extend({
      id: z.string(),
      house: z.object({ id: z.string(), name: z.string() }),
    }),
  )
  .errors({
    ...commonErrors,
    ROOM_COUNT_ERROR: {
      message: `Number of rooms exceeds the limit for the specified gender`,
      status: 400,
    },
    ROOM_BED_CAPACITY_ERROR: {
      message: `Bed capacity exceeds the limit for the specified gender`,
      status: 400,
    },
  })
  .handler(async ({ input, errors, context }) => {
    try {
      const room = await prisma.$transaction(
        async (tx) => {
          const house = await tx.house.findUnique({
            where: { id: input.houseId },
          });

          if (!house) {
            throw errors.NOT_FOUND();
          }

          try {
            ensureGenderCompatibility(
              house.houseGender,
              input.rmGender as ["MALE", "FEMALE", "BOTH"][number],
            );
          } catch {
            throw errors.BAD_REQUEST({
              message: ROOM_GENDER_MISMATCH_MESSAGE,
            });
          }

          const occupancy = HouseSchema.shape.occupancy.parse(house.occupancy);

          const plan =
            input.rmGender === "MALE"
              ? occupancy.maleOccupancy
              : input.rmGender === "FEMALE"
                ? occupancy.femaleOccupancy
                : null;

          if (!plan) {
            throw errors.BAD_REQUEST({
              message: "Occupancy plan missing for selected gender.",
            });
          }

          const aggregates = await tx.room.aggregate({
            where: { houseId: input.houseId, rmGender: input.rmGender },
            _count: { _all: true },
            _sum: { capacity: true },
          });

          const nextRoomCount = aggregates._count._all + 1;
          if (
            typeof plan.roomCount === "number" &&
            nextRoomCount > plan.roomCount
          ) {
            throw errors.ROOM_COUNT_ERROR();
          }

          const currentBeds = aggregates._sum.capacity ?? 0;
          const nextBedTotal = currentBeds + input.capacity;

          if (
            typeof plan.roomCapacity === "number" &&
            nextBedTotal > plan.roomCapacity
          ) {
            throw errors.ROOM_BED_CAPACITY_ERROR();
          }

          const lastHouseRoom = await tx.room.findFirst({
            where: { houseId: input.houseId },
            orderBy: { createdAt: "desc" },
            select: { code: true },
            take: 1,
          });

          const sequenceNumber = lastHouseRoom?.code
            ? Number.isNaN(
                parseInt(
                  lastHouseRoom.code.slice(-CONSTANTS.SEQUENCE_LENGTH),
                  10,
                ),
              )
              ? 1
              : parseInt(
                  lastHouseRoom.code.slice(-CONSTANTS.SEQUENCE_LENGTH),
                  10,
                ) + 1
            : 1;

          return tx.room.create({
            data: {
              ...input,
              code: generateRoomCode(house.name, sequenceNumber),
            },
            select: RoomSelect,
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );

      await pusher.trigger("cache-invalidation-settings", "new-room-created", {
        triggeredBy: context.user.id,
      });
      return room;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case "P2002":
            throw errors.UNIQUE_CONSTRAINT();
          case "P2003":
            throw errors.FOREIGN_KEY_ERROR();
          case "P2025":
            throw errors.BAD_REQUEST();
        }
      } else if (err instanceof Prisma.PrismaClientValidationError) {
        throw errors.BAD_REQUEST();
      }
      throw err;
    }
  });

export const getRooms = authMiddleware
  .use(requirePermissions("view:rooms"))
  .input(z.object({ houseId: z.string().optional() }).optional())
  .output(
    z.array(
      RoomSchema.extend({
        id: z.string(),
        house: z.object({ id: z.string(), name: z.string() }),
        code: z.string(),
        students: z.array(
          z.object({
            id: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            middleName: z.string().nullable(),
            gender: z.string(),
            phone: z.string().nullish(),
          }),
        ),
      }),
    ),
  )
  .errors({
    ...commonErrors,
  })
  .handler(async ({ input, errors, context }) => {
    try {
      const { user } = context;

      const userRoles = new Set(
        user.roles?.map((r) => r.role.name ?? "").filter(Boolean),
      );

      let whereQueryInput: Prisma.RoomWhereInput = {};

      if (input?.houseId) whereQueryInput.houseId = input.houseId;

      if (userRoles.has("houseMaster"))
        whereQueryInput = {
          ...whereQueryInput,
          house: { houseMaster: { userId: user.id } },
        };

      const rooms = await prisma.room.findMany({
        where: whereQueryInput,
        select: RoomSelect,
      });

      return rooms;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientValidationError) {
        console.error(err);
        throw errors.BAD_REQUEST();
      }

      console.error("An error occurred", err);
      throw err;
    }
  });

export const getRoomById = authMiddleware
  .use(requirePermissions("view:rooms"))
  .input(z.object({ id: z.string() }))
  .output(
    RoomSchema.extend({
      id: z.string(),
      house: z.object({ id: z.string(), name: z.string() }),
      code: z.string(),
      students: z.array(
        z.object({
          id: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          middleName: z.string().nullable(),
          gender: z.string(),
          phone: z.string().nullish(),
        }),
      ),
    }),
  )
  .errors({
    ...commonErrors,
  })
  .handler(async ({ input, errors }) => {
    const room = await prisma.room.findUnique({
      where: { id: input.id },
      select: RoomSelect,
    });

    if (!room) {
      throw errors.NOT_FOUND({ message: "No room found with the provided Id" });
    }

    return room;
  });

export const deleteRoomById = authMiddleware
  .use(requirePermissions("delete:rooms"))
  .input(z.object({ id: z.string() }))
  .output(z.object({ success: z.boolean() }))
  .errors({ ...commonErrors })
  .handler(async ({ input, errors, context }) => {
    await prisma.$transaction(async (tsx) => {
      const room = await tsx.room.findUnique({
        where: { id: input.id },
        select: { id: true },
      });

      if (!room) {
        throw errors.NOT_FOUND();
      }

      return await tsx.room.delete({ where: { id: input.id } });
    });

    await pusher.trigger("cache-invalidation-settings", "room-deleted", {
      triggeredBy: context.user.id,
    });

    return { success: true };
  });

export const updateRoomById = authMiddleware
  .use(requirePermissions("edit:rooms"))
  .input(RoomSchema.extend({ id: z.string() }))
  .output(RoomSchema.extend({ id: z.string(), code: z.string() }))
  .errors({
    ...commonErrors,
    ROOM_COUNT_ERROR: {
      message: `Number of rooms exceeds the limit for the specified gender`,
      status: 400,
    },
    ROOM_BED_CAPACITY_ERROR: {
      message: `Bed capacity exceeds the limit for the specified gender`,
      status: 400,
    },
  })
  .handler(async ({ input, errors, context }) => {
    const roomToUpdate = await prisma.$transaction(async (tsx) => {
      const [room, house] = await Promise.all([
        tsx.room.findUnique({
          where: { id: input.id },
          select: { id: true },
        }),
        tsx.house.findUnique({
          where: { id: input.houseId },
        }),
      ]);

      if (!room || !house) {
        throw errors.NOT_FOUND({
          message: "No room or house found with the provided Id",
        });
      }

      try {
        ensureGenderCompatibility(
          house.houseGender,
          input.rmGender as ["MALE", "FEMALE", "BOTH"][number],
        );
      } catch {
        throw errors.BAD_REQUEST({
          message: ROOM_GENDER_MISMATCH_MESSAGE,
        });
      }

      const occupancy = HouseSchema.shape.occupancy.parse(house.occupancy);

      const plan =
        input.rmGender === "MALE"
          ? occupancy.maleOccupancy
          : input.rmGender === "FEMALE"
            ? occupancy.femaleOccupancy
            : null;

      if (!plan) {
        throw errors.BAD_REQUEST({
          message: "Occupancy plan missing for selected gender.",
        });
      }

      const aggregates = await tsx.room.aggregate({
        where: { houseId: input.houseId, rmGender: input.rmGender },
        _count: { _all: true },
        _sum: { capacity: true },
      });

      const nextRoomCount = aggregates._count._all + 1;
      if (
        typeof plan.roomCount === "number" &&
        nextRoomCount > plan.roomCount
      ) {
        throw errors.ROOM_COUNT_ERROR();
      }

      const currentBeds = aggregates._sum.capacity ?? 0;
      const nextBedTotal = currentBeds + input.capacity;

      if (
        typeof plan.roomCapacity === "number" &&
        nextBedTotal > plan.roomCapacity
      ) {
        throw errors.ROOM_BED_CAPACITY_ERROR();
      }

      const { id, ...rest } = input;

      return await tsx.room.update({
        where: { id },
        data: rest,
      });
    });

    await pusher.trigger("cache-invalidation-settings", "room-updated", {
      triggeredBy: context.user.id,
    });

    return roomToUpdate;
  });

export const deleteRoomsByIds = authMiddleware
  .use(requirePermissions("delete:rooms"))
  .input(z.object({ ids: z.array(z.string()) }))
  .output(z.object({ success: z.boolean(), count: z.number() }))
  .errors({ ...commonErrors })
  .handler(async ({ input, errors, context }) => {
    const deletedCount = await prisma.$transaction(async (tsx) => {
      const count = await tsx.room.count({
        where: { id: { in: input.ids } },
      });

      if (count === 0) {
        throw errors.NOT_FOUND({
          message: "No rooms found with the provided Ids",
        });
      }

      return await tsx.room.deleteMany({
        where: { id: { in: input.ids } },
      });
    });

    await pusher.trigger("cache-invalidation-settings", "rooms-deleted", {
      triggeredBy: context.user.id,
    });
    return { success: true, count: deletedCount.count };
  });
