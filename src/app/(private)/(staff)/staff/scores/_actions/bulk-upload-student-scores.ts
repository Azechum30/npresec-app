"use server";

import * as Sentry from "@sentry/nextjs";

import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { workflowClient } from "@/lib/server-only-actions/workflow";
import {
  AssesessmentSchema,
  BulkStudentsScoresSchema,
  BulkStudentsScoresType,
  Semester,
} from "@/lib/validation";
export const bulkUploadStudentsScores = async (values: unknown) => {
  try {
    const { user, hasPermission } = await getUserPermissions("create:grades");

    if (!user || !hasPermission)
      return {
        error: "You do not have sufficient permissions to perform this action",
      };

    const properFormattedData = (values as BulkStudentsScoresType).data.map(
      (grade) => ({
        ...grade,
        assessmentType:
          grade.assessmentType as (typeof AssesessmentSchema)[number],
        classId: grade.classId as string,
        courseId: grade.courseId as string,
        maxScore: parseInt(grade.maxScore.toString()),
        score: parseInt(grade.score.toString()),
        academicYear: parseInt(grade.academicYear.toString()),
        semester: grade.semester as (typeof Semester)[number],
      }),
    );

    const unverifiedData = BulkStudentsScoresSchema.safeParse({
      data: properFormattedData,
    });

    if (!unverifiedData.success) {
      return {
        error: unverifiedData.error.issues.flatMap((e) => e.message).join("\n"),
      };
    }

    const { data } = unverifiedData.data;

    const staffData = await prisma.staff.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!staffData) {
      return { error: "You cannot perform this actions" };
    }

    const classNames = [...new Set(data.map((item) => item.classId))];
    const courseNames = [...new Set(data.map((item) => item.courseId))];
    const studentNumbers = [...new Set(data.map((item) => item.studentId))];
    const semesters = [...new Set(data.map((s) => s.semester))];
    const academicYears = [...new Set(data.map((item) => item.academicYear))];
    const assessmentTypes = [
      ...new Set(data.map((item) => item.assessmentType)),
    ];

    const [existingClasses, existingCourses, existingStudents] =
      await Promise.all([
        prisma.class.findMany({
          where: {
            name: { in: classNames },
            staff: { some: { id: staffData.id } },
          },
          select: { id: true, name: true },
        }),

        prisma.course.findMany({
          where: {
            title: { in: courseNames },
            staff: { some: { id: staffData.id } },
          },
          select: { id: true, title: true },
        }),

        prisma.student.findMany({
          where: {
            studentNumber: { in: studentNumbers },
            currentClass: { staff: { some: { id: staffData.id } } },
          },
          select: { id: true, studentNumber: true },
        }),
      ]);

    if (!existingClasses) {
      return { error: "All classes uploaded do not exist" };
    }

    if (!existingCourses) {
      return { error: "All courses uploaded do not exist" };
    }

    if (!existingStudents) {
      return { error: "All students uploaded do not exist in the system" };
    }

    const classMap = new Map(existingClasses.map((cls) => [cls.name, cls]));
    const courseMap = new Map(existingCourses.map((crs) => [crs.title, crs]));
    const studentMap = new Map(
      existingStudents.map((st) => [st.studentNumber, st]),
    );

    const filteredData = data.map((grade) => {
      const isCourseId = courseMap.has(grade.courseId);
      const isClassId = classMap.has(grade.classId);
      const isStudent = studentMap.has(grade.studentId);

      if (!isClassId || !isCourseId || !isStudent) return null;
      return {
        ...grade,
        classId: classMap.get(grade.classId) as { id: string; name: string },
        courseId: courseMap.get(grade.courseId) as {
          id: string;
          title: string;
        },
        studentId: studentMap.get(grade.studentId) as {
          id: string;
          studentNumber: string;
        },
      };
    });

    const transformedData = filteredData.filter((grade) => grade !== null);

    const students = [
      ...new Set(transformedData.map((grade) => grade.studentId.id)),
    ];
    const courses = [
      ...new Set(transformedData.map((grade) => grade.courseId.id)),
    ];

    const [existingScores, timelines] = await Promise.all([
      prisma.grade.findMany({
        where: {
          academicYear: { in: academicYears },
          semester: { in: semesters },
          courseId: { in: courses },
          studentId: { in: students },
          assessmentType: { in: assessmentTypes },
        },
      }),

      prisma.assessmentTimeline.findMany({
        where: {
          assessmentType: { in: assessmentTypes },
          semester: { in: semesters },
          academicYear: { in: academicYears },
          courseId: { in: courses },
        },
        select: {
          startDate: true,
          endDate: true,
          assessmentType: true,
        },
      }),
    ]);

    const errors: string[] = [];
    const now = new Date();

    if (!timelines) {
      return {
        error: "No timelines has been set for the assessment modes uploaded",
      };
    }

    timelines.map((timeline) => {
      if (timeline.startDate > now) {
        errors.push(
          `The timeline set for ${timeline.assessmentType} will open on ${timeline.startDate.toLocaleDateString()}.`,
        );
      }

      if (now > timeline.endDate) {
        errors.push(
          `The timeline set for ${timeline.assessmentType} elapsed on ${timeline.endDate.toLocaleDateString()}.`,
        );
      }
    });

    if (errors.length > 0) {
      return { error: errors.join("\n") };
    }

    const DuplicateMap = new Map(
      existingScores.map((grade) => [grade.studentId, grade]),
    );

    const finalFilteredData = transformedData.filter(
      (grade) => !DuplicateMap.has(grade.studentId.id),
    );

    if (finalFilteredData.length > 0) {
      await workflowClient.trigger({
        url: `${env.UPSTASH_WORKFLOW_URL}/api/batch/students/scores/upload`,
        body: {
          data: finalFilteredData,
          userId: user.id,
          staffId: staffData.id,
        },
      });
      return { success: true, count: finalFilteredData.length };
    }

    return {
      error: `All ${data.length} students already have scores for the uploaded assessment mode for this semester and academic year`,
    };
  } catch (e) {
    console.error("Failed to queue scores", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "An unexpected error has occurred",
    };
  }
};
