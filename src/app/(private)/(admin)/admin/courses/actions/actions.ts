/**biome-ignore-all assist/source/organizeImports: reason */
"use server";

import type { Prisma } from "@/generated/prisma/client";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { CourseSelect } from "@/lib/types";
import {
  BulkUploadCoursesSchema,
  type BulkUploadCourses as BulkUploadCoursesType,
  CoursesSchema,
  type CoursesType,
  CourseUpdateSchema,
  type CourseUpdateType,
} from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import z from "zod";
import { generateCourseCode } from "../utils/generate-course-code";

async function generateUniqueCourseCode(): Promise<string> {
  const existingCourses = await prisma.course.findMany({
    where: {
      code: {
        startsWith: "CRS",
      },
    },
    select: { code: true },
    orderBy: { code: "desc" },
  });

  let sequenceNumber = 1;
  if (existingCourses.length > 0) {
    const highestCode = existingCourses[0].code;
    const match = highestCode.match(/CRS(\d+)$/);
    if (match) {
      sequenceNumber = parseInt(match[1], 10) + 1;
    }
  }

  let attempts = 0;
  let finalCode: string;

  do {
    finalCode = generateCourseCode(sequenceNumber, "CRS{sequence:3}");
    sequenceNumber++;

    const existingCode = await prisma.course.findUnique({
      where: { code: finalCode },
      select: { id: true },
    });

    if (!existingCode) break;

    attempts++;
    if (attempts > 100) {
      throw new Error("Unable to generate unique course code");
    }
    // biome-ignore lint/correctness/noConstantCondition: reason
  } while (true);

  return finalCode;
}

async function generateUniqueCourseCodes(count: number): Promise<string[]> {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code = await generateUniqueCourseCode();
    codes.push(code);
  }

  return codes;
}

export const createCourse = async (values: CoursesType) => {
  try {
    const { hasPermission } = await getUserPermissions("create:courses");
    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    const { error, success, data } = CoursesSchema.safeParse(values);

    if (!success) throw error;

    let finalCode = data?.code;
    if (!finalCode) {
      finalCode = await generateUniqueCourseCode();
    }

    const existingCourse = await prisma.course.findFirst({
      where: {
        OR: [{ code: finalCode }, { title: data?.title }],
      },
    });

    if (existingCourse !== null) {
      if (existingCourse.code === finalCode) {
        throw new ActionError("course code is already taken");
      }

      if (existingCourse.title === data?.title) {
        throw new ActionError("course title is already taken");
      }
    }

    const course = await prisma.course.create({
      data: {
        ...data,
        code: finalCode,
        title: data?.title as string,
        departments: data?.departments
          ? {
              connect: data?.departments.map((departmentId) => ({
                id: departmentId,
              })),
            }
          : undefined,
        classes: data?.classes
          ? {
              connect: data?.classes.map((classId) => ({ id: classId })),
            }
          : undefined,
        staff: data?.staff
          ? {
              connect: data?.staff.map((staffId) => ({ id: staffId })),
            }
          : undefined,
      },

      select: CourseSelect,
    });

    return { course };
  } catch (error) {
    console.error("Course creations failed: ", error);
    Sentry.captureException(error);
    throw getErrorMessage(error);
  }
};

export const getCourses = async (codes?: string[]) => {
  try {
    const { user, hasPermission } = await getUserPermissions("view:courses");

    if (!user) throw new ActionError(CUSTOM_ERRORS.AUTHENTICATION.message);
    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    let query: Prisma.CourseWhereInput = {};

    if (user.roles?.flatMap((r) => r.role.name).includes("teaching_staff")) {
      query = {
        staff: {
          some: { id: user.id },
        },
      };
    }

    if (codes !== undefined) {
      query = {
        OR: [{ code: { in: codes as string[] } }],
      };
    }

    const courses = await prisma.course.findMany({
      where: query,
      orderBy: {
        createdAt: "asc",
      },
      select: CourseSelect,
    });

    return { courses: courses || [] };
  } catch (error) {
    console.error("Courses fetching failed: ", error);
    Sentry.captureException(error);
    throw getErrorMessage(error);
  }
};

