import { NextRequest } from "next/server";
import {
  createStaffInBulk,
  getBulkCreationData,
} from "@/lib/services/staff.service";
import { transformStaffData } from "@/utils/staff-data-transformer";
import { createStaffUser } from "@/lib/services/user.service";
import { prepareWelcomeEmails } from "@/utils/email-helpers";
import { client } from "@/utils/qstash";
import { env } from "@/lib/server-only-actions/validate-env";
import { BulkCreateStaffType } from "@/lib/validation";

export const POST = async (req: NextRequest) => {
  try {
    const { data } = (await req.json()) as BulkCreateStaffType;

    const [departments, classes, courses, roles] = await getBulkCreationData(
      data
    );

    const { dataWithIds, missingDepartments, missingClasses, missingCourses } =
      transformStaffData(data, departments, classes, courses);

    const roleMap = new Map(roles.map((r) => [r.name, r.id]));
    const createdUsers = await Promise.all(
      dataWithIds.map((staffData) => createStaffUser(staffData, roleMap))
    );

    const staffToCreate = createdUsers.filter(Boolean).map((user, idx) => {
      const staffData = dataWithIds[idx];

      const { username, email, imageURL, classes, courses, ...rest } =
        staffData;

      return {
        ...rest,
        userId: user!.id,
        birthDate: new Date(rest.birthDate),
        dateOfFirstAppointment:
          rest.dateOfFirstAppointment && new Date(rest.dateOfFirstAppointment),
        departmentId: rest.departmentId,
      };
    });

    const createdStaff = await createStaffInBulk(staffToCreate);

    const userEmails = prepareWelcomeEmails(createdUsers, dataWithIds);

    client.publishJSON({
      url: `${env.NEXT_PUBLIC_URL}/api/send/emails/batch`,
      body: { emails: userEmails },
    });

    return Response.json({
      success: true,
      count: createdStaff.count,
      missing: {
        departments: [...new Set(missingDepartments)],
        courses: [...new Set(missingCourses)],
        classes: [...new Set(missingClasses)],
      },
    });
  } catch (e) {
    console.error("Failed to process job:", e);
    return Response.json({ error: "Internal server error" });
  }
};
