"use server";

import { Prisma } from "@/generated/prisma/client";
import { computeGraduationDate } from "@/lib/compute-graduation-date";
import { generatePassword } from "@/lib/generatePassword";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { triggerSendEmail } from "@/lib/trigger-send-email";
import { StudentSelect } from "@/lib/types";
import {
  BulkCreateStudentsType,
  EditStudentSchema,
  EditStudentType,
  status,
  StudentSchema,
  StudentType,
} from "@/lib/validation";
import { createUserCredentials } from "@/utils/create-user-credentials";
import {
  CONSTANTS,
  Department,
  generateStudentIndex,
  gradelevels,
} from "@/utils/generateStudentIndex";
import { getCachedStudentService } from "@/utils/get-cached-student-service";
import { getError } from "@/utils/get-error";
import { client } from "@/utils/qstash";
import { triggerRollback } from "@/utils/trigger-better-auth-user-delete";
import { triggerImageUpload } from "@/utils/trigger-image-upload";
import * as Sentry from "@sentry/nextjs";
import { updateTag } from "next/cache";
import { validateAndTransformStudentsData } from "../utils/validate-and-transform-students-data";

export const createStudent = async (values: StudentType) => {
  let createdUserId: string | null = null;

  try {
    // 1. Parallel Authorization and Pre-checks
    const [{ hasPermission }, role, existingUser] = await Promise.all([
      getUserPermissions("create:students"),
      prisma.role.findFirst({ where: { name: "student" } }),
      prisma.user.findUnique({
        where: { email: values.email },
        select: { email: true },
      }),
    ]);

    if (!hasPermission) return { error: "Permission denied!" };
    if (existingUser) return { error: `${values.email} is already taken!` };
    if (!role) return { error: "Student role not found in system." };

    // 2. Validation
    const result = StudentSchema.safeParse(values);
    if (!result.success) {
      return {
        error: result.error.errors
          .map((e) => `${e.path[0]}: ${e.message}`)
          .join(", "),
      };
    }

    const { email, imageFile, classId, departmentId, photoURL, ...rest } =
      result.data;
    const password = generatePassword();
    const admissionYear = new Date(rest.dateEnrolled).getFullYear();

    const authResponse = await createUserCredentials({
      email,
      username: `${rest.firstName} ${rest.lastName}`,
      lastName: rest.lastName,
      roleId: role.id,
      password,
    });

    if (!authResponse?.user)
      return { error: "Failed to create authentication credentials" };
    createdUserId = authResponse.user.id;

    const transactionResult = await prisma.$transaction(async (tx) => {
      const latestStudent = await tx.student.findFirst({
        where: {
          departmentId,
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
          ) || 0) + 1
        : 1;

      const studentID = generateStudentIndex({
        department: (
          await tx.department.findUnique({
            where: { id: departmentId as string },
            select: { name: true },
          })
        )?.name as Department,
        admissionYear,
        sequenceNumber: sequence,
      });

      // Create Student and Connect User
      const createdStudent = await tx.student.create({
        data: {
          ...rest,
          studentNumber: studentID,
          currentLevel: rest.currentLevel as (typeof gradelevels)[number],
          status: rest.status as (typeof status)[number],
          graduationDate: computeGraduationDate(rest.dateEnrolled),
          currentClass: { connect: { id: classId as string } },
          department: { connect: { id: departmentId as string } },
          user: { connect: { id: authResponse.user.id } },
        },
      });

      classId &&
        (await tx.class.update({
          where: { id: classId },
          data: { currentEnrollment: { increment: 1 } },
        }));

      return createdStudent;
    });

    if (imageFile instanceof File) {
      void triggerImageUpload(
        imageFile,
        transactionResult.id,
        "students",
        "user",
      );
    }

    void triggerSendEmail({
      to: [email],
      username: rest.lastName,
      data: { email, lastName: rest.firstName, password },
    });

    updateTag("students-list");
    updateTag("users-list");

    return { createdStudent: transactionResult };
  } catch (error) {
    if (createdUserId) {
      console.error(`Transaction failed. Rolling back user: ${createdUserId}`);

      await triggerRollback(createdUserId).catch((err) =>
        console.error("Critical: Rollback failed", err),
      );
    }

    console.error("[CREATE_STUDENT_ERROR]:", error);
    return { error: getError(error) };
  }
};

export const getStudents = async (studentIDs?: string[]) => {
  try {
    const { hasPermission } = await getUserPermissions("view:students");
    if (!hasPermission) return { error: "Permission denied" };

    let query: Prisma.StudentWhereInput = {};

    if (studentIDs) {
      query = {
        studentNumber: { in: studentIDs },
      };
    }

    const students = await getCachedStudentService();

    return { students: students ?? [] };
  } catch (error) {
    console.error("Could not fetch students:", error);
    Sentry.captureException(error);
    return { error: getError(error) };
  }
};

export const bulkDeleteStudents = async (ids: string[]) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:students");
    if (!hasPermission) return { error: "Permission denied" };

    const studentsToDelete = await prisma.student.findMany({
      where: { id: { in: ids } },
      select: { classId: true, userId: true },
    });

    if (studentsToDelete.length === 0) return { count: 0 };

    const classDecrementMap: Record<string, number> = {};
    const userIds: string[] = [];

    for (const student of studentsToDelete) {
      if (student.userId) userIds.push(student.userId);
      if (student.classId) {
        classDecrementMap[student.classId] =
          (classDecrementMap[student.classId] || 0) + 1;
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      for (const [classId, decrementCount] of Object.entries(
        classDecrementMap,
      )) {
        await tx.class.update({
          where: { id: classId },
          data: { currentEnrollment: { decrement: decrementCount } },
        });
      }

      return await tx.user.deleteMany({
        where: { id: { in: userIds } },
      });
    });

    updateTag("students-list");
    updateTag("users-list");

    console.info(
      `[BULK_DELETE] Successfully deleted ${result.count} users and updated ${Object.keys(classDecrementMap).length} classes.`,
    );

    return { count: result.count };
  } catch (error) {
    console.error("[BULK_DELETE_ERROR]:", error);
    Sentry.captureException(error);
    return {
      error: getError(error),
    };
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:students");
    if (!hasPermission) return { error: "Permission denied" };

    const existingStudent = await prisma.student.findUnique({
      where: { id },
      select: {
        userId: true,
        classId: true,
      },
    });

    if (!existingStudent) return { error: "No student found!" };

    await prisma.$transaction(async (tsx) => {
      await tsx.class.update({
        where: { id: existingStudent.classId as string },
        data: { currentEnrollment: { decrement: 1 } },
      });

      return await tsx.user.delete({
        where: {
          id: existingStudent.userId as string,
        },
      });
    });

    updateTag("students-list");
    updateTag("users-list");

    return { success: true };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Could not delete student: ", error);
    return { error: getError(error) };
  }
};

