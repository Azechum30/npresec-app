import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { commonErrors } from "@/lib/commonErrors";
import { Levels } from "@/lib/constants";
import { generatePassword } from "@/lib/generatePassword";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { status, StudentSchema } from "@/lib/validation";
import { authMiddleware } from "@/middlewares/auth";
import { requirePermissions } from "@/middlewares/permissions";
import {
  CONSTANTS,
  Department,
  generateStudentIndex,
} from "@/utils/generateStudentIndex";
import { client } from "@/utils/qstash";
import { z } from "zod";

export const createStudent = authMiddleware
  .use(requirePermissions("create:users"))
  .input(StudentSchema)
  .output(z.object({ success: z.boolean() }))
  .errors({
    ...commonErrors,
  })
  .handler(async ({ input, errors }) => {
    try {
      const createdStudent = await prisma.$transaction(async (ctx) => {
        const admissionYear = new Date(input.dateEnrolled).getFullYear();

        const department = await ctx.department.findUnique({
          where: { id: input.departmentId as string },
          select: {
            id: true,
            name: true,
          },
        });

        const studentRole = await ctx.role.findFirst({
          where: { name: "student" },
        });

        if (!studentRole)
          throw errors.NOT_FOUND({ message: "student role does not exist" });

        if (!department)
          throw errors.NOT_FOUND({
            message: "The selected department does not exist",
          });

        const lastStudent = await ctx.student.findFirst({
          where: {
            departmentId: department.id,
            dateEnrolled: {
              gte: new Date(admissionYear, 0, 1),
              lte: new Date(admissionYear + 1, 0, 1),
            },
          },

          orderBy: {
            studentNumber: "desc",
          },
          select: {
            studentNumber: true,
          },
        });

        const sequenceNumber = lastStudent
          ? Number.isNaN(
              parseInt(
                lastStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH)
              )
            )
            ? 1
            : parseInt(
                lastStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH)
              ) + 1
          : 1;

        const { email, photoURL, imageFile, classId, departmentId, ...rest } =
          input;

        const generatedIndexNumber = generateStudentIndex({
          department: department.name as Department,
          admissionYear: admissionYear,
          sequenceNumber: sequenceNumber,
        });

        const generatedPassword = generatePassword();

        const { user } = await auth.api.signUpEmail({
          body: {
            email: email.toLowerCase(),
            password: generatedPassword,
            name: email.split("@")[0],
            username: email.split("@")[0],
          },
        });

        if (!user)
          throw errors.NOT_FOUND({
            message: "Could not create student credentials",
          });

        await ctx.user.update({
          where: { id: user.id },
          data: {
            roleId: studentRole.id,
          },
        });

        const student = await ctx.student.create({
          data: {
            ...rest,
            studentNumber: generatedIndexNumber,
            currentLevel: rest.currentLevel as (typeof Levels)[number],
            status: rest.status as (typeof status)[number],
            userId: user.id,
            departmentId: departmentId,
            classId: classId,
          },
        });

        if (imageFile instanceof File) {
          const imageBuffer = await imageFile.arrayBuffer();
          const buffer = Buffer.from(imageBuffer);

          const ImageUploadData = {
            file: {
              buffer: buffer.toString("base64"),
              name: imageFile.name,
              type: imageFile.type,
            },

            entityType: "user" as const,
            entityId: student.userId,
            folder: "students",
          };

          await client.publishJSON({
            url: `${env.NEXT_PUBLIC_URL}/api/images/uploads`,
            body: ImageUploadData,
          });
        }

        const emailBody = {
          to: [email],
          username: student.lastName,
          data: {
            email: email,
            lastName: student.firstName,
            password: generatePassword,
          },
        };

        await client.publishJSON({
          url: `${env.NEXT_PUBLIC_URL}/api/send/mails`,
          body: emailBody,
        });

        return { sucess: true };
      });

      return { success: true };
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case "P2002":
            throw errors.UNIQUE_CONSTRAINT();
          case "P2003":
            throw errors.FOREIGN_KEY_ERROR();
          case "P2025":
            throw errors.BAD_REQUEST();
        }
      } else if (err instanceof Prisma.PrismaClientValidationError) {
        throw errors.BAD_REQUEST;
      }
      throw err;
    }
  });
