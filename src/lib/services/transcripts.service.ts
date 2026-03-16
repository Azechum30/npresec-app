import { GRADING_SCALE } from "../constants";
import { prisma } from "../prisma";

export const getGradeInfo = (score: number) =>
  GRADING_SCALE.find((grade) => score >= grade.min) ||
  GRADING_SCALE[GRADING_SCALE.length - 1];

export class TranscriptService {
  static async generate(studentId: string) {
    const rawScores = await prisma.grade.findMany({
      where: { studentId },
      include: {
        course: true,
      },
      orderBy: [{ academicYear: "desc" }, { semester: "desc" }],
    });

    // group by semester

    const semestersMap = new Map();

    rawScores.forEach((score) => {
      const semKey = `${score.academicYear}-${score.semester}`;

      if (!semestersMap.has(semKey)) {
        semestersMap.set(semKey, {
          label: `${score.semester} SEMESTER ${score.academicYear}`,
          courses: new Map(),
        });
      }
      0;
      const semester = semestersMap.get(semKey);

      if (!semester.courses.has(score.courseId)) {
        semester.courses.set(score.courseId, {
          code: score.course.code,
          credits: score.course.credits || 0,
          title: score.course.title,
          weigtedTotal: 0,
          isExempt: score.isExempt,
        });
      }

      const course = semester.courses.get(score.courseId);

      const contribution =
        (score.score / score.maxScore) * 100 * (score.weight || 1.0);

      course.weightedTotal += contribution;

      // calculate cummulative GPA

      let cummulativeQualityPoints = 0;
      let cummulativeCredits = 0;

      const transcript = Array.from(semestersMap.values()).map((semester) => {
        let semesterQualityPoints = 0;
        let semesterCredits = 0;

        const courseList = Array.from(semester.courses.values()).map(
          (course: any) => {
            const { letter, point } = getGradeInfo(course.weightedTotal);

            if (!course.isExempt) {
              semesterQualityPoints += point * course.credits;
              semesterCredits += course.credits;
            }

            return { ...course, points: point, grade: letter };
          },
        );

        cummulativeQualityPoints += semesterQualityPoints;
        cummulativeCredits += semesterCredits;

        return {
          semester: semester,
          courses: courseList,
          gpa:
            semesterCredits > 0
              ? (semesterQualityPoints / semesterCredits).toFixed(2)
              : "0.00",
        };
      });

      return {
        semesters: transcript,
        cgpa:
          cummulativeCredits > 0
            ? (cummulativeQualityPoints / cummulativeCredits).toFixed(2)
            : "0.00",
        totalCredits: cummulativeCredits,
      };
    });
  }
}
