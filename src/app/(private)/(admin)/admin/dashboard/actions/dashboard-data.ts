"use server";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { getError } from "@/utils/get-error";

import * as Sentry from "@sentry/nextjs";

export type DashboardData = {
  counts: {
    students: number;
    teachers: number;
    departments: number;
    classes: number;
    courses: number;
    studentMales: number;
    studentFemales: number;
    staffMales: number;
    staffFemales: number;
    staffCount4GArt: number;
    staffCount4Home: number;
    staffCount4Tech: number;
    staffCount4VArt: number;
    staffCount4Ict: number;
    staffCount4Agric: number;
    staffCount4Math: number;
    staffCount4Lang: number;
    teachingStaffCount: number;
    yearGroupGender: {
      yearOneMales: number;
      yearTwoMales: number;
      yearThreeMales: number;
      yearOneFemales: number;
      yearTwoFemales: number;
      yearThreeFemales: number;
    };
  };
  recentStudents: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    departmentName?: string;
    className?: string;
    dateEnrolled: Date;
    yearGroup: string;
    photoUrl: string;
  }[];
  departmentDistribution: {
    name: string;
    studentCount: number;
  }[];
  classDistribution: {
    name: string;
    studentCount: number;
  }[];
};

export async function getDashboardData() {
  try {
    const { hasPermission } = await getUserPermissions("view:users");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const [
      studentCount,
      teacherCount,
      departmentCount,
      classCount,
      courseCount,
      recentStudents,
      departmentDistribution,
      classDistribution,
      studentMales,
      studentFemales,
      staffMales,
      staffFemales,
      staffCount4GArt,
      staffCount4Home,
      staffCount4Tech,
      staffCount4VArt,
      staffCount4Ict,
      staffCount4Agric,
      staffCount4Math,
      staffCount4Lang,
      teachingStaffCount,
      yearOneMales,
      yearTwoMales,
      yearThreeMales,
      yearOneFemales,
      yearTwoFemales,
      yearThreeFemales,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.staff.count(),
      prisma.department.count(),
      prisma.class.count(),
      prisma.course.count(),

      // Get 5 most recent students with their department and class
      prisma.student.findMany({
        take: 5,
        orderBy: {
          dateEnrolled: "desc",
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentNumber: true,
          dateEnrolled: true,
          currentLevel: true,
          department: {
            select: {
              name: true,
            },
          },
          currentClass: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              image: true,
            },
          },
        },
      }),
      // Get department distribution
      prisma.department.findMany({
        select: {
          name: true,
          _count: {
            select: {
              students: true,
            },
          },
        },
      }),
      // Get class distribution
      prisma.class.findMany({
        select: {
          name: true,
          _count: {
            select: {
              students: true,
            },
          },
        },
      }),
      prisma.student.count({ where: { gender: "Male" } }),
      prisma.student.count({ where: { gender: "Female" } }),
      prisma.staff.count({ where: { gender: "male" } }),
      prisma.staff.count({ where: { gender: "female" } }),
      prisma.staff.count({ where: { department: { name: "General Arts" } } }),
      prisma.staff.count({ where: { department: { name: "Home Economics" } } }),
      prisma.staff.count({ where: { department: { name: "Technical" } } }),
      prisma.staff.count({ where: { department: { name: "Visual Arts" } } }),
      prisma.staff.count({ where: { department: { name: "ICT" } } }),
      prisma.staff.count({ where: { department: { name: "Agriculture" } } }),
      prisma.staff.count({ where: { department: { name: "Mathematics" } } }),
      prisma.staff.count({ where: { department: { name: "Languages" } } }),
      prisma.staff.count({ where: { staffType: "Teaching" } }),
      prisma.student.count({
        where: { currentLevel: "Year_One", gender: "Male" },
      }),
      prisma.student.count({
        where: { currentLevel: "Year_Two", gender: "Male" },
      }),
      prisma.student.count({
        where: { currentLevel: "Year_Three", gender: "Male" },
      }),
      prisma.student.count({
        where: { currentLevel: "Year_One", gender: "Female" },
      }),
      prisma.student.count({
        where: { currentLevel: "Year_Two", gender: "Female" },
      }),
      prisma.student.count({
        where: { currentLevel: "Year_Three", gender: "Female" },
      }),
    ]);

    return {
      counts: {
        students: studentCount,
        teachers: teacherCount,
        departments: departmentCount,
        classes: classCount,
        courses: courseCount,
        studentMales,
        studentFemales,
        staffMales,
        staffFemales,
        staffCount4GArt,
        staffCount4Home,
        staffCount4Tech,
        staffCount4VArt,
        staffCount4Ict,
        staffCount4Agric,
        staffCount4Math,
        staffCount4Lang,
        teachingStaffCount,
        yearGroupGender: {
          yearOneMales,
          yearOneFemales,
          yearTwoMales,
          yearTwoFemales,
          yearThreeMales,
          yearThreeFemales,
        },
      },
      recentStudents: recentStudents.map((student) => ({
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        studentNumber: student.studentNumber,
        departmentName: student.department?.name,
        className: student.currentClass?.name,
        dateEnrolled: student.dateEnrolled,
        yearGroup: student.currentLevel.split("_").join(" "),
        photoUrl: student.user?.image ?? "",
      })),
      departmentDistribution: departmentDistribution.map((dept) => ({
        name: dept.name,
        studentCount: dept._count.students,
      })),
      classDistribution: classDistribution.map((cls) => ({
        name: cls.name,
        studentCount: cls._count.students,
      })),
    };
  } catch (e) {
    console.error("Failed to fetch dashboard data", e);
    Sentry.captureException(e);
    return { error: getError(e) };
  }
}
