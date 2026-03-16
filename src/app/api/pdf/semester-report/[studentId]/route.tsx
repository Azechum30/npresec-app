import { StatementOfResultsTemplate } from "@/components/StatementOfResultsTemplate";
import { ASSESSMENT_WEIGHTS } from "@/lib/constants";
import { generateQrcode } from "@/lib/generate-verification-qrcode";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { getGradeInfo } from "@/lib/services/transcripts.service";
import { StudentSelect } from "@/lib/types";
import { Semester } from "@/lib/validation";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ studentId: string }> },
) => {
  try {
    const { hasPermission } = await getUserPermissions("export:grades");

    if (!hasPermission)
      return NextResponse.json(
        { error: "You do not have permissions to perform this task" },
        { status: 403 },
      );

    const { studentId } = await params;

    const searchParams = new URL(req.url).searchParams;

    const semester = searchParams.get("semester") || "";
    const academicYear = parseInt(searchParams.get("academicYear") || "0");

    const summary = await prisma.semesterSummary.findUnique({
      where: {
        studentId_academicYear_semester: {
          studentId,
          academicYear,
          semester: semester as (typeof Semester)[number],
        },
      },
      include: { student: { select: StudentSelect } },
    });

    if (!summary || !summary.isPublished) {
      return NextResponse.json(
        { error: "Results are yet published" },
        { status: 403 },
      );
    }

    const grades = await prisma.grade.findMany({
      where: {
        studentId,
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
      const contribution =
        (g.score / g.maxScore) *
        100 *
        (g.weight || ASSESSMENT_WEIGHTS[g.assessmentType]);
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

    const data = {
      id: summary.id,
      student: summary.student,
      results: formattedResults,
      summary: {
        tgp: summary.tgp.toFixed(2),
        tcr: summary.tcr,
        gpa: summary.gpa.toFixed(2),
        cgv: summary.cgv.toFixed(2),
        ccr: summary.ccr,
        cgpa: summary.cgpa.toFixed(2),
        classRank: summary.classRank,
        totalStudents: summary.totalStudents,
        isPublished: summary.isPublished,
      },

      metadata: {
        academicYear,
        semester,
        dateGenerated: new Date().toLocaleDateString("en-GH"),
        studentId,
      },
    };
    const qrcodeVerificationUrl = await generateQrcode(
      studentId,
      semester,
      academicYear,
    );

    const queryParams = new URLSearchParams({
      semester: semester,
      academicYear: academicYear.toString(),
    });

    const verifyUrl = `${env.NEXT_PUBLIC_URL}/verify-results/${studentId}?${queryParams}`;

    const buffer = await renderToBuffer(
      <StatementOfResultsTemplate
        data={data}
        verificationUrl={qrcodeVerificationUrl}
        verifyUrl={verifyUrl}
      />,
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Statement-${studentId}.pdf"`,
      },
    });
  } catch (e) {
    console.error("Failed to generate PDF", e);
    return NextResponse.json(
      { error: "Failed to generate pdf" },
      { status: 500 },
    );
  }
};
