/**biome-ignore-all assist/source/organizeImports:reason */

import { approveExeatService } from "@/core/approve-exeat.service";
import { confirmExeatDepartureOrReturnService } from "@/core/confirm-exeat-departure-or-return.service";
import { createStudentExeatService } from "@/core/create-student-exeat.service";
import { deleteExeatService } from "@/core/delete-exeat.service";
import { deleteExeatsService } from "@/core/delete-exeats.service";
import { getExeatService } from "@/core/get-exeat.service";
import { getExeatsDataService } from "@/core/get-exeats-data.service";
import { getStudentsForExeats } from "@/core/get-students-for-exeats.service";
import { updateExeatService } from "@/core/update-exeat.service";
import { commonErrors } from "@/lib/commonErrors";
import { hasRole } from "@/lib/has-role";
import { nextSafeAction } from "@/lib/next-safe-action";
import {
  exeatFormSchema,
  exeatsServerResponseSchema,
  studentsForExeatSchema,
} from "@/lib/validation";
import { authMiddleware } from "@/middlewares/auth";
import { requirePermissions } from "@/middlewares/permissions";
import z from "zod";

export const getStudentsToAssignExeatRequest = authMiddleware
  .use(requirePermissions("view:students"))
  .output(studentsForExeatSchema)
  .handler(async ({ context }) =>
    nextSafeAction(async () => {
      const isHouseMaster = await hasRole("houseMaster");
      return await getStudentsForExeats({
        houseMastersId: isHouseMaster ? context.user.id : undefined,
      });
    }),
  );

export const getExeatsRequest = authMiddleware
  .use(requirePermissions("view:exeats"))
  .output(z.array(exeatsServerResponseSchema))
  .errors({ ...commonErrors })
  .handler(async ({ context, errors }) =>
    nextSafeAction(async () => {
      const isHouseMaster = await hasRole("houseMaster");
      const data = await getExeatsDataService({
        houseMasterId: isHouseMaster ? context.user.id : undefined,
      });

      const parsed = z.array(exeatsServerResponseSchema).safeParse(data);
      if (!parsed.success) {
        throw errors.VALIDATION_ERROR({ message: parsed.error.message });
      }

      return data;
    }),
  );

export const getExeatRequest = authMiddleware
  .use(requirePermissions("view:exeats"))
  .input(z.string())
  .output(exeatsServerResponseSchema)
  .handler(async ({ context, input }) =>
    nextSafeAction(async () => {
      const isHouseMaster = await hasRole("houseMaster");
      return await getExeatService(input, {
        houseMasterId: isHouseMaster ? context.user.id : undefined,
      });
    }),
  );

export const createExeatRequest = authMiddleware
  .use(requirePermissions("create:exeats"))
  .input(exeatFormSchema)
  .output(z.object({ id: z.cuid(), exeatNumber: z.string() }))
  .handler(async ({ input }) =>
    nextSafeAction(async () => {
      return await createStudentExeatService(input);
    }),
  );

export const updateExeatRequest = authMiddleware
  .use(requirePermissions("edit:exeats"))
  .input(exeatFormSchema.extend({ id: z.string() }))
  .handler(async ({ context, input }) =>
    nextSafeAction(async () => {
      const isHouseMaster = await hasRole("houseMaster");
      return await updateExeatService(input, {
        houseMasterId: isHouseMaster ? context.user.id : undefined,
      });
    }),
  );

export const deleteExeatRequest = authMiddleware
  .use(requirePermissions("delete:exeats"))
  .input(z.cuid())
  .handler(async ({ input, context }) =>
    nextSafeAction(async () => {
      const isHouseMaster = await hasRole("houseMaster");
      return await deleteExeatService(input, {
        houseMasterId: isHouseMaster ? context.user.id : undefined,
      });
    }),
  );

export const deleteExeatsRequest = authMiddleware
  .use(requirePermissions("delete:exeats"))
  .input(z.array(z.cuid()))
  .output(z.object({ count: z.number() }))
  .handler(async ({ input, context }) =>
    nextSafeAction(async () => {
      const isHouseMaster = await hasRole("houseMaster");
      return await deleteExeatsService(input, {
        houseMasterId: isHouseMaster ? context.user.id : undefined,
      });
    }),
  );

export const approveExeatRequest = authMiddleware
  .use(requirePermissions("edit:exeats"))
  .input(z.string())
  .handler(async ({ context, input }) =>
    nextSafeAction(async () => {
      return await approveExeatService(input, context.user.id);
    }),
  );

export const confirmExeatDepartureOrReturnRequest = authMiddleware
  .use(requirePermissions("create:exeats"))
  .input(z.cuid())
  .handler(async ({ context, input }) =>
    nextSafeAction(async () => {
      return await confirmExeatDepartureOrReturnService(context.user.id, input);
    }),
  );
