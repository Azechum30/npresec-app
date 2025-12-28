
import { prisma } from "@/lib/prisma";
import { BulkCreateStaffType } from "@/lib/validation";

export const getBulkCreationData = async (data: BulkCreateStaffType["data"]) => {
  return await Promise.all([
    prisma.department.findMany({
      where: {
        name: {
          in: [...new Set(data.map((dp) => dp.departmentId as string))],
        },
      },
      select: { id: true, name: true },
    }),

    prisma.class.findMany({
      where: {
        name: {
          in: [...new Set(data.flatMap((cl) => cl.classes || []))],
        },
      },
      select: { id: true, name: true },
    }),

    prisma.course.findMany({
      where: {
        title: {
          in: [...new Set(data.flatMap((crs) => crs.courses || []))],
        },
      },
      select: { id: true, title: true },
    }),

    prisma.role.findMany({
      where: {
        name: {
          in: ["teaching_staff", "admin_staff", "support_staff", "staff"],
        },
      },
      select: { id: true, name: true },
    }),
  ]);
};

export const createStaffInBulk = async (staffData: any[]) => {
  return await prisma.staff.createMany({
    data: staffData,
  });
};
