"use server";
import "server-only";

import { ALL_TYPES, ASSESSMENT_WEIGHTS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { shortenCourseNames } from "../_utils/shorten-course-names";

export const getStaffDashboardData = async () => {
  try {
    const { user, hasPermission } = await getUserPermissions("view:students");

    if (!user || !hasPermission)
      return {
        error: "You do not have sufficient permissions to perform this action.",
      };

    const atRiskScore = 50;

    const staff = await prisma.staff.findFirst({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!staff) return { error: "You do cannot perform this action" };

    const [
      studentCount,
      classCount,
      courseCount,
      performanceMetrics,
      maxMetrics,
      atRiskStudents,
    ] = await Promise.all([
      prisma.student.count({
        where: {
          currentClass: { staff: { some: { id: staff.id } } },
        },
      }),

      prisma.class.count({
        where: { staff: { some: { id: staff.id } } },
      }),

      prisma.course.count({
        where: { staff: { some: { id: staff.id } } },
      }),

      prisma.$queryRaw<any[]>`
          SELECT 
            c."id" AS "courseId",
            c."title" AS courseName, 
            cls."name" AS className,
            g."assessmentType", 
            g."semester",
            g."academicYear",
            AVG(g.score / g."maxScore" * 100) AS avgScore
          FROM "grades" g
          INNER JOIN "courses" c ON g."courseId" = c."id"
          INNER JOIN "students" s ON g."studentId" = s."id"
          INNER JOIN "classes" cls ON s."classId" = cls."id"
          INNER JOIN "_CourseStaff" cts ON c."id" = cts."A" 
          WHERE cts."B" = ${staff.id}
          
          GROUP BY 
            c."id", 
            c."title", 
            cls."name", 
            g."academicYear", 
            g."semester", 
            g."assessmentType"
          ORDER BY g."academicYear" DESC, g."semester" DESC
        `,
      prisma.$queryRaw<any[]>`
      WITH student_scores AS (
        SELECT 
          g."studentId",
          c."title" AS "courseName", 
          cls."name" AS "className",
          g."semester", 
          g."academicYear",
          SUM(
            g."score" / g."maxScore" * 100 * CASE 
              WHEN g."assessmentType" = 'Assignment' THEN 0.1
              WHEN g."assessmentType" = 'Project' THEN 0.2
              WHEN g."assessmentType" = 'Midterm' THEN 0.3
              WHEN g."assessmentType" = 'Examination' THEN 0.4
              ELSE 0.0
            END
          ) AS "totalStudentScore"
          FROM "grades" g
        INNER JOIN "courses" c ON g."courseId" = c."id"
    INNER JOIN "students" s ON g."studentId" = s."id"
    INNER JOIN "classes" cls ON s."classId" = cls."id"
    INNER JOIN "_CourseStaff" cts ON c."id" = cts."A" 
    WHERE cts."B" = ${staff.id}
    GROUP BY g."studentId", c."id", c."title", cls."name", g."semester", g."academicYear"
      )
      SELECT 
        "courseName" as "coursename",
        "className" as "classname",
        "semester",
        "academicYear",
        MAX("totalStudentScore") AS "maxscore"
      FROM student_scores
      GROUP BY "courseName", "className", "semester", "academicYear"
    `,

      prisma.$queryRaw<any[]>`
  WITH student_total_scores AS (
    SELECT 
      s."id" AS "studentId",
      s."firstName",
      s."lastName",
      s."middleName",
      s."gender",
      c."id" AS "courseId",
      c."title" AS "courseName", 
      cls."name" AS "className",
      g."semester", 
      g."academicYear",

      SUM(
        g."score" / g."maxScore" * 100 * CASE 
          WHEN g."assessmentType" = 'Assignment' THEN 0.1
          WHEN g."assessmentType" = 'Project' THEN 0.2
          WHEN g."assessmentType" = 'Midterm' THEN 0.3
          WHEN g."assessmentType" = 'Examination' THEN 0.4
          ELSE 0.0
        END
      ) AS "totalScore"
      
    FROM "grades" g
    INNER JOIN "courses" c ON g."courseId" = c."id"
    INNER JOIN "students" s ON g."studentId" = s."id"
    INNER JOIN "classes" cls ON s."classId" = cls."id"
    INNER JOIN "_CourseStaff" cts ON c."id" = cts."A" 
    
    WHERE cts."B" = ${staff.id}
    
    GROUP BY 
      s."id", s."firstName", s."lastName", s."middleName", c."id", c."title", cls."name", g."semester", g."academicYear"
  )
  SELECT * 
  FROM student_total_scores
  WHERE "totalScore" < ${atRiskScore}
  ORDER BY "academicYear" DESC, "semester" DESC, "totalScore" ASC;
`,
    ]);

    const averagesArray: any[] = [];
    // const maximumsArray: any[] = [];

    const maximumsMap: Record<string, any> = {};

    maxMetrics.forEach((item) => {
      const {
        coursename: courseName,
        classname: className,
        semester,
        academicYear,
        maxscore: maxStudentScore, // This is the actual single student's peak score!
      } = item;

      const shortName = shortenCourseNames(courseName);
      const baseLabel =
        shortName === "Math (Cor)"
          ? "C Math"
          : shortName === "Math (Elec)"
            ? "E Math"
            : shortName;
      const label = `${baseLabel} - ${className.split(" ")[1]}`;
      const lookupKey = `${label}_${semester}_${academicYear}`;

      if (!maximumsMap[lookupKey]) {
        maximumsMap[lookupKey] = {
          courseName: label,
          className,
          semester,
          academicYear,
          total: parseFloat(Number(maxStudentScore).toFixed(2)), // Direct assignment
        };
      }
    });

    const maximumsArray = Object.values(maximumsMap);

    performanceMetrics.forEach((item) => {
      const {
        coursename: courseName,
        classname: className,
        semester,
        academicYear,
        assessmentType,
        avgscore: avgScore,
      } = item;

      const shortName = shortenCourseNames(courseName);
      const label = `${shortName === "Math (Cor)" ? "C Math" : shortName === "Math (Elec)" ? "E Math" : shortName} - ${className.split(" ")[1]}`;

      let avgEntry = averagesArray.find(
        (e: any) =>
          e.courseName === label &&
          e.semester === semester &&
          e.academicYear === academicYear,
      );

      if (!avgEntry) {
        avgEntry = {
          courseName: label,
          className,
          semester,
          academicYear,
          total: 0,
        };
        ALL_TYPES.forEach((type) => (avgEntry[type] = 0));
        averagesArray.push(avgEntry);
      }

      const weight = ASSESSMENT_WEIGHTS[assessmentType];
      const averageValue = parseFloat(Number(avgScore).toFixed(2));

      const weightedAvg = parseFloat((averageValue * weight).toFixed(2));

      avgEntry[assessmentType] = weightedAvg;

      avgEntry.total = parseFloat((avgEntry.total + weightedAvg).toFixed(2));
    });

    return {
      studentCount,
      classCount,
      courseCount,
      averages: averagesArray,
      maximums: maximumsArray,
      atRiskStudents,
    };
  } catch (e) {
    console.error("Failed to fetch dashboard data", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "An unexpected error has occurred!",
    };
  }
};
