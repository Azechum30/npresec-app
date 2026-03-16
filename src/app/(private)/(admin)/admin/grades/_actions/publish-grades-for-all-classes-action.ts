"use server";

import { getUserPermissions } from "@/lib/get-session";
// import { getErrorMessage } from "@/lib/get-session"; // Corrected import based on your snippet
import { prisma } from "@/lib/prisma";
import { StatementOfResultsService } from "@/lib/services/StatementOfResults.service";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

const semesterOrder: Record<string, number> = {
  First: 1,
  Second: 2,
};

export const publishGradesForAllClassesAction = async (
  previousState: any,
  formData: FormData,
): Promise<{ success?: boolean; error?: string }> => {
  const academicYear = parseInt(
    (formData.get("academicYear") as string) || "0",
  );
  const semester = formData.get("semester") as string;

  try {
    const { hasPermission } = await getUserPermissions("view:grades");
    if (!hasPermission) return { error: "Permission denied" };

    if (!(academicYear && semester))
      return { error: "class ID, academic year and semester are required!" };

    const students = await prisma.student.findMany({
      select: { id: true },
    });

    const results = await Promise.all(
      students.map(async (student) => {
        try {
          const gradeSummaries = await StatementOfResultsService.generate(
            student.id,
            academicYear,
            semester,
          );
          return { studentId: student.id, ...gradeSummaries };
        } catch (e) {
          console.log("Error generating summaries for " + student.id);
          return null;
        }
      }),
    );

    const validResults = results.filter((item) => item !== null);

    if (validResults.length === 0)
      return {
        error:
          "No results for any student in this class for this semester of the selected academic year.",
      };

    const ranked = validResults.sort(
      (a, b) => parseFloat(b.summary.gpa) - parseFloat(a.summary.gpa),
    );

    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < ranked.length; i++) {
        const item = ranked[i];
        await tx.semesterSummary.upsert({
          where: {
            studentId_academicYear_semester: {
              studentId: item.studentId,
              academicYear,
              semester: semester as any,
            },
          },
          update: {
            tgp: parseFloat(item.summary.tgp),
            tcr: item.summary.tcr,
            gpa: parseFloat(item.summary.gpa),
            classRank: i + 1,
            totalStudents: ranked.length,
            isPublished: true,
          },
          create: {
            studentId: item.studentId,
            academicYear,
            semester: semester as any,
            tgp: parseFloat(item.summary.tgp),
            tcr: item.summary.tcr,
            gpa: parseFloat(item.summary.gpa),
            ccr: item.summary.ccr,
            cgv: parseFloat(item.summary.cgv),
            cgpa: parseFloat(item.summary.cgpa),
            classRank: i + 1,
            totalStudents: ranked.length,
            isPublished: true,
          },
        });
      }

      for (const student of students) {
        const allStudentSemesters = await tx.semesterSummary.findMany({
          where: { studentId: student.id, isPublished: true },
        });

        const sortedSemesters = allStudentSemesters.sort((a, b) => {
          if (a.academicYear !== b.academicYear) {
            return a.academicYear - b.academicYear;
          }
          return (
            (semesterOrder[a.semester] || 0) - (semesterOrder[b.semester] || 0)
          );
        });

        let runningCGV = 0;
        let runningCCR = 0;

        for (const summary of sortedSemesters) {
          runningCGV += summary.tgp;
          runningCCR += summary.tcr;
          const runningCGPA = runningCCR > 0 ? runningCGV / runningCCR : 0;

          await tx.semesterSummary.update({
            where: { id: summary.id },
            data: {
              cgv: runningCGV,
              ccr: runningCCR,
              cgpa: runningCGPA,
            },
          });
        }
      }
    });

    revalidatePath("/admin/grades");
    return { success: true };
  } catch (e) {
    console.error("Could not publish semester grades summaries", e);
    Sentry.captureException(e);
    return { error: "Something went wrong!" };
  }
};
