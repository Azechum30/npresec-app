"use server";

import { Levels } from "@/lib/constants";
import { generatePassword } from "@/lib/generatePassword";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/resend-config";
import { StudentResponseType, StudentSelect } from "@/lib/types";
import {
  BulkCreateStudentsSchema,
  BulkCreateStudentsType,
  EditStudentSchema,
  EditStudentType,
  status,
  StudentSchema,
  StudentType,
} from "@/lib/validation";
import {
  CONSTANTS,
  Department,
  generateStudentIndex,
} from "@/utils/generateStudentIndex";
import { Prisma } from "@/generated/prisma/client";
import * as Sentry from "@sentry/nextjs";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { rateLimit } from "@/utils/rateLimit";
import { client } from "@/utils/qstash";
import { env } from "@/lib/server-only-actions/validate-env";
import { auth } from "@/lib/auth";
import { computeGraduationDate } from "@/lib/compute-graduation-date";
import { validateAndTransformStudentsData } from "../utils/validate-and-transform-students-data";

export const createStudent = async (values: StudentType) => {
  try {
    const { hasPermission } = await getUserPermissions("create:students");
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";

    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const { success } = await rateLimit.limit(ip);

    if (!success) {
      return { error: "Too many requests. Please try again later." };
    }

    const result = StudentSchema.safeParse(values);

    if (!result.success) {
      const zodErrors = result.error.errors
        .flatMap((e) => `${e.path[0]}: ${e.message}`)
        .join(",");

      return { error: zodErrors };
    }

    const [
      existingUser,
      existingDepartment,
      existingClass,
      existingRole,
      studentPermission,
    ] = await prisma.$transaction([
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

      prisma.permission.findFirst({
        where: {
          name: "view:students",
        },
        select: { id: true },
      }),
    ]);

    if (existingUser) {
      return { error: `${existingUser.email} is already taken!` };
    }

    if (!existingClass) {
      return { error: "The selected class does not exist" };
    }

    // Check if class has reached maximum capacity
    if (
      existingClass.maxCapacity &&
      existingClass.currentEnrollment >= existingClass.maxCapacity
    ) {
      return {
        error: `Class "${existingClass.name}" has reached its maximum capacity of ${existingClass.maxCapacity} students`,
      };
    }

    if (!existingDepartment) {
      return { error: "The selected department does not exist" };
    }

    if (!existingRole) {
      return { error: "Student role not found" };
    }

    if (!studentPermission) {
      return { error: "Student permission not found!" };
    }

    const password = generatePassword();

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
            latestStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH),
          ),
        )
        ? 1
        : parseInt(
            latestStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH),
          ) + 1
      : 1;

    const studentID = generateStudentIndex({
      department: existingDepartment.name as Department,
      admissionYear,
      sequenceNumber: sequence,
    });

    const { email, photoURL, imageFile, classId, departmentId, ...rest } =
      result.data;

    // Create user account via auth API
    await auth.api.signUpEmail({
      body: {
        email,
        username: rest.firstName + " " + rest.lastName,
        password,
        name: rest.firstName + " " + rest.lastName,
        callbackURL: "/email-verified",
      },
      headers: await headers(),
    });

    // Wrap database operations in a transaction for atomicity
    const transactionResult = await prisma.$transaction(async (tx) => {
      // Find the created user
      const createdUser = await tx.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (!createdUser) {
        throw new Error("Failed to find created user account");
      }

      await tx.user.update({
        where: { id: createdUser.id },
        data: { roleId: existingRole.id },
      });

      // Create student record
      const createdStudent = await tx.student.create({
        data: {
          ...rest,
          studentNumber: studentID,
          currentLevel: rest.currentLevel as (typeof Levels)[number],
          status: rest.status as (typeof status)[number],
          graduationDate: rest.graduationDate
            ? rest.graduationDate
            : computeGraduationDate(rest.dateEnrolled),

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
              id: createdUser.id,
            },
          },
        },
      });

      // Increment class enrollment if classId is provided
      if (classId) {
        await tx.class.update({
          where: { id: classId },
          data: { currentEnrollment: { increment: 1 } },
        });
      }

      return { createdStudent, createdUser };
    });

    const { createdStudent } = transactionResult;

    if (result.data.imageFile instanceof File) {
      const arrayBuffer = await (result.data.imageFile as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const jobData = {
        file: {
          buffer: buffer.toString("base64"),
          name: (result.data.imageFile as File).name,
          type: (result.data.imageFile as File).type,
        },
        entityId: createdStudent.userId,
        entityType: "user" as const,
        folder: "students",
      };
      await client.publishJSON({
        url: `${env.NEXT_PUBLIC_URL}/api/images/uploads`,
        body: jobData,
      });
    }

    const emailData = {
      to: [email],
      username: createdStudent.lastName,
      data: {
        email: email,
        lastName: createdStudent.firstName,
        password: password,
      },
    };

    await client.publishJSON({
      url: `${env.NEXT_PUBLIC_URL}/api/send/emails`,
      body: emailData,
    });

    return { createdStudent };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
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

    const students = await prisma.student.findMany({
      where: query,
      select: StudentSelect,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { students: students ?? [] };
  } catch (error) {
    console.error("Could not fetch students:", error);
    Sentry.captureException(error);
    return { error: getErrorMessage(error) };
  }
};

export const bulkDeleteStudents = async (ids: string[]) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:students");
    if (!hasPermission) return { error: "Permission denied" };

    // Get students to update class enrollments before deletion
    const studentsToDelete = await prisma.student.findMany({
      where: { id: { in: ids } },
      select: { classId: true },
    });

    // Group students by class to batch enrollment updates
    const classUpdates = new Map<string, number>();
    studentsToDelete.forEach((student) => {
      if (student.classId) {
        classUpdates.set(
          student.classId,
          (classUpdates.get(student.classId) || 0) + 1,
        );
      }
    });

    // Update class enrollments
    await Promise.all(
      Array.from(classUpdates.entries()).map(([classId, decrementCount]) =>
        prisma.class.update({
          where: { id: classId },
          data: { currentEnrollment: { decrement: decrementCount } },
        }),
      ),
    );

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

    // Decrement class enrollment before deleting
    if (existingStudent.classId) {
      await prisma.class.update({
        where: { id: existingStudent.classId },
        data: { currentEnrollment: { decrement: 1 } },
      });
    }

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
      const zodError = result.error.errors.reduce(
        (acc, issue) => {
          acc[issue.path[0]] = issue.message;
          return acc;
        },
        {} as Record<string, string>,
      );

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
            existingStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH),
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
      studentNumber: existingStudent?.studentNumber ?? studentNumber,
      departmentId: data.departmentId ?? "",
      classId: data.classId ?? "",
      currentLevel: data.currentLevel as (typeof Levels)[number],
    };
    const { email, ...transformData } = cleanData;

    const { imageFile, photoURL, classId, departmentId, ...rest } =
      transformData;

    // Get current student to check if class changed
    const currentStudent = await prisma.student.findUnique({
      where: { id },
      select: { classId: true },
    });

    // Update student record
    await prisma.student.update({
      where: { id },
      data: {
        ...rest,
        department: departmentId
          ? {
              connect: {
                id: departmentId,
              },
            }
          : undefined,
        currentClass: classId
          ? {
              connect: {
                id: classId,
              },
            }
          : undefined,
      },
    });

    // Update enrollment counts if class changed
    if (currentStudent?.classId !== classId) {
      // Check capacity of new class before transferring
      if (classId) {
        const newClass = await prisma.class.findUnique({
          where: { id: classId },
          select: { name: true, maxCapacity: true, currentEnrollment: true },
        });

        if (!newClass) {
          return { error: "The selected class does not exist" };
        }

        // Check if new class has reached maximum capacity
        if (
          newClass.maxCapacity &&
          newClass.currentEnrollment >= newClass.maxCapacity
        ) {
          return {
            error: `Class "${newClass.name}" has reached its maximum capacity of ${newClass.maxCapacity} students`,
          };
        }
      }

      // Decrement enrollment from old class
      if (currentStudent?.classId) {
        await prisma.class.update({
          where: { id: currentStudent.classId },
          data: { currentEnrollment: { decrement: 1 } },
        });
      }
      // Increment enrollment in new class
      if (classId) {
        await prisma.class.update({
          where: { id: classId },
          data: { currentEnrollment: { increment: 1 } },
        });
      }
    }

    // Update user record separately if there's a photo update
    if (imageFile instanceof File) {
      const student = await prisma.student.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (student?.userId) {
        const arrayBuffer = await (
          transformData.imageFile as File
        ).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const jobData = {
          file: {
            buffer: buffer.toString("base64"),
            name: (transformData.imageFile as File).name,
            type: (transformData.imageFile as File).type,
          },
          entityId: student?.userId,
          entityType: "user" as const,
          folder: "students",
        };
        await client.publishJSON({
          url: `${env.NEXT_PUBLIC_URL}/api/images/uploads`,
          body: jobData,
        });
      }
    }

    return { success: true };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Could not edit student:", error);
    return { error: getErrorMessage(error) };
  }
};

