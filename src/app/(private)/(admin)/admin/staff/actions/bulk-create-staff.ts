"use server";

import { bulkRequestRateLimit } from "@/lib/arcjet";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { env } from "@/lib/server-only-actions/validate-env";
import { BulkCreateStaffSchema, BulkCreateStaffType } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { Client } from "@upstash/workflow";

const client = new Client({
  token: env.QSTASH_TOKEN,
});

export const bulkCreateStaff = async (
  values: BulkCreateStaffType,
): Promise<{
  count?: number;
  error?: string;
  success?: boolean;
}> => {
  try {
    const { user, hasPermission } = await getUserPermissions("create:staff");
    if (!user || !hasPermission) return { error: "Unauthorized access" };

    const { error } = await bulkRequestRateLimit(user.id);

    if (error) {
      return { error };
    }

    const validationResult = BulkCreateStaffSchema.safeParse(values);
    if (!validationResult.success) {
      return {
        error: validationResult.error.issues
          .map((i) => `Row ${Number(i.path[1]) + 1}: ${i.message}`)
          .join("; "),
      };
    }

    const workflowUrl = `${env.UPSTASH_WORKFLOW_URL}/api/batch/onboard-staff/staffCreationWorkflow`;

    await client.trigger({
      url: workflowUrl,
      body: {
        rawData: validationResult.data,
        userId: user.id,
        source: "staff",
      },
    });

    return {
      success: true,
      count: validationResult.data.data.length,
    };
  } catch (error) {
    Sentry.captureException(error);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(error)
          : "Failed to initiate bulk data processing",
    };
  }
};
