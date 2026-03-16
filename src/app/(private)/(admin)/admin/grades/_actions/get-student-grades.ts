"use server";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { StatementOfResultsService } from "@/lib/services/StatementOfResults.service";
import { getGradeInfo } from "@/lib/services/transcripts.service";
import { StudentSelect } from "@/lib/types";
import { Semester } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";

export const getStudentGrades = async (
  classId: string,
  academicYear: number,
  semester: string,
) => {
  try {
    const { hasPermission } = await getUserPermissions("view:grades");

    if (!hasPermission) return { error: "Permission denied" };

    if (!classId || !academicYear || !semester) {
      return { error: "Class ID, Academic year and semester are required" };
    }

    const summaries = await prisma.semesterSummary.findMany({
      where: {
        student: { classId },
        academicYear,
        semester,
      },
      include: {
        student: { select: StudentSelect },
      },
    });

    if (summaries.length === 0) {
      const studentIds = await prisma.student.findMany({
        where: { classId },
        select: StudentSelect,
      });

      const results = await Promise.all(
        studentIds.map(async (student, index) => {
          try {
            const result = await StatementOfResultsService.generate(
              student.id,
              academicYear,
              semester,
            );
            return { ...result, student, id: (index + 1).toString() };
          } catch (e) {
            console.log("Error generating results for ", student.firstName);
            return null;
          }
        }),
      );

      const validGrades = results.filter((r) => r !== null);

      return { grades: validGrades ?? [] };
    }

    const publishedResults = await Promise.all(
      summaries.map(async (sum) => {
        const grades = await prisma.grade.findMany({
          where: {
            studentId: sum.studentId,
            academicYear,
            semester: semester as (typeof Semester)[number],
          },

          include: { course: true },
        });

        const courseMap = new Map();
        grades.forEach((g) => {
          if (!courseMap.has(g.courseId)) {
            courseMap.set(g.courseId, {
              code: g.course.code,
              title: g.course.title,
              credits: g.course.credits || 0,
              totalWeighted: 0,
              breakdown: [],
            });
          }
          const course = courseMap.get(g.courseId);
          // Apply the same weighting formula
          const contribution = (g.score / g.maxScore) * 100 * (g.weight || 1.0);
          course.totalWeighted += contribution;
          course.breakdown.push({
            type: g.assessmentType,
            rawScore: `${g.score}/${g.maxScore}`,
            contribution: contribution.toFixed(2) + "%",
          });
        });

        // 3. Finalize the course list with Letter Grades and Points
        const formattedResults = Array.from(courseMap.values()).map((c) => {
          const { letter, point } = getGradeInfo(c.totalWeighted);
          return {
            ...c,
            grade: letter,
            points: point,
            totalWeighted: parseFloat(c.totalWeighted.toFixed(2)),
          };
        });

        return {
          id: sum.id,
          student: sum.student,
          summary: {
            tgp: sum.tgp.toFixed(2),
            tcr: sum.tcr,
            gpa: sum.gpa.toFixed(2),
            cgv: sum.cgv.toFixed(2),
            ccr: sum.ccr,
            cgpa: sum.cgpa.toFixed(2),
            totalStudents: sum.totalStudents,
            classRank: sum.classRank,
            isPublished: sum.isPublished,
          },

          results: formattedResults,

          metadata: {
            studentId: sum.studentId,
            dateGenerated: new Date().toLocaleDateString(),
            academicYear: academicYear,
            semester,
          },
        };
      }),
    );

    return { grades: publishedResults };
  } catch (e) {
    console.error("Could not fetch student grades: ", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong!",
    };
  }
};
