"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { workflowClient } from "@/lib/server-only-actions/workflow";
import { PlacementListType } from "@/lib/types";
import {
  ADMISSION_STATUS,
  BulkUploadPlacedStudententType,
  BulkUploadPlacedStudentsSchema,
  FreshAdmissionsSchema,
  FreshAdmissionsType,
  Gender,
  RESIDENTIAL_STATUS,
  UpdateFreshStudentsAdmissionSchema,
  UpdateFreshStudentsAdmissionType,
} from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { updateTag } from "next/cache";
import "server-only";
import z4, { z } from "zod/v4";
import { getCachedPlacedStudent } from "../_utils/get-cached-placed-student";
import { getCachedPlacedStudents } from "../_utils/get-cached-placed-students";

export const createNewStudentAdmissionAction = async (
  values: FreshAdmissionsType,
): Promise<{ error?: string; success?: boolean }> => {
  try {
    const { hasPermission } = await getUserPermissions("create:admissions");
    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const { success, data, error } = FreshAdmissionsSchema.safeParse(values);

    if (!success) throw error;

    const existingIndexNumber = await prisma.admission.findUnique({
      where: { jhsIndexNumber: data.jhsIndexNumber },
    });

    if (existingIndexNumber)
      throw new ActionError(
        CUSTOM_ERRORS.UNIQUE_CONSTRAINTS.message,
        CUSTOM_ERRORS.UNIQUE_CONSTRAINTS.status,
        CUSTOM_ERRORS.UNIQUE_CONSTRAINTS.code,
      );

    await prisma.$transaction(async (tx) => {
      const result = await tx.admission.create({
        data: {
          ...data,
          birthDate: new Date(data.birthDate),
          enrollmentCode: data.enrollmentCode
            ? data.enrollmentCode.trim()
            : null,
        },
      });

      await tx.payment.create({
        data: {
          admissionId: result.id,
          amount: 51.0,
          currency: "GHS",
          paymentStatus: "PENDING",
        },
      });
    });

    updateTag("placement-list");
    return { success: true };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};

export const getPlacedStudents = async (): Promise<{
  error?: string;
  placedStudents?: PlacementListType[];
  stats?: {
    addmitedCount: number;
    pendingCount: number;
    femalesCount: number;
    malesCount: number;
  };
}> => {
  try {
    const { hasPermission } = await getUserPermissions("view:admissions");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const [
      placementlist,
      addmitedCount,
      pendingCount,
      femalesCount,
      malesCount,
    ] = await Promise.all([
      getCachedPlacedStudents(),
      prisma.admission.count({
        where: { admissionStatus: "ADMITTED" },
      }),
      prisma.admission.count({
        where: { admissionStatus: "PENDING" },
      }),
      prisma.admission.count({
        where: { gender: "female" },
      }),
      prisma.admission.count({
        where: { gender: "male" },
      }),
    ]);

    return {
      placedStudents: placementlist ?? [],
      stats: { addmitedCount, pendingCount, femalesCount, malesCount },
    };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};

export const updateFreshStudentAdmission = async (
  values: UpdateFreshStudentsAdmissionType,
) => {
  try {
    const { hasPermission } = await getUserPermissions("edit:admissions");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const {
      success,
      data,
      error: zodError,
    } = UpdateFreshStudentsAdmissionSchema.safeParse(values);

    if (!success) throw zodError;

    await prisma.admission.update({
      where: { id: data.id },
      data: {
        ...data,
        enrollmentCode: data.enrollmentCode ? data.enrollmentCode.trim() : null,
      },
    });

    updateTag("placement-list");
    updateTag(`placed-student-${data.id}`);
    return { success: true };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};

export const getPlacedStudentById = async (id: z4.ZodCUID) => {
  try {
    const { hasPermission } = await getUserPermissions("view:admissions");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const { success, data, error } = z.cuid().safeParse(id);

    if (!success) throw error;

    const placedStudent = await getCachedPlacedStudent(
      data as typeof z.ZodCUID.prototype,
    );
    if (!placedStudent)
      throw new ActionError(
        CUSTOM_ERRORS.NOTFOUND.message,
        CUSTOM_ERRORS.NOTFOUND.status,
        CUSTOM_ERRORS.NOTFOUND.code,
      );

    updateTag(`placed-student-${data}`);

    return { placedStudent };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};

export const deletePlacedStudentById = async (id: z.ZodCUID) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:admissions");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const { success, data, error } = z.cuid().safeParse(id);

    if (!success) throw error;

    const deletedPlacedStudent = await prisma.admission.delete({
      where: { id: data },
    });

    if (!deletedPlacedStudent)
      throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

    updateTag("placement-list");
    updateTag(`placed-student-${data}`);
    return { success: true };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};

export const bulkDeletePlacedStudentsByIds = async (ids: z.ZodCUID[]) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:admissions");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const { success, data, error } = z.array(z.cuid()).safeParse(ids);

    if (!success) throw error;

    const result = await prisma.admission.deleteMany({
      where: { id: { in: ids as (typeof z.ZodCUID.prototype)[] } },
    });

    if (!result.count) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);
    updateTag("placement-list");
    return { success: true, count: result.count };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};

export const bulkUploadPlacedStudentsAction = async (
  values: unknown,
): Promise<{
  error?: string;
  count?: number;
  success?: boolean;
  workerId?: string;
}> => {
  try {
    const { user, hasPermission } =
      await getUserPermissions("create:admissions");
    if (!hasPermission || !user)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    const inboundData = (values as BulkUploadPlacedStudententType).data.map(
      (placedStudent) => ({
        ...placedStudent,
        gender: placedStudent.gender as Gender,
        residentialStatus:
          placedStudent.residentialStatus as RESIDENTIAL_STATUS,
        enrollmentCode: placedStudent.enrollmentCode ?? undefined,
        birthDate: new Date(placedStudent.birthDate),
        admissionStatus: "PENDING" as ADMISSION_STATUS,
      }),
    );

    const { error, success, data } = BulkUploadPlacedStudentsSchema.safeParse({
      data: inboundData,
    });

    if (!success) throw error;

    const IndexNumbers = [
      ...new Set(
        data.data.map((placedStudent) => placedStudent.jhsIndexNumber),
      ),
    ];

    const existingJhsIndexNumbers = await prisma.admission.findMany({
      where: { jhsIndexNumber: { in: IndexNumbers } },
    });

    const IndexMap = new Map(
      existingJhsIndexNumbers.map((item) => [item.jhsIndexNumber, item]),
    );

    const filterData = data.data
      .map((item) => {
        const indexExist = IndexMap.has(item.jhsIndexNumber);

        if (indexExist) return null;

        return item;
      })
      .filter((item) => item !== null);

    if (filterData.length == 0) {
      throw new ActionError(
        "All records in the file have already been added to the system.",
      );
    }

    const { workflowRunId } = await workflowClient.trigger({
      url: `${env.UPSTASH_WORKFLOW_URL}/api/placement-list/upload`,
      body: {
        data: filterData,
        userId: user.id,
      },
    });

    return { success: true, count: filterData.length, workerId: workflowRunId };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
