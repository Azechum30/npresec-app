"use server";

import { Prisma } from "@/generated/prisma/client";
import { computeGraduationDate } from "@/lib/compute-graduation-date";
import { generatePassword } from "@/lib/generatePassword";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { workflowClient } from "@/lib/server-only-actions/workflow";
import { StudentSelect } from "@/lib/types";
import {
  BulkCreateStudentsType,
  EditStudentSchema,
  EditStudentType,
  StudentSchema,
  StudentType,
} from "@/lib/validation";
import {
  Department,
  generateStudentIndex,
  gradelevels,
} from "@/utils/generateStudentIndex";
import { getCachedStudentService } from "@/utils/get-cached-student-service";
import { getError } from "@/utils/get-error";
import { triggerRollback } from "@/utils/trigger-better-auth-user-delete";
import { triggerImageUpload } from "@/utils/trigger-image-upload";
import * as Sentry from "@sentry/nextjs";
import { updateTag } from "next/cache";
import { filterBools } from "../../staff/utils/check-existing-related-records";
import { validateAndTransformStudentsData } from "../utils/validate-and-transform-students-data";

export const createStudent = async (values: StudentType) => {
  let createdUserId: string | null = null;

  try {
    const [{ user, hasPermission }, role, existingUser] = await Promise.all([
      getUserPermissions("create:students"),
      prisma.role.findFirst({ where: { name: "student" } }),
      prisma.user.findUnique({
        where: { email: values.email },
        select: { email: true },
      }),
    ]);

    if (!hasPermission || !user) return { error: "Permission denied!" };
    if (existingUser) return { error: `${values.email} is already taken!` };
    if (!role) return { error: "Student role not found in system." };

    // 2. Validation
    const result = StudentSchema.safeParse(values);
    if (!result.success) {
      return {
        error: result.error.message,
      };
    }

    const { email, imageFile, classId, departmentId, photoURL, ...rest } =
      result.data;

    await workflowClient.trigger({
      url: `${env.UPSTASH_WORKFLOW_URL}/api/onboard/single-student/singleStudentCreationWorkflow`,
      body: {
        data: {
          ...rest,
          email,
          classId,
          departmentId,
          userId: user.id,
          roleId: role.id,
        },
      },
    });

    return { success: true };
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
        error: result.error.issues.flatMap((e) => e.message).join("\n"),
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
    const { user, hasPermission } = await getUserPermissions("create:students");
    if (!hasPermission || !user) return { error: "Permission denied" };

    const result = validateAndTransformStudentsData(values);
    if (result.errors) {
      return {
        errors: result.errors.flatMap((e) => `Row ${e.row}: ${e.message}`),
      };
    }
    if (!result.data) return { error: "No data provided" };

    const classNames = [
      ...new Set(filterBools(result.data.data.map((item) => item.classId))),
    ];
    const deptNames = [
      ...new Set(
        filterBools(result.data.data.map((item) => item.departmentId)),
      ),
    ];

    const emails = result.data.data.map((s) => s.email.trim().toLowerCase());

    const [existingClasses, existingDepartments, existingRole, existingUsers] =
      await Promise.all([
        prisma.class.findMany({
          where: { name: { in: classNames } },
          select: { id: true, name: true },
        }),
        prisma.department.findMany({
          where: { name: { in: deptNames } },
          select: { id: true, name: true },
        }),
        prisma.role.findFirst({
          where: { name: "student" },
          select: { id: true },
        }),
        prisma.user.findMany({
          where: { email: { in: emails } },
          select: { email: true },
        }),
      ]);

    if (!existingRole) {
      return { error: "Student role not configured." };
    }

    // 2. Filter Existing Records (Uniqueness Check)
    const existingEmailSet = new Set(
      existingUsers.map((u) => u.email.toLowerCase()),
    );
    let existingUserEmails: { firstName: string; email: string }[] = [];

    const filteredData = result.data?.data.filter((student) => {
      const isDuplicate = existingEmailSet.has(
        student.email.trim().toLowerCase(),
      );
      if (isDuplicate) {
        existingUserEmails.push(student);
        console.warn(
          `[BULK_STUDENT_UPLOAD] Skipping existing user: ${student.email}`,
        );
      }
      return !isDuplicate;
    });

    if (existingUserEmails.length > 0) {
      return {
        error: existingUserEmails
          .map(
            (student) =>
              `${student.firstName} with email ${student.email} is already taken`,
          )
          .join("\n"),
      };
    }

    const classMap = new Map(existingClasses.map((c) => [c.name, c]));
    const departmentMap = new Map(existingDepartments.map((d) => [d.name, d]));

    const transformedData = filteredData.map((student) => {
      const targetClass = classMap.get(student.classId as string);
      const targetDepartment = departmentMap.get(
        student.departmentId as string,
      );

      if (!targetClass || !targetDepartment) return null;

      return {
        ...student,
        roleId: existingRole.id,
        classId: targetClass,
        departmentId: targetDepartment,
        password: generatePassword(),
      };
    });

    const filteredStudentData = filterBools(transformedData);

    if (filteredStudentData.length === 0) {
      return { error: "All classes assigned to the students do not exist" };
    }

    await workflowClient.trigger({
      url: `${env.UPSTASH_WORKFLOW_URL}/api/onboard/bulk-students/studentsOnboardingWorkflow`,
      body: {
        data: filteredStudentData,
        userId: user.id,
      },
    });

    return {
      success: true,
      message: "Bulk processing started.",
      count: result.data?.data.length as number,
    };
  } catch (error) {
    return { error: getError(error) };
  }
};