export const bulkCreateStudents = async (values: BulkCreateStudentsType) => {
  try {
    const { hasPermission } = await getUserPermissions("create:students");
    if (!hasPermission) return { error: "Permission denied" };

    const result = validateAndTransformStudentsData(values);

    if (result.errors) {
      return {
        errors: result.errors.flatMap(
          (e) => `An error occurred at row ${e.row}, ${e.field}: ${e.message}`,
        ),
      };
    }

    const { data: studentData } = result.data!;

    const classNames = [
      ...new Set(studentData.map((student) => student.classId)),
    ];

    const departmentNames = [
      ...new Set(studentData.map((student) => student.departmentId)),
    ];

    const [classes, departments, studentRole, studentPermissions] =
      await prisma.$transaction([
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
        prisma.permission.findFirst({
          where: { name: "view:students" },
          select: { id: true },
        }),
      ]);

    if (!studentRole) {
      return { error: "Student role not found!" };
    }

    if (!studentPermissions) {
      return { error: "Student permission not found!" };
    }

    const classMap = new Map(
      classes.map((classItem) => [classItem.name, classItem.id]),
    );

    const departmentMap = new Map(
      departments.map((dept) => [dept.name, dept.id]),
    );

    // Get class details for capacity validation
    const classDetails = await prisma.class.findMany({
      where: { id: { in: classes.map((c) => c.id) } },
      select: {
        id: true,
        name: true,
        maxCapacity: true,
        currentEnrollment: true,
      },
    });

    const classDetailsMap = new Map(
      classDetails.map((classItem) => [classItem.id, classItem]),
    );

    const createStudents: StudentResponseType[] = [];
    const errors: string[] = [];

    const studentsWithPassword = studentData.map((student) => ({
      ...student,
      password: generatePassword(),
    }));

    for (const student of studentsWithPassword) {
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

      // Check class capacity
      const classDetail = classDetailsMap.get(classId!);
      if (
        classDetail &&
        classDetail.maxCapacity &&
        classDetail.currentEnrollment >= classDetail.maxCapacity
      ) {
        errors.push(
          `Class "${classDetail.name}" has reached its maximum capacity of ${classDetail.maxCapacity} students`,
        );
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

      const sequence = latestStudent?.studentNumber
        ? isNaN(
            parseInt(
              latestStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH),
            ),
          )
          ? 1
          : parseInt(
              latestStudent.studentNumber.slice(-CONSTANTS.SEQUENCE_LENGTH),
            ) + 1
        : 1;

      const studentIndex = generateStudentIndex({
        admissionYear,
        department: student.departmentId! as Department,
        sequenceNumber: sequence,
      });

      await auth.api.signUpEmail({
        body: {
          email: student.email.toLowerCase(),
          username: student.firstName + " " + student.lastName,
          password: student.password,
          name: student.firstName + " " + student.lastName,
          callbackURL: "/email-verified",
        },
        headers: await headers(),
      });

      const createdStudent = await prisma.$transaction(async (tsx) => {
        const user = await tsx.user.findUnique({
          where: { email: student.email.toLowerCase() },
          select: { id: true },
        });

        if (!user) throw new Error("Failed to create student");

        await tsx.user.update({
          where: { id: user.id },
          data: { roleId: studentRole.id },
        });

        const {
          email,
          classId: className,
          departmentId: departmentName,
          password,
          imageFile,
          ...rest
        } = student;

        const created_Student = await tsx.student.create({
          data: {
            ...rest,
            studentNumber: studentIndex,
            birthDate: new Date(rest.birthDate),
            dateEnrolled: new Date(rest.dateEnrolled),
            graduationDate: rest.graduationDate
              ? new Date(rest.graduationDate as string)
              : computeGraduationDate(rest.dateEnrolled),
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

        // Increment class enrollment
        await tsx.class.update({
          where: { id: classId },
          data: { currentEnrollment: { increment: 1 } },
        });

        return created_Student;
      });

      createStudents.push(createdStudent);
    }

    const emails = studentsWithPassword.map((student) => ({
      to: [student.email],
      username: student.lastName,
      data: {
        lastName: student.lastName,
        email: student.email,
        password: student.password,
      },
    }));

    await client.publishJSON({
      url: `${env.NEXT_PUBLIC_URL}/api/send/emails/batch`,
      body: {
        emails: emails,
      },
    });

    return { count: createStudents.length };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Could not create students:", error);
    return { error: getErrorMessage(error) };
  } finally {
    revalidatePath("/admin/students");
  }
};
