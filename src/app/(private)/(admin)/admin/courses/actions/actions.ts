"use server";

import { getAuthUser, getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { CourseSelect } from "@/lib/types";
import {
  BulkUploadCourses as BulkUploadCoursesType,
  BulkUploadCoursesSchema,
  CoursesSchema,
  CoursesType,
  CourseUpdateSchema,
  CourseUpdateType,
} from "@/lib/validation";
import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { generateCourseCode } from "../utils/generate-course-code";

// Helper function to generate unique course codes
async function generateUniqueCourseCode(): Promise<string> {
  // Find the highest sequence number from existing auto-generated course codes
  const existingCourses = await prisma.course.findMany({
    where: {
      code: {
        startsWith: "CRS", // Only consider auto-generated codes
      },
    },
    select: { code: true },
    orderBy: { code: "desc" },
  });

  let sequenceNumber = 1;
  if (existingCourses.length > 0) {
    // Extract the highest sequence number from auto-generated codes
    const highestCode = existingCourses[0].code;
    const match = highestCode.match(/CRS(\d+)$/);
    if (match) {
      sequenceNumber = parseInt(match[1], 10) + 1;
    }
  }

  // Ensure we don't conflict with any existing codes
  let attempts = 0;
  let finalCode: string;

  do {
    finalCode = generateCourseCode(sequenceNumber, "CRS{sequence:3}");
    sequenceNumber++;

    // Check if this code already exists
    const existingCode = await prisma.course.findUnique({
      where: { code: finalCode },
      select: { id: true },
    });

    if (!existingCode) break; // Code is unique

    attempts++;
    if (attempts > 100) {
      throw new Error("Unable to generate unique course code");
    }
  } while (true);

  return finalCode!;
}

// Helper function to generate multiple unique course codes
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
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const { error, success, data } = CoursesSchema.safeParse(values);

    if (!success) {
      const zodError = error.flatten();

      if (zodError.fieldErrors.title) {
        return {
          error: zodError.fieldErrors.title[0],
        };
      }

      // Code validation is now optional, so we only check if code is provided and invalid
      if (zodError.fieldErrors.code && values.code) {
        return {
          error: zodError.fieldErrors.code[0],
        };
      }
      if (zodError.fieldErrors.createdAt) {
        return {
          error: zodError.fieldErrors.createdAt[0],
        };
      }

      if (zodError.fieldErrors.credits) {
        return { error: zodError.fieldErrors.credits[0] };
      }

      if (zodError.fieldErrors.staff) {
        return { error: zodError.fieldErrors.staff[0] };
      }
      if (zodError.fieldErrors.classes) {
        return { error: zodError.fieldErrors.classes[0] };
      }
      if (zodError.fieldErrors.departments) {
        return { error: zodError.fieldErrors.departments[0] };
      }
      if (zodError.fieldErrors.description) {
        return { error: zodError.fieldErrors.description[0] };
      }
    }

    // Generate course code if not provided
    let finalCode = data?.code;
    if (!finalCode) {
      finalCode = await generateUniqueCourseCode();
    }

    // Check for existing courses
    const existingCourse = await prisma.course.findFirst({
      where: {
        OR: [{ code: finalCode }, { title: data?.title }],
      },
    });

    if (existingCourse !== null) {
      if (existingCourse.code === finalCode) {
        return { error: "Course code already exists!" };
      }

      if (existingCourse.title === data?.title) {
        return { error: "Course title already exists!" };
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

    if (!course) {
      return { error: "Course creation failed!" };
    }

    revalidatePath("/admin/courses");

    return { course };
  } catch (error) {
    console.error("Course creations failed: ", error);

    return { error: getErrorMessage(error) };
  }
};

export const getCourses = async (codes?: string[]) => {
  try {
    const user = await getAuthUser();

    if (!user) {
      return { error: "User not found!" };
    }

    const { hasPermission } = await getUserPermissions("view:courses");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    let query: Prisma.CourseWhereInput = {};

    if (user?.role?.name === "staff") {
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
    return { error: "Courses fetching failed!" };
  }
};

export const getCourse = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:courses");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const course = await prisma.course.findUnique({
      where: { id },
      select: CourseSelect,
    });

    if (!course) return { error: "No course found!" };

    return { course };
  } catch (error) {
    console.error("Could not fetch course:", error);
    return { error: "Something went wrong!" };
  }
};

export const updateCourse = async (values: CourseUpdateType) => {
  try {
    const { hasPermission } = await getUserPermissions("edit:courses");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const { error, success, data } = CourseUpdateSchema.safeParse(values);

    if (!success) {
      const zodErrors = error.flatten();

      if (zodErrors.fieldErrors.id) {
        return { error: zodErrors.fieldErrors.id[0] };
      }

      if (zodErrors.fieldErrors.data) {
        return { error: zodErrors.fieldErrors.data[0] };
      }
    }

    const { data: courseData, id } = data!;

    console.log({ ...courseData, id });

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

    if (!course) {
      return { error: "Could not update course" };
    }

    revalidatePath("/admin/courses");

    return { course };
  } catch (error) {
    console.error("Could not update course: ", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const targetFields = error.meta?.target as string[];

        const errorMessages = targetFields.includes("code")
          ? "Course code provided in your request already exists!"
          : targetFields.includes("title")
            ? "Course title provided already exist!"
            : "An unknown error has occurred!";

        return { error: errorMessages };
      }
    }

    return { error: getErrorMessage(error) };
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:courses");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const course = await prisma.course.delete({
      where: { id },
    });

    if (!course) {
      return { error: "Could not deleted course" };
    }

    revalidatePath("/admin/courses");

    return { course };
  } catch (error) {
    console.error("Could not fetch course: ", error);
    return { error: "Something went wrong!" };
  }
};

export const bulkDeleteCourses = async (ids: string[]) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:courses");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    if (!Array.isArray(ids)) {
      return { error: "Expected an array of string IDs" };
    }

    const count = await prisma.course
      .deleteMany({
        where: {
          id: { in: ids },
        },
      })
      .then((value) => value.count);

    if (!(count > 0)) {
      return { error: "Could not delete the selected course(s)" };
    }

    revalidatePath("/admin/courses");

    return { count };
  } catch (error) {
    console.error("Could not delete the selected courses: ", error);

    return { error: getErrorMessage(error) };
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
