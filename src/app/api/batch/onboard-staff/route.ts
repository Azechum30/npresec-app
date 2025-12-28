import { checkEntityExistencePossibleDuplicates } from "@/app/(private)/(admin)/admin/staff/utils/check-enity-existence-possible-duplicates";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { UserResponseType } from "@/lib/types";
import { createUserCredentials } from "@/utils/create-user-credentials";
import { client } from "@/utils/qstash";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { compensateAndCleanup } from "@/app/(private)/(admin)/admin/staff/utils/compensate-and-cleanup";

type UserT = Pick<UserResponseType, "email" | "id" | "username">;

type UserWithIndexT = {
  user: UserT;
  originalIndex: number;
};

const handler = async (req: NextRequest) => {
  console.log("Received batch onboard staff request");
  try {
    const { transformedData } = (await req.json()) as Awaited<
      ReturnType<typeof checkEntityExistencePossibleDuplicates>
    >;

    const batchSize = 20;
    const totalBatches = Math.ceil(transformedData.length / batchSize);
    let createdUsers = [] as UserWithIndexT[];

    // chunked user creation to avoid overwhelming the auth service

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * batchSize;
      const chunk = transformedData.slice(start, start + batchSize);

      const createdUsersChunk = await Promise.all(
        chunk.map(async (staffData, idx) => {
          try {
            const { email, username, password, roleId, lastName } = staffData;
            const existingUser = await prisma.user.findUnique({
              where: { email },
            });

            const { user } = existingUser
              ? { user: existingUser }
              : await createUserCredentials({
                  email,
                  username,
                  password,
                  roleId,
                  lastName,
                });

            return { user, originalIndex: start + idx };
          } catch (err) {
            console.error(`Failed to create user for ${staffData.email}`, err);
            return null;
          }
        })
      );
      const filteredUsers = createdUsersChunk.filter((user) => user !== null);

      createdUsers.push(...filteredUsers);
    }

    // Create staff records
    const staffRecords = await prisma.staff.createMany({
      data: createdUsers.filter(Boolean).map(({ user, originalIndex }) => {
        const staffData = transformedData[originalIndex];
        const { imageURL, email, username, roleId, password, ...rest } =
          staffData;
        return {
          ...rest,
          employeeId: rest.employeeId,
          firstName: rest.firstName,
          lastName: rest.lastName,
          birthDate: new Date(rest.birthDate),
          dateOfFirstAppointment: rest.dateOfFirstAppointment
            ? new Date(rest.dateOfFirstAppointment)
            : undefined,
          staffType: rest.staffType,
          staffCategory: rest.staffCategory,
          gender: rest.gender,
          phone: rest.phone,
          departmentId: rest.departmentId,
          userId: user!.id,
        };
      }),
      skipDuplicates: true,
    });

    if (!staffRecords.count || staffRecords.count < createdUsers.length) {
      const userIds = createdUsers.map((u) => u.user.id);
      const employeeIds = transformedData.map((e) => e.employeeId);

      void client.batchJSON([
        {
          url: `${env.NEXT_PUBLIC_URL}/api/staff/cleanup`,
          body: { userIds, employeeIds },
          delay: 120000,
        },
      ]);
    }

    // Extract emails to send to users

    const emails = createdUsers.filter(Boolean).map(({ originalIndex }) => {
      const staffData = transformedData[originalIndex];
      return {
        to: [staffData.email],
        username: staffData.firstName,
        data: {
          lastName: staffData.lastName,
          email: staffData.email,
          password: staffData.password,
        },
      };
    });

    console.log("Staff records created:", staffRecords.count);

    // batch send emails using a backround job

    void client.batchJSON([
      {
        url: `${env.NEXT_PUBLIC_URL}/api/send/emails/batch`,
        body: { emails },
        retries: 3,
      },
    ]);

    void revalidateTag("staff", "seconds");

    return Response.json(
      {
        success: true,
        count: staffRecords.count,
      },
      { status: 200 }
    );
  } catch (e) {
    console.log("Error in batch onboard staff route:", e);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = verifySignatureAppRouter(handler);
