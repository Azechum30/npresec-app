"use server";

import { generatePassword } from "@/lib/generatePassword";
import { hasPermissions } from "@/lib/hasPermission";
import { prisma } from "@/lib/prisma";
import {
  BulkCreateStudentsSchema,
  BulkCreateStudentsType,
  EditStudentSchema,
  EditStudentType,
  StudentSchema,
  StudentType,
} from "@/lib/validation";
import {
  CONSTANTS,
  Department,
  generateStudentIndex,
} from "@/utils/generateStudentIndex";
import argon from "argon2";
import { Levels } from "@/lib/constants";
import { status } from "@/lib/validation";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { sendMail } from "@/lib/resend-config";
import { env } from "@/lib/server-only-actions/validate-env";
import { Prisma } from "@prisma/client";
import { StudentResponseType, StudentSelect } from "@/lib/types";
import * as Sentry from "@sentry/nextjs";
import moment from "moment";
import { revalidatePath } from "next/cache";

import { writeFile } from "fs/promises";
import path from "path";

export const createStudent = async (values: StudentType) => {
  try {
    const permission = await hasPermissions("create:student");

    if (!permission) throw new Error("Permission denied!");

    const result = StudentSchema.safeParse(values);

    if (!result.success) {
      const zodErrors = result.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {} as Record<string, string>);

      return { error: zodErrors };
    }

    const [existingUser, existingDepartment, existingClass, existingRole] =
      await prisma.$transaction([
        prisma.user.findUnique({
          where: {
            email: result.data.email,
          },
        }),

        prisma.department.findUnique({
          where: {
            id: result.data.departmentId as string,
          },
        }),

        prisma.class.findUnique({
          where: {
            id: result.data.classId as string,
          },
        }),
        prisma.role.findFirst({
          where: { name: "student" },
        }),
      ]);

    if (existingUser) {
      return { error: `${existingUser.email} is already taken!` };
    }

    if (!existingClass) {
      return { error: "The selected class does not exist" };
    }

    if (!existingDepartment) {
      return { error: "The selected department does not exist" };
    }

    if (!existingRole) {
      return { error: "Role not found!" };
    }

    const password = generatePassword();
    const hashedPassword = await argon.hash(password, {
      type: argon.argon2id,
    });

    const admissionYear = new Date(result.data.dateEnrolled).getFullYear();

    const latestStudent = await prisma.student.findFirst({
      where: {
        departmentId: existingDepartment.id,
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

    const sequence = latestStudent
      ? Number.isNaN(
          parseInt(
            latestStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH)
          )
        )
        ? 1
        : parseInt(
            latestStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH)
          ) + 1
      : 1;

    const studentID = generateStudentIndex({
      department: existingDepartment.name as Department,
      admissionYear,
      sequenceNumber: sequence,
    });

    let url = "";

    if (result.data.imageFile) {
      const bytes = await result.data.imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "students",
        result.data.imageFile.name
      );

      await writeFile(filePath, buffer);

      url = "/uploads/students/" + result.data.imageFile.name;
    }

    const { email, photoURL, imageFile, classId, departmentId, ...rest } =
      result.data;

    const student = await prisma.$transaction(async (tx) => {
      const userCreated = await tx.user.create({
        data: {
          email,
          username:
            rest.lastName +
            Math.floor(Math.random() * 1000)
              .toString()
              .padStart(CONSTANTS.SEQUENCE_LENGTH, "0"),
          resetPasswordRequired: true,
          password: hashedPassword,
          roleId: existingRole.id,
          picture: imageFile ? url : undefined,
        },
      });

      return await tx.student.create({
        data: {
          ...rest,
          studentNumber: studentID,
          currentLevel: rest.currentLevel as (typeof Levels)[number],
          status: rest.status as (typeof status)[number],

          currentClass: classId
            ? {
                connect: { id: classId },
              }
            : undefined,

          department: departmentId
            ? {
                connect: { id: departmentId },
              }
            : undefined,
          user: {
            connect: {
              id: userCreated.id,
            },
          },
        },
      });
    });
    //TODO: Replace test email with student email when domain is verified!
    await sendMail({
      to: [env.RESEND_TEST_EMAIL],
      username: student.lastName,
      data: {
        email: email,
        lastName: student.firstName,
        password: password,
      },
    });

    return { student };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

export const getStudents = async (studentIDs?: string[]) => {
  try {
    const permission = await hasPermissions("view:student");
    if (!permission) throw new Error("Permission Denied!");

    let query: Prisma.StudentWhereInput = {};

    if (studentIDs) {
      query = {
        studentNumber: { in: studentIDs },
      };
    }

    const students = await prisma.student.findMany({
      where: query,
      select: StudentSelect,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!students) return { error: "No students found!" };

    return { students };
  } catch (error) {
    console.error("Could not fetch students:", error);
    Sentry.captureException(error);
    return { error: getErrorMessage(error) };
  }
};

export const bulkDeleteStudents = async (ids: string[]) => {
  try {
    const permission = await hasPermissions("delete:student");
    if (!permission) throw new Error("Permission Denied!");

    const { count } = await prisma.student.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    if (!count) return { error: "Could not delete students" };
    return { count };
  } catch (error) {
    console.error("Could not delete students:", error);
    Sentry.captureException(error);
    return { error: getErrorMessage(error) };
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const permission = hasPermissions("delete:student");
    if (!permission) throw new Error("Permission Denied!");

    const existingStudent = await prisma.student.findUnique({
      where: { id },
      select: {
        userId: true,
      },
    });

    if (!existingStudent) return { error: "No student found!" };

    const student = await prisma.user.delete({
      where: {
        id: existingStudent.userId as string,
      },
    });

    if (!student) return { error: "Could not delete student" };

    return { success: true };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Could not delete student: ", error);
    return { error: getErrorMessage(error) };
  }
};

export const getStudent = async (id: string) => {
  try {
    const permission = await hasPermissions("view:student");
    if (!permission) throw new Error("Permission Denied!");
    const student = await prisma.student.findUnique({
      where: { id },
      select: StudentSelect,
    });

    if (!student) return { error: "Could not fetch student!" };

    return { student };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Could not fetch student: ", error);
    return { error: getErrorMessage(error) };
  }
};

export const updateStudent = async (values: EditStudentType) => {
  try {
    const permission = await hasPermissions("edit:student");

    if (!permission) throw new Error("Permission denied!");

    const result = EditStudentSchema.safeParse(values);

    if (!result.success) {
      const zodError = result.error.errors.reduce((acc, issue) => {
        acc[issue.path[0]] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      return { error: zodError };
    }

    const { id, data } = result.data;
    const admissionYear = new Date(data.dateEnrolled).getFullYear();

    const [existingStudent, existingDepartment] = await prisma.$transaction([
      prisma.student.findFirst({
        where: {
          departmentId: data.departmentId,
          dateEnrolled: {
            gte: new Date(admissionYear, 0, 1),
            lte: new Date(admissionYear + 1, 0, 1),
          },
        },
        orderBy: {
          studentNumber: "desc",
        },

        select: { studentNumber: true, dateEnrolled: true },
      }),
      prisma.department.findFirst({
        where: { id: data.departmentId as string },
      }),
    ]);

    let studentNumber = "";
    const yearInDB = moment(existingStudent?.dateEnrolled)
      .format("MM/DD/YYYY")
      .split("/")
      .pop();
    const yearInRequest = moment(data.dateEnrolled)
      .format("MM/DD/YYY")
      .split("/")
      .pop();

    if (yearInDB !== yearInRequest) {
      const sequence = existingStudent?.studentNumber
        ? parseInt(
            existingStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH)
          ) + 1
        : 1;
      studentNumber = generateStudentIndex({
        department: existingDepartment?.name as Department,
        admissionYear: admissionYear,
        sequenceNumber: sequence,
      });
    }

    const cleanData = {
      ...data,
      studentNumber: studentNumber,
      departmentId: data.departmentId ?? "",
      classId: data.classId ?? "",
      currentLevel: data.currentLevel as (typeof Levels)[number],
    };
    const { email, ...transformData } = cleanData;

    await prisma.student.update({
      where: { id },
      data: {
        ...transformData,
        classId: transformData.classId ?? undefined,
        departmentId: transformData.departmentId ?? undefined,
      },
    });

    return { success: true };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Could not edit student:", error);
    return { error: getErrorMessage(error) };
  }
};

export const bulkCreateStudents = async (values: BulkCreateStudentsType) => {
  try {
    const permission = await hasPermissions("create:student");
    if (!permission) throw new Error("Permission denied!");

    const result = BulkCreateStudentsSchema.safeParse(values);

    if (!result.success) {
      const zodError = result.error.errors.map(
        (e) => `${e.path[0]}, ${e.message}`
      );

      return { error: zodError };
    }

    const { data: studentData } = result.data;

    const classNames = [
      ...new Set(studentData.map((student) => student.classId)),
    ];

    const departmentNames = [
      ...new Set(studentData.map((student) => student.departmentId)),
    ];

    const [classes, departments, studentRole] = await prisma.$transaction([
      prisma.class.findMany({
        where: { name: { in: classNames as string[] } },
        select: { id: true, name: true },
      }),
      prisma.department.findMany({
        where: { name: { in: departmentNames as string[] } },
        select: { id: true, name: true },
      }),
      prisma.role.findFirst({
        where: { name: "student" },
        select: { id: true },
      }),
    ]);

    if (!studentRole) {
      throw new Error("Role not found!");
    }

    const classMap = new Map(
      classes.map((classItem) => [classItem.name, classItem.id])
    );

    const departmentMap = new Map(
      departments.map((dept) => [dept.name, dept.id])
    );

    const createStudents: StudentResponseType[] = [];
    const errors: string[] = [];

    for (const student of studentData) {
      const classId = classMap.get(student.classId as string);
      const departmentId = departmentMap.get(student.departmentId as string);

      if (!classId) {
        errors.push(`${student.classId} does not exist`);
      }

      if (!departmentId) {
        errors.push(`${student.departmentId} does not exist`);
      }

      if (errors.length > 0) {
        return { error: errors.join("\n") };
      }

      const admissionYear = new Date(student.dateEnrolled).getFullYear();

      const latestStudent = await prisma.student.findFirst({
        where: {
          departmentId: departmentId,
          dateEnrolled: {
            gte: new Date(admissionYear, 0, 1),
            lte: new Date(admissionYear + 1, 0, 1),
          },
        },
        select: { studentNumber: true },
        orderBy: { studentNumber: "desc" },
      });

      const sequencce = latestStudent?.studentNumber
        ? isNaN(
            parseInt(
              latestStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH)
            )
          )
          ? 1
          : parseInt(
              latestStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH)
            ) + 1
        : 1;

      const studentIndex = generateStudentIndex({
        admissionYear,
        department: student.departmentId as Department,
        sequenceNumber: sequencce,
      });

      const password = generatePassword();
      const hashedPassword = await argon.hash(password, {
        type: argon.argon2id,
      });

      const createdStudent = await prisma.$transaction(async (tsx) => {
        const user = await tsx.user.create({
          data: {
            email: student.email,
            username:
              student.lastName +
              Math.floor(Math.random() * 1000)
                .toString()
                .padStart(CONSTANTS.SEQUENCE_LENGTH, "0"),
            password: hashedPassword,
            resetPasswordRequired: true,
            roleId: studentRole.id,
          },
        });

        const {
          email,
          classId: className,
          departmentId: departmentName,
          ...rest
        } = student;

        return await tsx.student.create({
          data: {
            ...rest,
            studentNumber: studentIndex,
            birthDate: new Date(rest.birthDate),
            dateEnrolled: new Date(rest.dateEnrolled),
            graduationDate: rest.graduationDate
              ? new Date(rest.graduationDate as string)
              : undefined,
            currentLevel: rest.currentLevel as (typeof Levels)[number],
            currentClass: {
              connect: { id: classId },
            },
            department: {
              connect: { id: departmentId },
            },
            user: {
              connect: { id: user.id },
            },
          },
          select: StudentSelect,
        });
      });

      createStudents.push(createdStudent);

      //TODO replace with student email if domain is configured with resend;

      await sendMail({
        to: [env.RESEND_TEST_EMAIL],
        username: student.lastName,
        data: {
          email: student.email,
          lastName: student.firstName,
          password: password,
        },
      });
    }

    return { count: createStudents.length };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Could not create students:", error);
    return { error: getErrorMessage(error) };
  } finally {
    revalidatePath("/admin/students");
  }
};
