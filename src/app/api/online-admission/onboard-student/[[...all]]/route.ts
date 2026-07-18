/** biome-ignore-all assist/source/organizeImports: reason */
import type { Levels } from "@/lib/constants";
import { generatePassword } from "@/lib/generatePassword";
import { prisma } from "@/lib/prisma";
import { triggerServerNotification } from "@/lib/pusher";
import { env } from "@/lib/server-only-actions/validate-env";
import type { singleStudentType } from "@/lib/types";
import { createUserCredentials } from "@/utils/create-user-credentials";
import {
  CONSTANTS,
  type Department,
  generateStudentIndex,
} from "@/utils/generateStudentIndex";
import { createWorkflow, serveMany } from "@upstash/workflow/dist/nextjs";
import { revalidateTag } from "next/cache";
import { singleStudentEmailWorkflow } from "../../../onboard/single-student/[[...all]]/route";

const onlineAdmissionStudentOnboardingWorkflow = createWorkflow<
  singleStudentType & {
    jhsIndexNumber: string;
    residentialStatus: "Day" | "Boarding";
  },
  unknown
>(async (ctx) => {
  const { data, jhsIndexNumber, residentialStatus } = ctx.requestPayload;

  const channelName = `userId-${data.userId}`;
  const password = generatePassword();
  const admissionYear = new Date(data.dateEnrolled).getFullYear();

  const createdUser = await ctx.run(
    `student_with_ID_${data.userId}_login_credentials_creation`,
    async () => {
      return await createUserCredentials({
        email: data.email,
        username:
          data.firstName +
          String(Math.floor(Math.random() * 1000)).padStart(2, "00"),
        password: password,
        roleId: data.roleId,
        lastName: data.lastName,
      });
    },
  );

  const createdStudent = await ctx.run(
    `student_with_ID_${data.userId}_onboarding_process`,
    async () => {
      const result = await prisma.$transaction(
        async (tsx) => {
          // 1. Calculate the house distribution using allocations instead of the direct student link
          const distribution = await tsx.house.findMany({
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  allocations: {
                    where: { student: { gender: data.gender } },
                  },
                },
              },
            },
            orderBy: { name: "asc" },
          });

          const minCount = Math.min(
            ...distribution.map((h) => h._count.allocations),
          );

          const targetHostel = distribution.find(
            (h) => h._count.allocations === minCount,
          );

          const rooms = await tsx.room.findMany({
            where: {
              houseId: targetHostel?.id,
              rmGender: data.gender === "male" ? "MALE" : "FEMALE",
            },
            select: {
              id: true,
              code: true,
              _count: {
                select: { students: { where: { gender: data.gender } } },
              },
            },
            orderBy: { code: "asc" },
          });

          const minRoomCount = Math.min(...rooms.map((r) => r._count.students));

          const targetRoom = rooms.find(
            (r) => r._count.students === minRoomCount,
          );
          const { userId, roleId, classId, departmentId, email, ...rest } =
            data;

          const latestStudent = await tsx.student.findFirst({
            where: {
              departmentId: data.departmentId,
              dateEnrolled: {
                gte: new Date(admissionYear, 0, 1),
                lt: new Date(admissionYear + 1, 0, 1),
              },
            },
            orderBy: { studentNumber: "desc" },
            select: { studentNumber: true },
          });

          const sequence = latestStudent
            ? (parseInt(
                latestStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH),
                10,
              ) || 0) + 1
            : 1;

          const studentID = generateStudentIndex({
            department: (
              await tsx.department.findUnique({
                where: { id: data.departmentId as string },
                select: { name: true },
              })
            )?.name as Department,
            admissionYear,
            sequenceNumber: sequence,
          });

          const student = await tsx.student.create({
            data: {
              ...rest,
              studentNumber: studentID,
              jhsIndexNumber: jhsIndexNumber,
              currentLevel: rest.currentLevel as (typeof Levels)[number],

              room:
                residentialStatus === "Boarding" && targetRoom
                  ? { connect: { id: targetRoom.id } }
                  : undefined,

              currentClass: { connect: { id: classId as string } },
              department: { connect: { id: departmentId as string } },
              user: createdUser
                ? { connect: { id: createdUser.user.id } }
                : undefined,
            },
          });

          if (student && targetHostel) {
            await tsx.allocation.create({
              data: {
                houseId: targetHostel.id,
                studentId: student.id,
                status: residentialStatus || "Day",
              },
            });
          }

          if (student && classId) {
            await tsx.class.update({
              where: { id: classId },
              data: { currentEnrollment: { increment: 1 } },
            });
          }

          return student;
        },
        { isolationLevel: "Serializable" },
      );
      return result;
    },
  );

  await ctx.run(
    `student_with_ID_${data.userId}_successful_onboard`,
    async () => {
      revalidateTag("students-list", "max");
      revalidateTag("users-list", "max");
      revalidateTag("houses", "max");
      await triggerServerNotification(
        channelName,
        "online-admission-onboarding-complete",
        {
          message:
            "Recently admitted student has been onboarded onto the School management system.",
          type: "success",
        },
      );
    },
  );

  await ctx.invoke(`user_with_ID_${data.userId}_email_invoked`, {
    workflow: singleStudentEmailWorkflow,
    body: {
      emailData: {
        to: [createdUser.user.email],
        username: createdStudent.firstName,
        data: {
          email: createdUser.user.email,
          lastName: createdStudent.lastName,
          password,
        },
      },
      source: "student",
      userId: data.userId,
    },
  });
});

export const { POST } = serveMany(
  {
    onlineAdmissionStudentOnboardingWorkflow,
    singleStudentEmailWorkflow,
  },
  {
    baseUrl: `${env.UPSTASH_WORKFLOW_URL}`,
    async failureFunction(failureData) {
      const { data } = failureData.context.requestPayload as singleStudentType;

      console.log(failureData.context.requestPayload);

      await triggerServerNotification(
        `userId_${data.userId}`,
        "online-admission-onboarding-failed",
        {
          message: "Failed to onboard admitted student",
          type: "error",
        },
      );
    },
  },
);
