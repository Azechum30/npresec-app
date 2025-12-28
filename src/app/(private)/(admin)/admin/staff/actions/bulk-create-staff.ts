"use server";

import { BulkCreateStaffSchema, BulkCreateStaffType } from "@/lib/validation";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { hasPermissions } from "@/lib/hasPermission";

import { client } from "@/utils/qstash";
import { env } from "@/lib/server-only-actions/validate-env";

import * as Sentry from "@sentry/nextjs";
import { validateAndTransformBulkData } from "../utils/validate-and-transform-bulk-data";
import { checkEntityExistencePossibleDuplicates } from "../utils/check-enity-existence-possible-duplicates";

export const bulkCreateStaff = async (values: BulkCreateStaffType) => {
  try {
    const permission = await hasPermissions("create:staff");
    if (!permission) return { error: "Unauthorized access" };

    if (!values.data?.length) return { error: "No staff data provided" };
    if (values.data.length > 100)
      return { error: "Batch size too large (max 100)" };

    const validationResult = BulkCreateStaffSchema.safeParse(values);
    if (!validationResult.success) {
      const validationErrors = validationResult.error.issues.map(
        (issue) =>
          `Row ${issue.path[1] ? (issue.path[1] as number) + 1 : "unknown"}: ${issue.message}`
      );
      return { error: validationErrors.join("; ") };
    }

    const validAndTransformedData = validateAndTransformBulkData(
      validationResult.data
    );

    const { transformedData } = await checkEntityExistencePossibleDuplicates(
      validAndTransformedData
    );

    void client.batchJSON([
      {
        url: `${env.NEXT_PUBLIC_URL}/api/batch/onboard-staff`,
        body: { transformedData },
      },
    ]);

    return {
      success: true,
      count: transformedData.length,
    };
  } catch (error) {
    console.error("Bulk staff creation failed:", error);
    Sentry.captureException(error);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(error)
          : "Something went wrong! Kindly check your data",
    };
  }
};
