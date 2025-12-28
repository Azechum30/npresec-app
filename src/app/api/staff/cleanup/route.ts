import { compensateAndCleanup } from "@/app/(private)/(admin)/admin/staff/utils/compensate-and-cleanup";
import { NextRequest } from "next/server";

import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";

const handler = async (req: NextRequest) => {
  console.log("Cleanup request received");
  try {
    const { userIds, employeeIds } = (await req.json()) as {
      userIds: string[];
      employeeIds: string[];
    };

    if (!userIds || !employeeIds) {
      console.error("User IDs and Employee IDs are required!");
      return Response.json({
        error: "User IDs and Employee IDs are required!",
      });
    }

    await compensateAndCleanup(userIds, employeeIds);
    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("Could not clean up orphan users", e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST = verifySignatureAppRouter(handler);
