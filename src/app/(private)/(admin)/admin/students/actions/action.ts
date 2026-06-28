/** biome-ignore-all assist/source/organizeImports: reason */
"use server";

import { computeGraduationDate } from "@/lib/compute-graduation-date";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { generatePassword } from "@/lib/generatePassword";
import { getUserPermissions } from "@/lib/get-session";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { workflowClient } from "@/lib/server-only-actions/workflow";
import {
  type BulkCreateStudentsType,
  EditStudentSchema,
  type EditStudentType,
  StudentSchema,
  type StudentType,
} from "@/lib/validation";
import {
  type Department,
  generateStudentIndex,
  type gradelevels,
} from "@/utils/generateStudentIndex";
import { getCachedStudentService } from "@/utils/get-cached-student-service";
import { triggerImageUpload } from "@/utils/trigger-image-upload";
import { revalidateTag } from "next/cache";
import { cache } from "react";
import { filterBools } from "../../staff/utils/check-existing-related-records";
import { getQueryKey } from "../../staff/utils/get-query-key";
import { getSingleCachedStudent } from "../utils/get-single-cached-student";
import { validateAndTransformStudentsData } from "../utils/validate-and-transform-students-data";

export const createStudent = async (values: StudentType) =>
  nextSafeAction(
    async () => {
      const [{ user, hasPermission }, role, existingUser] = await Promise.all([
        getUserPermissions("create:students"),
        prisma.role.findFirst({ where: { name: "student" } }),
        prisma.user.findUnique({
          where: { email: values.email },
          select: { email: true },
        }),
      ]);

      if (!hasPermission || !user)
        throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);
      if (existingUser)
        throw new ActionError(`${values.email} is already taken!`);
      if (!role) throw new ActionError("Student role not found in system.");

      const result = StudentSchema.safeParse(values);
      if (!result.success) throw result.error;

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
    },
    { permission: "create:students" },
  );

export const getStudents = cache(async (studentIDs?: string[]) =>
  nextSafeAction(
    async () => {
      const students = await getCachedStudentService(studentIDs);
      return { students: students ?? [] };
    },
    { permission: "view:students" },
  ),
);

export const bulkDeleteStudents = async (ids: string[]) =>
  nextSafeAction(
    async () => {
      const studentsToDelete = await prisma.student.findMany({
        where: { id: { in: ids } },
        select: {
          classId: true,
          userId: true,
          attendance: { select: { id: true } },
          payments: { select: { id: true } },
          grades: { select: { id: true } },
        },
      });

      if (studentsToDelete.length === 0) return { count: 0 };
      const existingPayments = studentsToDelete.flatMap((s) => s.payments);
      const existingGrades = studentsToDelete.flatMap((s) => s.grades);
      const existingAttendance = studentsToDelete.flatMap((s) => s.attendance);

      if (existingAttendance.length > 0)
        throw new ActionError(
          "You cannot delete students with existing attendance records",
        );
      if (existingPayments.length > 0)
        throw new ActionError(
          "You cannot delete students with existing payment records",
        );

      if (existingGrades.length > 0)
        throw new ActionError(
          "You cannot delete students with existing grades records",
        );

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

      revalidateTag(getQueryKey().student.all[1], "seconds");
      revalidateTag(getQueryKey().user.all[0], "seconds");

      return { count: result.count };
    },
    { permission: "delete:students" },
  );

export const deleteStudent = async (id: string) =>
  nextSafeAction(
    async () => {
      const existingStudent = await prisma.student.findUnique({
        where: { id },
        select: {
          userId: true,
          classId: true,
        },
      });

      if (!existingStudent)
        throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

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

      revalidateTag(getQueryKey().student.all[0], "seconds");
      revalidateTag(getQueryKey().user.all[0], "seconds");

      return { success: true };
    },
    { permission: "delete:students" },
  );

export const getStudent = async (id: string) =>
  nextSafeAction(
    async () => {
      const student = await getSingleCachedStudent(id);

      if (!student) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

      return { student };
    },
    { permission: "view:students" },
  );

export const updateStudent = async (values: EditStudentType) =>
  nextSafeAction(
    async () => {
      const result = EditStudentSchema.safeParse(values);
      if (!result.success) throw result.error;

      const { id, data } = result.data;
      const admissionYear = new Date(data.dateEnrolled).getFullYear();

      const transactionResult = await prisma.$transaction(async (tx) => {
        const current = await tx.student.findUnique({
          where: { id },
          include: { currentClass: true, department: true },
        });

        if (!current) throw new Error("Student not found");

        let studentNumber = current.studentNumber;

        const yearInDB = new Date(current.dateEnrolled).getFullYear();
        if (yearInDB !== admissionYear) {
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
            ? (parseInt(latest.studentNumber.slice(-3), 10) || 0) + 1
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
              select: {
                name: true,
                maxCapacity: true,
                currentEnrollment: true,
              },
            });

            if (!newClass) throw new Error("Target class does not exist");
            if (
              newClass.maxCapacity &&
              newClass.currentEnrollment >= newClass.maxCapacity
            ) {
              throw new Error(
                `Class "${newClass.name}" is at maximum capacity.`,
              );
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
        void triggerImageUpload(
          data.imageFile,
          transactionResult.userId,
          "students",
          "user",
        );
      }

      revalidateTag(getQueryKey().student.all[0], "seconds");
      revalidateTag(getQueryKey(id).student.single[1], "seconds");

      return { success: true };
    },
    { permission: "edit:students" },
  );

export const bulkCreateStudents = async (values: BulkCreateStudentsType) =>
  nextSafeAction(
    async () => {
      const { user, hasPermission } =
        await getUserPermissions("create:students");
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

      const [
        existingClasses,
        existingDepartments,
        existingRole,
        existingUsers,
      ] = await Promise.all([
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
      const existingUserEmails: { firstName: string; email: string }[] = [];

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
      const departmentMap = new Map(
        existingDepartments.map((d) => [d.name, d]),
      );

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
    },
    { permission: "create:students" },
  );