export const getStudent = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:students");
    if (!hasPermission) return { error: "Permission denied!" };

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
    const { hasPermission } = await getUserPermissions("edit:students");
    if (!hasPermission) return { error: "Permission denied" };

    const result = EditStudentSchema.safeParse(values);
    if (!result.success) {
      return {
        error: result.error.errors
          .map((e) => `${e.path[0]}: ${e.message}`)
          .join(", "),
      };
    }

    const { id, data } = result.data;
    const admissionYear = new Date(data.dateEnrolled).getFullYear();

    const transactionResult = await prisma.$transaction(async (tx) => {
      // Fetch current state to check for changes (Class, Enrollment Year, Department)
      const current = await tx.student.findUnique({
        where: { id },
        include: { currentClass: true, department: true },
      });

      if (!current) throw new Error("Student not found");

      let studentNumber = current.studentNumber;

      const yearInDB = new Date(current.dateEnrolled).getFullYear();
      if (yearInDB !== admissionYear) {
        console.info(
          `[UPDATE_STUDENT] Re-indexing ${current.studentNumber} due to enrollment year change.`,
        );

        const latest = await tx.student.findFirst({
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

        const sequence = latest
          ? (parseInt(latest.studentNumber.slice(-3)) || 0) + 1
          : 1;
        const dept = await tx.department.findUnique({
          where: { id: data.departmentId as string },
        });

        studentNumber = generateStudentIndex({
          department: dept?.name as Department,
          admissionYear,
          sequenceNumber: sequence,
        });
      }

      if (current.classId !== data.classId) {
        if (data.classId) {
          const newClass = await tx.class.findUnique({
            where: { id: data.classId },
            select: { name: true, maxCapacity: true, currentEnrollment: true },
          });

          if (!newClass) throw new Error("Target class does not exist");
          if (
            newClass.maxCapacity &&
            newClass.currentEnrollment >= newClass.maxCapacity
          ) {
            throw new Error(`Class "${newClass.name}" is at maximum capacity.`);
          }

          // Increment new class
          await tx.class.update({
            where: { id: data.classId },
            data: { currentEnrollment: { increment: 1 } },
          });
        }

        // Decrement old class
        if (current.classId) {
          await tx.class.update({
            where: { id: current.classId },
            data: { currentEnrollment: { decrement: 1 } },
          });
        }
      }
      const { imageFile, classId, departmentId, photoURL, email, ...rest } =
        data;

      const updated = await tx.student.update({
        where: { id },
        data: {
          ...rest,
          studentNumber,
          graduationDate: computeGraduationDate(data.dateEnrolled),
          classId: classId as string,
          departmentId: departmentId,
          currentLevel: rest.currentLevel as (typeof gradelevels)[number],
        },
        select: { userId: true },
      });

      return updated;
    });

    if (data.imageFile instanceof File && transactionResult.userId) {
      console.log(
        `[UPDATE_STUDENT] Triggering image upload for User: ${transactionResult.userId}`,
      );
      void triggerImageUpload(
        data.imageFile,
        transactionResult.userId,
        "students",
        "user",
      );
    }

    updateTag("students-list");

    return { success: true };
  } catch (error: any) {
    console.error("[UPDATE_STUDENT_ERROR]:", error.message);
    Sentry.captureException(error);
    return { error: getError(error) };
  }
};

export const bulkCreateStudents = async (values: BulkCreateStudentsType) => {
  try {
    const { hasPermission } = await getUserPermissions("create:students");
    if (!hasPermission) return { error: "Permission denied" };

    const result = validateAndTransformStudentsData(values);
    if (result.errors) {
      return {
        errors: result.errors.flatMap((e) => `Row ${e.row}: ${e.message}`),
      };
    }

    void client.batchJSON([
      {
        url: `${env.NEXT_PUBLIC_URL}/api/batch/students/create`,
        body: { data: result.data },
      },
    ]);

    return {
      success: true,
      message: "Bulk processing started.",
      count: result.data?.data.length as number,
    };
  } catch (error) {
    return { error: getError(error) };
  }
};
