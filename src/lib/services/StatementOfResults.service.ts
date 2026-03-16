import { prisma } from "../prisma";
import { getGradeInfo } from "./transcripts.service";

export class StatementOfResultsService {
  static async generate(
    studentId: string,
    academicYear: number,
    semester: string,
  ) {
    // 1. Fetch current semester grades + ALL previous grades (for CGPA/CGV)
    const allGrades = await prisma.grade.findMany({
      where: { studentId },
      include: {
        course: true,
        student: {
          select: { firstName: true, lastName: true, studentNumber: true },
        },
      },
      orderBy: [{ academicYear: "asc" }, { semester: "asc" }],
    });

    // 2. Separate current semester from history
    const currentGrades = allGrades.filter(
      (g) => g.academicYear === academicYear && g.semester === semester,
    );

    if (currentGrades.length === 0) {
      throw new Error("No results found for the specified period.");
    }

    // 3. Process Current Semester (Aggregating Assessments by Course)
    const courseMap = new Map();

    currentGrades.forEach((g) => {
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
      const contribution = (g.score / g.maxScore) * 100 * (g.weight || 1.0);
      course.totalWeighted += contribution;
      course.breakdown.push({
        type: g.assessmentType,
        rawScore: `${g.score}/${g.maxScore}`,
        contribution: contribution.toFixed(2) + "%",
      });
    });

    // 4. Calculate Current Semester TGP (Total Grade Point) and TCR (Total Credits Registered)
    let tgp = 0; // Current Semester Quality Points
    let tcr = 0; // Current Semester Credits

    const currentResults = Array.from(courseMap.values()).map((c) => {
      const { letter, point } = getGradeInfo(c.totalWeighted);
      tgp += point * c.credits;
      tcr += c.credits;
      return { ...c, grade: letter, points: point };
    });

    // 5. Calculate Cumulative Stats (CGV, CCR, CGPA)
    const historicalStats = this.calculateHistory(allGrades);

    return {
      student: allGrades[0].student,
      metadata: {
        academicYear,
        semester,
        dateGenerated: new Date().toLocaleDateString("en-GH"),
      },
      results: currentResults,
      summary: {
        // Current Semester
        tgp: tgp.toFixed(2),
        tcr: tcr,
        gpa: tcr > 0 ? (tgp / tcr).toFixed(2) : "0.00",
        // Cumulative
        cgv: historicalStats.cgv,
        ccr: historicalStats.ccr,
        cgpa: historicalStats.cgpa,
      },
    };
  }

  private static calculateHistory(grades: any[]) {
    const historicalCourseMap = new Map<
      string,
      { totalWeighted: number; credits: number }
    >();

    // Collapse multiple assessment rows into one Course Total per Term
    grades.forEach((g) => {
      const courseTermKey = `${g.courseId}-${g.academicYear}-${g.semester}`;

      if (!historicalCourseMap.has(courseTermKey)) {
        historicalCourseMap.set(courseTermKey, {
          totalWeighted: 0,
          credits: g.course.credits || 0,
        });
      }

      const entry = historicalCourseMap.get(courseTermKey)!;
      const contribution = (g.score / g.maxScore) * 100 * (g.weight || 1.0);
      entry.totalWeighted += contribution;
    });

    let cgv = 0; // Cumulative Grade Value (Total Quality Points)
    let ccr = 0; // Cumulative Credits Registered

    historicalCourseMap.forEach((data) => {
      const { point } = getGradeInfo(data.totalWeighted);
      cgv += point * data.credits;
      ccr += data.credits;
    });

    return {
      cgv: cgv.toFixed(2),
      ccr: ccr,
      cgpa: ccr > 0 ? (cgv / ccr).toFixed(2) : "0.00",
    };
  }
}
