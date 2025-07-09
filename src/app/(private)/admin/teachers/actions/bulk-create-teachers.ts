"use server";

import { prisma } from "@/lib/prisma";
import {
  BulkCreateTeachersSchema,
  BulkCreateTeachersType,
} from "@/lib/validation";
import { revalidatePath } from "next/cache";
import argon2 from "argon2";
import { generatePassword } from "@/lib/generatePassword";
import { sendMail } from "@/lib/resend-config";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { hasPermissions } from "@/lib/hasPermission";

export const bulkCreateTeachers = async (values: BulkCreateTeachersType) => {
  try {
    const permission = await hasPermissions("create:teacher");
    const errors: string[] = [];

    if (!permission) throw new Error("Unauthorized!");

    const { data, error, success } = BulkCreateTeachersSchema.safeParse(values);

    if (!success) {
      const zodErrors = error.issues.map((issue) => ({
        field: [issue.path.join(".")],
        message: issue.message,
      }));

      return {
        errors: zodErrors.map((error) => `${error.field}: ${error.message}`),
      };
    }

    const normalizedTeachers = data.data.map((teacher) => ({
      ...teacher,
      licencedNumber:
        teacher.licencedNumber?.trim() === ""
          ? null
          : teacher.licencedNumber?.trim(),
      rgNumber:
        teacher.rgNumber?.trim() === "" ? null : teacher.rgNumber?.trim(),
      ghcardNumber:
        teacher.ghcardNumber?.trim() === ""
          ? null
          : teacher.ghcardNumber?.trim(),
      ssnitNumber:
        teacher.ssnitNumber?.trim() === "" ? null : teacher.ssnitNumber?.trim(),
      employeeId:
        teacher.employeeId?.trim() === "" ? null : teacher.employeeId?.trim(),
      password: generatePassword(),
    }));

    const emails = normalizedTeachers.map((teacher) => teacher.email);
    const userNames = normalizedTeachers.map((teacher) => teacher.username);
    const rgNumbers = normalizedTeachers
      .map((teacher) => teacher.rgNumber)
      .filter(Boolean);
    const licencedNumbers = normalizedTeachers
      .map((teacher) => teacher.licencedNumber)
      .filter(Boolean);
    const ssnitNumbers = normalizedTeachers
      .map((teacher) => teacher.ssnitNumber)
      .filter(Boolean);
    const ghcardNumbers = normalizedTeachers
      .map((teacher) => teacher.ghcardNumber)
      .filter(Boolean);
    const employeeIds = normalizedTeachers
      .map((teacher) => teacher.employeeId)
      .filter(Boolean);

    const departments = normalizedTeachers.map(
      (teacher) => teacher.departmentId
    );

    const [existingUsers, existingTeachers, existingDepartments, teacherRole] =
      await prisma.$transaction([
        prisma.user.findMany({
          where: {
            OR: [
              { email: { in: emails as string[] } },
              { username: { in: userNames as string[] } },
            ],
          },
        }),

        prisma.teacher.findMany({
          where: {
            OR: [
              { employeeId: { in: employeeIds as string[] } },
              { rgNumber: { in: rgNumbers as string[] } },
              { ghcardNumber: { in: ghcardNumbers as string[] } },
              { licencedNumber: { in: licencedNumbers as string[] } },
              { ssnitNumber: { in: ssnitNumbers as string[] } },
            ],
          },
        }),

        prisma.department.findMany({
          where: {
            name: { in: departments as string[] },
          },
        }),
        prisma.role.findFirst({
          where: { name: "teacher" },
          select: { id: true },
        }),
      ]);

    if (!teacherRole) {
      throw new Error("Teacher role not found!");
    }

    if (existingUsers.length > 0) {
      existingUsers.forEach((user) => {
        const { username, email } = user;

        if (emails.includes(email)) {
          errors.push(`Email '${email}' already exists!`);
        }
        if (userNames.includes(username)) {
          errors.push(`Username '${username}' already exists!`);
        }
      });
    }

    if (existingTeachers.length > 0) {
      existingTeachers.forEach((teacher) => {
        const {
          employeeId,
          licencedNumber,
          rgNumber,
          ghcardNumber,
          ssnitNumber,
        } = teacher;
        if (employeeIds.includes(employeeId)) {
          errors.push(`Staff ID '${employeeId}' already exists!'`);
        }
        if (licencedNumbers.includes(licencedNumber)) {
          errors.push(`Licenced number '${licencedNumber}' already exists!`);
        }
        if (rgNumbers.includes(rgNumber)) {
          errors.push(`Registered No. '${rgNumber}' already exists!'`);
        }

        if (ghcardNumbers.includes(ghcardNumber)) {
          errors.push(`Ghana Card No. '${ghcardNumber}' already exists!'`);
        }
        if (ssnitNumbers.includes(ssnitNumber)) {
          errors.push(`SSNIT No. '${ssnitNumber}' already exists!'`);
        }
      });
    }

    if (errors.length > 0) return { errors };

    const departmentMap = existingDepartments.reduce((map, dept) => {
      map[dept.name] = dept.id;
      return map;
    }, {} as Record<string, string>);

    normalizedTeachers.forEach((teacher) => {
      const departmentId = teacher.departmentId as string;
      if (departmentMap[departmentId]) {
        teacher.departmentId = departmentMap[departmentId];
      }
    });

    const hashedTeachers = await Promise.all(
      normalizedTeachers.map(async (teacher) => ({
        ...teacher,
        password: await argon2.hash(teacher.password, {
          type: argon2.argon2id,
        }),
      }))
    );

    const createdTeachers = await prisma.$transaction(
      hashedTeachers.map((teacher) =>
        prisma.teacher.create({
          data: {
            phone: teacher.phone,
            gender: teacher.gender,
            maritalStatus: teacher.maritalStatus,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            middleName: teacher.middleName,
            licencedNumber: teacher.licencedNumber,
            rgNumber: teacher.rgNumber,
            ghcardNumber: teacher.ghcardNumber,
            ssnitNumber: teacher.ssnitNumber,
            employeeId: teacher.employeeId as string,
            rank: teacher.rank,
            academicQual: teacher.academicQual,
            departmentId: undefined,
            birthDate: new Date(teacher.birthDate),
            dateOfFirstAppointment: teacher.dateOfFirstAppointment
              ? new Date(teacher.dateOfFirstAppointment)
              : undefined,
            department: teacher.departmentId
              ? {
                  connect: { id: teacher.departmentId },
                }
              : undefined,
            user: {
              create: {
                email: teacher.email as string,
                username: teacher.username as string,
                password: teacher.password,
                resetPasswordRequired: true,
                roleId: teacherRole.id,
              },
            },
          },
        })
      )
    );

    await Promise.all(
      normalizedTeachers.map((teacher) =>
        sendMail({
          to: [teacher.email as string],
          data: {
            email: teacher.email as string,
            lastName: teacher.lastName,
            password: teacher.password,
          },
          username: teacher.username as string,
        })
      )
    );

    return { count: createdTeachers.length };
  } catch (error) {
    console.error("Could upload teachers: ", error);
    return {
      error: getErrorMessage(error),
    };
  } finally {
    revalidatePath("/teachers");
  }
};
