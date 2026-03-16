import { FullTranscriptTemplate } from "@/components/customComponents/FullTranscriptTemplate";
import { ASSESSMENT_WEIGHTS } from "@/lib/constants";
import { generateTranscriptVerificationQrcode } from "@/lib/generate-transcript-verification-qrcode";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { getGradeInfo } from "@/lib/services/transcripts.service";
import { StudentSelect } from "@/lib/types";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ studentId: string }> },
) => {
  try {
    const { hasPermission } = await getUserPermissions("export:grades");
    if (!hasPermission)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { studentId } = await params;

    // 1. Fetch Student and ALL published summaries (progression history)
    const [student, summaries] = await Promise.all([
      prisma.student.findUnique({
        where: { id: studentId },
        select: StudentSelect,
      }),
      prisma.semesterSummary.findMany({
        where: { studentId, isPublished: true },
        orderBy: [{ academicYear: "asc" }, { semester: "asc" }],
      }),
    ]);

    if (!student || summaries.length === 0) {
      return NextResponse.json(
        { error: "No academic records found" },
        { status: 404 },
      );
    }

    // 2. Fetch all grades for the student
    const allGrades = await prisma.grade.findMany({
      where: { studentId },
      include: { course: true },
    });

    // 3. Map each semester to its own results and summary block
    const semesters = summaries.map((summary) => {
      const semesterGrades = allGrades.filter(
        (g) =>
          g.academicYear === summary.academicYear &&
          g.semester === summary.semester,
      );

      // Group assessments into courses
      const courseMap = new Map();
      semesterGrades.forEach((g) => {
        if (!courseMap.has(g.courseId)) {
          courseMap.set(g.courseId, {
            code: g.course.code,
            title: g.course.title,
            credits: g.course.credits || 0,
            totalWeighted: 0,
          });
        }
        const course = courseMap.get(g.courseId);
        course.totalWeighted +=
          (g.score / g.maxScore) *
          100 *
          (g.weight || ASSESSMENT_WEIGHTS[g.assessmentType]);
      });

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
        academicYear: summary.academicYear,
        semester: summary.semester,
        results: formattedResults,
        // Individual Semester Summary
        tgp: summary.tgp.toFixed(2),
        tcr: summary.tcr,
        gpa: summary.gpa.toFixed(2),
        // Running Cumulative Totals for progression tracking
        cgv: summary.cgv.toFixed(2),
        ccr: summary.ccr,
        cgpa: summary.cgpa.toFixed(2),
      };
    });

    const data = {
      student,
      semesters, // Array of objects containing results + summary per semester
      metadata: {
        dateGenerated: new Date().toLocaleDateString("en-GH"),
        totalSemesters: semesters.length,
        finalCgpa: semesters[semesters.length - 1].cgpa,
      },
    };

    const qrcodeUrl = await generateTranscriptVerificationQrcode(studentId);
    const verifyUrl = `${env.NEXT_PUBLIC_URL}/verify-student-transcript/${studentId}`;

    const buffer = await renderToBuffer(
      <FullTranscriptTemplate
        data={data}
        verificationUrl={qrcodeUrl}
        verifyUrl={verifyUrl}
      />,
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Transcript-${studentId}.pdf"`,
      },
    });
  } catch (e) {
    console.error("Transcript Generation Error:", e);
    return NextResponse.json(
      { error: "Failed to generate transcript" },
      { status: 500 },
    );
  }
};
