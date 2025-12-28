import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { StaffSelect } from "@/lib/types";
import { StaffType } from "@/lib/validation";
import { triggerRollback } from "@/utils/trigger-better-auth-user-delete";

export const triggerStaffCreation = async (
  userId: string,
  data: Omit<StaffType, "imageFile" | "email" | "username">
) => {
  const {
    departmentId,
    isDepartmentHead,
    classes,
    courses,
    dateOfFirstAppointment,
    ...rest
  } = data;

  try {
    const staff = await prisma.staff.create({
      data: {
        ...rest,
        userId,
        departmentId: departmentId || null,
        dateOfFirstAppointment: dateOfFirstAppointment
          ? new Date(dateOfFirstAppointment)
          : null,
        departmentHead:
          isDepartmentHead && departmentId
            ? {
                connect: { id: departmentId },
              }
            : undefined,
        classes: classes
          ? { connect: classes.map((classId) => ({ id: classId })) }
          : undefined,
        courses: courses
          ? { connect: courses.map((courseId) => ({ id: courseId })) }
          : undefined,
      },
      select: StaffSelect,
    });

    return { staff };
  } catch (err) {
    try {
      await triggerRollback(userId);
    } catch (rollbackError) {
      console.error("Rollback failed:", rollbackError);
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        const target = err.meta?.target as string[];

        if (target?.includes("employeeId")) {
          return {
            error: `A staff with the same employee ID already exists.`,
          };
        } else if (target?.includes("rgNumber")) {
          return {
            error: `A staff with the same RG number already exists.`,
          };
        } else if (target?.includes("ghcardNumber")) {
          return {
            error: `A staff with the same GH Card number already exists.`,
          };
        } else if (target?.includes("ssnitNumber")) {
          return {
            error: `A staff with the same SSNIT number already exists.`,
          };
        } else if (target?.includes("licencedNumber")) {
          return {
            error: `A staff with the same Licenced number already exists.`,
          };
        }
        return {
          error: `A record with the same already exists.`,
        };
      } else if (err.code === "P2025") {
        return {
          error: `Related record not found. Please ensure all related records exist.`,
        };
      } else if (err.code === "P2003") {
        return {
          error: `Foreign key constraint failed. Please ensure all related records exist.`,
        };
      } else {
        return { error: `Database error: ${err.message}` };
      }
    }

    throw err;
  }
};
