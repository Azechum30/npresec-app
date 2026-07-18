/**biome-ignore-all assist/source/organizeImports: reason */
import { Prisma } from "@/generated/prisma/client";
import { commonErrors } from "@/lib/commonErrors";
import { hasRole } from "@/lib/get-session";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import { AllocationsSelect } from "@/lib/types";
import {
  allocationsSchema,
  studentHouseAllocationSchema,
} from "@/lib/validation";
import { authMiddleware } from "@/middlewares/auth";
import { requirePermissions } from "@/middlewares/permissions";
import z from "zod";

export const createAllocation = authMiddleware
  .use(requirePermissions("create:allocations"))
  .input(studentHouseAllocationSchema)
  .output(studentHouseAllocationSchema.extend({ id: z.string() }))
  .errors({ ...commonErrors })
  .handler(async ({ input, context }) =>
    nextSafeAction(async () => {
      const allocation = await prisma.$transaction(async (tx) => {
        const result = await tx.allocation.create({
          data: {
            houseId: input.houseId,
            studentId: input.studentNumber,
            status: input.status,
          },
        });

        if (input.roomId) {
          await tx.room.update({
            where: { id: input.roomId },
            data: {
              students: { connect: { id: input.studentNumber } },
            },
          });
        }

        return result;
      });

      const { studentId, ...rest } = allocation;

      await pusher.trigger(
        "cache-invalidation-settings",
        "allocation-created",
        { triggeredBy: context.user.id },
      );

      return { ...rest, studentNumber: studentId };
    }),
  );

export const getAllocations = authMiddleware
  .use(requirePermissions("view:allocations"))
  .input(z.object({ houseId: z.string() }).optional())
  .output(z.array(allocationsSchema))
  .handler(async ({ context, input }) =>
    nextSafeAction(async () => {
      const userHasRole = await hasRole("houseMaster");

      let query: Prisma.AllocationWhereInput = {};

      if (userHasRole) {
        query = {
          house: {
            houseMaster: {
              userId: context.user.id,
            },
          },
        };
      }

      if (input?.houseId) query.houseId = input.houseId;

      const allocations = await prisma.allocation.findMany({
        where: query,
        select: AllocationsSelect,
      });

      return allocations;
    }),
  );

export const getAllocation = authMiddleware
  .use(requirePermissions("view:allocations"))
  .input(z.cuid())
  .output(allocationsSchema)
  .errors({ ...commonErrors })
  .handler(async ({ input, context, errors }) =>
    nextSafeAction(async () => {
      const userHasRole = await hasRole("houseMaster");
      let query: Prisma.AllocationWhereInput = {
        id: input,
      };

      if (userHasRole) {
        query = {
          ...query,
          house: {
            houseMaster: {
              userId: context.user.id,
            },
          },
        };
      }

      const allocation = await prisma.allocation.findFirst({
        where: query,
        select: AllocationsSelect,
      });

      if (!allocation)
        throw errors.NOT_FOUND({
          message: "No house allocation matched the provided ID",
        });

      return allocation;
    }),
  );

export const deleteAllocation = authMiddleware
  .use(requirePermissions("delete:allocations"))
  .input(z.cuid())
  .errors({ ...commonErrors })
  .handler(async ({ context, input, errors }) =>
    nextSafeAction(async () => {
      const userHasRole = await hasRole("houseMaster");

      let query: Prisma.AllocationWhereUniqueInput = {
        id: input,
      };

      if (userHasRole) {
        query = {
          ...query,
          house: {
            houseMaster: {
              userId: context.user.id,
            },
          },
        };
      }

      await prisma.$transaction(async (tx) => {
        const existing = await tx.allocation.findFirst({
          where: query,
          select: { id: true },
        });

        if (!existing)
          throw errors.NOT_FOUND({
            message: "No allocation matched the provided ID",
          });

        const allocation = await tx.allocation.delete({
          where: { id: existing.id },
          select: AllocationsSelect,
        });

        if (allocation.status === "Boarding") {
          await tx.room.update({
            where: { id: allocation.student.roomId as string },
            data: {
              students: { disconnect: { id: allocation.student.id } },
            },
          });
        }

        await pusher.trigger(
          "cache-invalidation-settings",
          "allocation-deleted",
          { triggeredBy: context.user.id },
        );
      });
    }),
  );
