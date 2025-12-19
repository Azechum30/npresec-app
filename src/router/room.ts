import { Prisma, HouseGender } from "@/generated/prisma/client";
import { commonErrors } from "@/lib/commonErrors";
import { generateRoomCode } from "@/lib/generate-room-code";
import { prisma } from "@/lib/prisma";
import { HouseSchema, RoomSchema } from "@/lib/validation";
import { authMiddleware } from "@/middlewares/auth";
import { requirePermissions } from "@/middlewares/permissions";
import { CONSTANTS } from "@/utils/generateStudentIndex";
import { z } from "zod";

const ROOM_GENDER_MISMATCH_MESSAGE =
  "Room gender must align with the selected house.";

const ensureGenderCompatibility = (
  houseGender: HouseGender,
  roomGender: "MALE" | "FEMALE" | "BOTH"
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
  .output(RoomSchema.extend({ id: z.string().cuid() }))
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
  .handler(async ({ input, errors }) => {
    try {
      return await prisma.$transaction(
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
              input.rmGender as ["MALE", "FEMALE", "BOTH"][number]
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
                parseInt(lastHouseRoom.code.slice(-CONSTANTS.SEQUENCE_LENGTH))
              )
              ? 1
              : parseInt(lastHouseRoom.code.slice(-CONSTANTS.SEQUENCE_LENGTH)) +
                1
            : 1;

          return tx.room.create({
            data: {
              ...input,
              code: generateRoomCode(house.name, sequenceNumber),
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      );
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
      } else if (err instanceof Prisma.PrismaClientValidationError) {
        throw errors.BAD_REQUEST();
      }
      throw err;
    }
  });

export const getRooms = authMiddleware
  .use(requirePermissions("view:rooms"))
  .input(z.object({ houseId: z.string().cuid().optional() }).optional())
  .output(
    z.array(
      RoomSchema.extend({
        id: z.string().cuid(),
        house: z.object({ id: z.string().cuid(), name: z.string() }),
        code: z.string(),
      })
    )
  )
  .errors({
    ...commonErrors,
  })
  .handler(async ({ input, errors }) => {
    try {
      let query: Prisma.RoomWhereInput = {};

      if (input?.houseId) {
        query = {
          ...query,
          houseId: input.houseId,
        };
      }

      const rooms = await prisma.room.findMany({
        where: query,
        include: {
          house: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return rooms;
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientValidationError) {
        console.error(err);
        throw errors.BAD_REQUEST();
      }
      throw err;
    }
  });