export const getCourse = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:courses");
    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    const course = await prisma.course.findUnique({
      where: { id },
      select: CourseSelect,
    });

    if (!course) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

    return { course };
  } catch (error) {
    console.error("Could not fetch course:", error);
    Sentry.captureException(error);
    throw getErrorMessage(error);
  }
};

export const updateCourse = async (values: CourseUpdateType) => {
  try {
    const { hasPermission } = await getUserPermissions("edit:courses");
    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    const { error, success, data } = CourseUpdateSchema.safeParse(values);

    if (!success) throw error;

    const { data: courseData, id } = data;

    const duplicate = await prisma.course.findFirst({
      where: {
        AND: [
          { OR: [{ code: courseData.code }, { title: courseData.title }] },
          { id: { not: id } },
        ],
      },
    });

    if (duplicate)
      throw new ActionError("A course with this code or title already exists");

    const course = await prisma.course.update({
      where: {
        id,
      },
      data: {
        ...courseData,
        departments: courseData.departments
          ? {
              set: courseData.departments.map((departmentId) => ({
                id: departmentId,
              })),
            }
          : undefined,
        classes: courseData.classes
          ? {
              set: courseData.classes.map((classId) => ({ id: classId })),
            }
          : undefined,
        staff: courseData.staff
          ? {
              set: courseData.staff.map((teacherId) => ({
                id: teacherId,
              })),
            }
          : undefined,
      },

      select: CourseSelect,
    });

    return { course };
  } catch (error) {
    console.error("Could not update course: ", error);
    Sentry.captureException(error);
    throw getErrorMessage(error);
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:courses");
    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);
    const exists = await getCourse(id);

    const course = await prisma.course.delete({
      where: { id: exists.course.id },
    });

    return { course };
  } catch (error) {
    console.error("Could not fetch course: ", error);
    Sentry.captureException(error);
    throw getErrorMessage(error);
  }
};

export const bulkDeleteCourses = async (ids: string[]) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:courses");
    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    const { success, data, error } = z.array(z.string()).min(1).safeParse(ids);

    if (!success) throw error;

    const existingRecords = await prisma.course.findMany({
      where: { id: { in: data } },
      select: { id: true },
    });

    const idsToDelete = data.filter((id) =>
      existingRecords.map((r) => r.id === id),
    );

    if (idsToDelete.length === 0)
      throw new ActionError("No courses matched the provided Ids");

    const payload = await prisma.course.deleteMany({
      where: {
        id: { in: idsToDelete },
      },
    });
    return { count: payload.count };
  } catch (error) {
    console.error("Could not delete the selected courses: ", error);
    Sentry.captureException(error);
    throw getErrorMessage(error);
  }
};