export const deleteAllocations = authMiddleware
  .use(requirePermissions("delete:allocations"))
  .input(z.array(z.cuid()))
  .output(z.object({ count: z.number() }))
  .errors({ ...commonErrors })
  .handler(async ({ context, input, errors }) =>
    nextSafeAction(async () => {
      const userHasRole = await hasRole("houseMaster");

      const result = await prisma.$transaction(async (tx) => {
        const existing = await tx.allocation.findMany({
          where: { id: { in: input } },
          select: AllocationsSelect,
        });

        const allocationsIdsSet = new Set(input.map((id) => id));

        const allocationsToDelete = existing.filter((al) =>
          allocationsIdsSet.has(al.id),
        );

        let query: Prisma.AllocationWhereInput = {
          id: { in: allocationsToDelete.map((al) => al.id) },
        };
        if (userHasRole) {
          query = {
            ...query,
            house: {
              houseMaster: {
                userId: context.user.id,
              },
            },
          };
        }

        if (allocationsToDelete.length === 0)
          throw errors.NOT_FOUND({
            message: "No record matched the provided IDs.",
          });

        const result = await tx.allocation.deleteMany({
          where: query,
        });

        for (const allocation of allocationsToDelete) {
          if (allocation.status === "Boarding") {
            await tx.room.update({
              where: { id: allocation.student.roomId as string },
              data: {
                students: { disconnect: { id: allocation.student.id } },
              },
            });
          }
        }

        return result;
      });

      await pusher.trigger(
        "cache-invalidation-settings",
        "allocations-deleted",
        { triggeredBy: context.user.id },
      );

      return { count: result.count };
    }),
  );

export const studentsWithAllocations = authMiddleware
  .use(requirePermissions("view:students"))
  .input(z.string().optional())
  .output(
    z.array(
      z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        gender: z.string(),
        studentNumber: z.string(),
        currentLevel: z.string(),
        middleName: z.string().nullable(),
      }),
    ),
  )
  .handler(async ({ input }) =>
    nextSafeAction(async () => {
      let query: Prisma.StudentWhereInput = {};

      if (input) {
        query.id = input;
      } else {
        query = {
          allocations: {
            none: {},
          },
        };
      }

      return await prisma.student.findMany({
        where: query,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          gender: true,
          studentNumber: true,
          currentLevel: true,
          middleName: true,
        },
      });
    }),
  );

export const updateAllocation = authMiddleware
  .use(requirePermissions("edit:allocations"))
  .input(studentHouseAllocationSchema.extend({ id: z.string() }))
  .errors({ ...commonErrors })
  .handler(async ({ input, context, errors }) =>
    nextSafeAction(async () => {
      const userRole = await hasRole("houseMaster");

      let findQuery: Prisma.AllocationWhereInput = { id: input.id };
      if (userRole) {
        findQuery = {
          ...findQuery,
          house: { houseMaster: { userId: context.user.id } },
        };
      }

      await prisma.$transaction(async (tsx) => {
        const existingAllocation = await tsx.allocation.findFirst({
          where: findQuery,
        });

        if (!existingAllocation) {
          throw errors.NOT_FOUND({
            message: "No allocation matched the provided ID",
          });
        }

        if (
          existingAllocation.status !== input.status &&
          input.status === "Day"
        ) {
          if (input.roomId) {
            await tsx.room.update({
              where: { id: input.roomId },
              data: { students: { disconnect: { id: input.studentNumber } } },
            });
          }
        } else if (input.roomId) {
          await tsx.room.update({
            where: { id: input.roomId },
            data: { students: { connect: { id: input.studentNumber } } },
          });
        }

        await tsx.allocation.update({
          where: { id: existingAllocation.id },
          data: {
            status: input.status,
            houseId: input.houseId,
            studentId: input.studentNumber,
          },
        });
        await pusher.trigger(
          "cache-invalidation-settings",
          "allocation-updated",
          { triggeredBy: context.user.id },
        );
      });
    }),
  );
