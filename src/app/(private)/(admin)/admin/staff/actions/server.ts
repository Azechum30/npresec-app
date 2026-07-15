/** biome-ignore-all assist/source/organizeImports: reason */

"use server";
import { arcjetEmailProtection } from "@/lib/arcjet";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { resolveRole } from "@/lib/resolve-staff-role";
import { env } from "@/lib/server-only-actions/validate-env";
import { workflowClient } from "@/lib/server-only-actions/workflow";
import { StaffSelect } from "@/lib/types";
import { StaffSchema, type StaffType } from "@/lib/validation";
import { transformAndValidateStaffData } from "@/utils/staff-data-transformer";
import { triggerImageUpload } from "@/utils/trigger-image-upload";
import "server-only";
import z from "zod";
import { checkExistingRelatedRecords } from "../utils/check-existing-related-records";

export const createStaff = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const { user: authUser } = await getUserPermissions("create:staff");

      if (!authUser)
        throw new ActionError(CUSTOM_ERRORS.AUTHENTICATION.message);

      const { data, error, success } = StaffSchema.safeParse(values);

      if (!success) throw error;

      const { error: emailCheckError } = await arcjetEmailProtection(
        data.email,
        authUser.id,
      );

      if (emailCheckError) throw new ActionError(emailCheckError);

      const normalizedStaff = transformAndValidateStaffData(data);

      if (normalizedStaff.departmentId) {
        const department = await prisma.department.findUnique({
          where: { id: normalizedStaff.departmentId },
          select: { headId: true },
        });

        if (department?.headId !== null && normalizedStaff.isDepartmentHead) {
          throw new ActionError(
            "The Selected Department already has a head assigned.",
          );
        }
      }

      const roleName = resolveRole(normalizedStaff);

      const { error: duplicates, staffRole } =
        await checkExistingRelatedRecords(normalizedStaff, roleName);

      if (duplicates) {
        throw new ActionError(duplicates);
      }

      if (!staffRole) throw new ActionError("No teaching role found!");

      await workflowClient.trigger({
        url: `${env.UPSTASH_WORKFLOW_URL}/api/single/onboard-staff/singleStaffCreationWorkflow`,
        body: {
          rawData: data,
          userId: authUser.id,
          source: "staff",
          roleId: staffRole.id,
        },
      });
      return { success: true };
    },
    { permission: "create:staff" },
  );

export const getStaff = async () =>
  nextSafeAction(
    async () => {
      const staffData = await prisma.staff.findMany({
        select: StaffSelect,
        orderBy: { lastName: "asc" },
      });

      return { staff: staffData };
    },
    { permission: "view:staff" },
  );

export const getStaffMember = async (id: string) =>
  nextSafeAction(
    async () => {
      const staff = await prisma.staff.findUnique({
        where: { id },
        select: StaffSelect,
      });
      if (!staff) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);
      return { staff };
    },
    { permission: "view:staff" },
  );

export const updateStaff = async (data: StaffType & { id: string }) =>
  nextSafeAction(
    async () => {
      const parsed = StaffSchema.extend({ id: z.string() }).safeParse(data);

      if (!parsed.success) throw parsed.error;

      const { id, ...rest } = parsed.data;

      const normalizedStaff = transformAndValidateStaffData(rest);

      const existing = await prisma.staff.findFirst({
        where: {
          id: { not: id },
          OR: [
            { employeeId: normalizedStaff.employeeId },
            { ghcardNumber: normalizedStaff.ghcardNumber },
            { licencedNumber: normalizedStaff.licencedNumber },
            { ssnitNumber: normalizedStaff.ssnitNumber },
            { rgNumber: normalizedStaff.rgNumber },
          ],
        },
      });

      if (existing) {
        if (existing.ghcardNumber === normalizedStaff.ghcardNumber) {
          throw new ActionError(
            "A staff already exists with this Ghana card number",
          );
        } else if (existing.employeeId === normalizedStaff.employeeId) {
          throw new ActionError("A staff already exists with this staff ID");
        } else if (existing.licencedNumber === normalizedStaff.licencedNumber) {
          throw new ActionError(
            "A staff already exists with this licence number",
          );
        } else if (existing.ssnitNumber === normalizedStaff.ssnitNumber) {
          throw new ActionError(
            "A staff already exists with this SSNIT number",
          );
        } else if (existing.rgNumber === normalizedStaff.rgNumber) {
          throw new ActionError(
            "A staff already exists with this registered number",
          );
        }
      }

      const {
        email,
        username,
        password,
        isDepartmentHead,
        imageURL,
        imageFile,
        ...others
      } = normalizedStaff;

      const updatedRecord = await prisma.staff.update({
        where: {
          id,
        },
        data: {
          ...others,
          departmentId: undefined,
          department: others.departmentId
            ? {
                connect: { id: others.departmentId },
              }
            : undefined,
          departmentHead:
            others.departmentId && isDepartmentHead
              ? {
                  connect: { id: others.departmentId },
                }
              : undefined,
          courses: others.courses
            ? {
                set: others.courses.map((courseId) => ({
                  id: courseId,
                })),
              }
            : undefined,
          classes: others.classes
            ? {
                set: others.classes.map((classId) => ({
                  id: classId,
                })),
              }
            : undefined,
          user: {
            update: {
              email: email as string,
              username: username as string,
              image: imageFile ? "Upload Pending" : imageURL,
            },
          },
        },
        select: StaffSelect,
      });

      if (imageFile) {
        void (await triggerImageUpload(
          imageFile as File,
          updatedRecord.userId as string,
          "staff",
          "user" as const,
        ));
      }

      return { data: updatedRecord };
    },
    { permission: "edit:staff" },
  );

export const deleteStaffRequest = async (id: string) =>
  nextSafeAction(
    async () => {
      const staffWithUserId = await prisma.staff.findFirst({
        where: { id, userId: { not: null } },
        select: { userId: true },
      });

      if (staffWithUserId !== null) {
        await prisma.user.delete({
          where: {
            id: staffWithUserId.userId as string,
          },
        });
      }

      if (!staffWithUserId)
        throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);
      return { success: true };
    },
    { permission: "delete:staff" },
  );

export const bulkDeleteStaff = async (rows: string[]) =>
  nextSafeAction(
    async () => {
      const staffWithUserIds = await prisma.staff.findMany({
        where: {
          id: { in: rows },
          userId: { not: null },
        },
        select: { userId: true },
      });

      const userIdsToDelete = staffWithUserIds.map((staff) => staff.userId);

      if (userIdsToDelete.length > 0) {
        await prisma.user.deleteMany({
          where: {
            id: { in: userIdsToDelete as string[] },
          },
        });
      }

      const count = userIdsToDelete.length;

      if (!count) throw new ActionError("Resources not found");

      return { count };
    },
    { permission: "delete:staff" },
  );