export const bulkUploadCourses = async (values: BulkUploadCoursesType) => {
  try {
    const { hasPermission } = await getUserPermissions("create:courses");

    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const unValidateData = {
      ...values,
      data: values.data.map((item) => ({
        ...item,
        staff: item.staff?.toString().split(","),
        classes: item.classes?.toString().split(","),
        departments: item.departments?.toString().split(","),
      })),
    };
    const { error, success, data } =
      BulkUploadCoursesSchema.safeParse(unValidateData);

    if (!success || error) {
      const zodErrors = error.flatten();

      const FieldErrors = zodErrors.fieldErrors.data
        ? zodErrors.fieldErrors.data[0]
        : "";

      return { error: FieldErrors };
    }

    const bulkData = data?.data;

    console.log(bulkData);

    // Separate courses with and without codes
    const coursesWithCodes = bulkData.filter((course) => course.code);
    const coursesWithoutCodes = bulkData.filter((course) => !course.code);

    // Generate codes for courses without codes
    let generatedCodes: string[] = [];
    if (coursesWithoutCodes.length > 0) {
      generatedCodes = await generateUniqueCourseCodes(
        coursesWithoutCodes.length,
      );
    }

    // Combine codes: provided codes + generated codes
    const codes = [
      ...coursesWithCodes.map((course) => course.code!),
      ...generatedCodes,
    ];
    const titles = bulkData.map((course) => course.title);

    const classes = [...new Set(bulkData.flatMap((course) => course.classes))];
    const staff = [...new Set(bulkData.flatMap((course) => course.staff))];
    const departments = [
      ...new Set(bulkData.flatMap((course) => course.departments)),
    ];

    const [
      existingClasses,
      existingTeachers,
      existingDepartments,
      existingCourses,
    ] = await prisma.$transaction([
      prisma.class.findMany({
        where: {
          name: { in: classes as string[] },
        },
      }),

      prisma.staff.findMany({
        where: { employeeId: { in: staff as string[] } },
      }),

      prisma.department.findMany({
        where: {
          name: { in: departments as string[] },
        },
      }),

      prisma.course.findMany({
        where: {
          OR: [{ code: { in: codes } }, { title: { in: titles } }],
        },
      }),
    ]);

    const missingClasses = classes.filter(
      (className) => !existingClasses.some((cls) => cls.name === className),
    );

    const missingTeachers = staff.filter(
      (teacherId) =>
        !existingTeachers.some((ter) => ter.employeeId === teacherId),
    );

    const missingDepartments = departments.filter(
      (departmentName) =>
        !existingDepartments.some((dp) => dp.name === departmentName),
    );

    if (
      missingClasses.length > 0 ||
      missingTeachers.length > 0 ||
      missingDepartments.length > 0
    ) {
      return {
        error: `The following records do not exist: ${
          missingClasses.length > 0
            ? `Classes: ${missingClasses.join(", ")}`
            : missingTeachers.length > 0
              ? `Teachers: ${missingDepartments.join(", ")}`
              : `Departments: ${missingDepartments.join(", ")}`
        }`,
      };
    }

    const errors: string[] = [];

    if (existingCourses.length > 0) {
      existingCourses.forEach((course) => {
        if (codes.includes(course.code)) {
          errors.push(`$course.code} already exists!`);
        }

        if (titles.includes(course.title)) {
          errors.push(`${course.title} already exists!`);
        }
      });
    }

    if (errors.length > 0) {
      return { errors };
    }

    const classesMap = existingClasses.reduce(
      (acc, cls) => {
        acc[cls.name] = cls.id;
        return acc;
      },
      {} as Record<string, string>,
    );

    const teachersMap = existingTeachers.reduce(
      (acc, tls) => {
        acc[tls.employeeId] = tls.id;
        return acc;
      },
      {} as Record<string, string>,
    );

    const departmentMap = existingDepartments.reduce(
      (acc, dp) => {
        acc[dp.name] = dp.id;
        return acc;
      },
      {} as Record<string, string>,
    );

    // Assign generated codes to courses without codes
    let generatedCodeIndex = 0;
    const coursesWithFinalCodes = bulkData.map((course) => ({
      ...course,
      finalCode: course.code || generatedCodes[generatedCodeIndex++],
    }));

    const coursesToCreate = coursesWithFinalCodes.map((course) => ({
      code: course.finalCode,
      title: course.title,
      credits: course.credits,
      description: course.description,
      createdAt: new Date(course.createdAt as string),
      departments: course.departments
        ? {
            connect: course.departments.map((dp) => ({
              id: departmentMap[dp],
            })),
          }
        : undefined,
      classes: course.classes
        ? {
            connect: course.classes.map((cls) => ({ id: classesMap[cls] })),
          }
        : undefined,
      staff: course.staff
        ? {
            connect: course.staff.map((tls) => ({ id: teachersMap[tls] })),
          }
        : undefined,
    }));

    const coursesCreated = await prisma.$transaction(
      coursesToCreate.map((course) => prisma.course.create({ data: course })),
    );

    if (!(coursesCreated.length > 0)) {
      return { error: "Could not upload courses!" };
    }

    revalidatePath("/admin/courses");

    return { count: coursesCreated.length };
  } catch (error) {
    console.error("Could not upload Courses: ", error);
    return { error: getErrorMessage(error) };
  }
};
