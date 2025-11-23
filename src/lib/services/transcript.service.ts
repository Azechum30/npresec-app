import { prisma } from "@/lib/prisma";
import {
  TranscriptCalculationResult,
  TranscriptData,
  CourseGrade,
  TranscriptSummary,
  TranscriptMetadata,
  GradePoints,
  AssessmentBreakdown,
  GenerateTranscriptParams,
} from "@/lib/types/transcript.types";
import { Semester } from "../../../prisma/generated/client";

/**
 * Converts a numeric grade to letter grade and grade points
 */
export function calculateLetterGrade(percentage: number): {
  grade: string;
  gradePoints: GradePoints;
} {
  if (percentage >= 80) return { grade: "A1", gradePoints: 4.0 };
  if (percentage >= 75) return { grade: "B2", gradePoints: 3.5 };
  if (percentage >= 70) return { grade: "B3", gradePoints: 3.0 };
  if (percentage >= 65) return { grade: "C4", gradePoints: 2.5 };
  if (percentage >= 60) return { grade: "C5", gradePoints: 2.0 };
  if (percentage >= 55) return { grade: "C6", gradePoints: 1.5 };
  if (percentage >= 50) return { grade: "D7", gradePoints: 1.0 };
  if (percentage >= 40) return { grade: "E8", gradePoints: 0.5 };
  return { grade: "F9", gradePoints: 0.0 };
}

/**
 * Determines academic standing based on GPA
 */
export function getAcademicStanding(gpa: number): string {
  if (gpa >= 3.5) return "Excellent Standing";
  if (gpa >= 3.0) return "Good Standing";
  if (gpa >= 2.0) return "Satisfactory Standing";
  if (gpa >= 1.5) return "Academic Warning";
  return "Academic Probation";
}

/**
 * Fetches all grades for a student for a specific semester/year
 */
async function fetchStudentGrades(
  studentId: string,
  academicYear: number,
  semester?: Semester
) {
  return await prisma.grade.findMany({
    where: {
      studentId,
      academicYear,
      ...(semester && { semester }),
      isExempt: false, // Exclude exempted assessments
    },
    include: {
      course: {
        select: {
          id: true,
          code: true,
          title: true,
          credits: true,
        },
      },
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: [{ course: { code: "asc" } }, { assessmentType: "asc" }],
  });
}

/**
 * Fetches all previous transcripts for cumulative GPA calculation
 */
async function fetchPreviousTranscripts(studentId: string) {
  return await prisma.transcript.findMany({
    where: {
      studentId,
    },
    orderBy: [{ academicYear: "asc" }, { semester: "asc" }],
  });
}

/**
 * Calculates weighted average for a course based on all assessments
 */
function calculateCourseGrade(
  courseId: string,
  courseGrades: any[]
): {
  finalScore: number;
  finalPercentage: number;
  assessmentBreakdown: AssessmentBreakdown[];
} {
  const assessments: AssessmentBreakdown[] = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;

  courseGrades.forEach((grade) => {
    const weight = grade.weight || 1.0;
    const percentage = (grade.score / grade.maxScore) * 100;
    const weightedScore = percentage * weight;

    totalWeightedScore += weightedScore;
    totalWeight += weight;

    assessments.push({
      assessmentType: grade.assessmentType,
      score: grade.score,
      maxScore: grade.maxScore,
      weight: weight,
      percentage: percentage,
    });
  });

  const finalPercentage =
    totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  const finalScore = (finalPercentage / 100) * 100; // Assuming maxScore is 100

  return {
    finalScore,
    finalPercentage,
    assessmentBreakdown: assessments,
  };
}

/**
 * Groups grades by course
 */
function groupGradesByCourse(grades: any[]): Map<string, any[]> {
  const courseMap = new Map<string, any[]>();

  grades.forEach((grade) => {
    const courseId = grade.courseId;
    if (!courseMap.has(courseId)) {
      courseMap.set(courseId, []);
    }
    courseMap.get(courseId)!.push(grade);
  });

  return courseMap;
}

/**
 * Calculates semester GPA and summary
 */
function calculateSemesterSummary(
  courseGrades: CourseGrade[]
): TranscriptSummary {
  let totalGradePoints = 0;
  let totalCredits = 0;
  let coursesPassed = 0;
  let coursesFailed = 0;

  courseGrades.forEach((course) => {
    const creditPoints = course.gradePoints * course.credits;
    totalGradePoints += creditPoints;
    totalCredits += course.credits;

    if (course.gradePoints >= 1.0) {
      coursesPassed++;
    } else {
      coursesFailed++;
    }
  });

  const semesterGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

  return {
    semesterGPA: Number(semesterGPA.toFixed(2)),
    cumulativeGPA: 0, // Will be calculated later
    totalCredits,
    totalGradePoints: Number(totalGradePoints.toFixed(2)),
    academicStanding: getAcademicStanding(semesterGPA),
    coursesCompleted: courseGrades.length,
    coursesPassed,
    coursesFailed,
  };
}

/**
 * Calculates cumulative GPA from all previous transcripts
 */
function calculateCumulativeGPA(
  semesterSummary: TranscriptSummary,
  previousTranscripts: any[]
): number {
  let totalCumulativeGradePoints = semesterSummary.totalGradePoints;
  let totalCumulativeCredits = semesterSummary.totalCredits;

  previousTranscripts.forEach((transcript) => {
    if (transcript.gpa && transcript.totalCredits) {
      totalCumulativeGradePoints += transcript.gpa * transcript.totalCredits;
      totalCumulativeCredits += transcript.totalCredits;
    }
  });

  return totalCumulativeCredits > 0
    ? Number((totalCumulativeGradePoints / totalCumulativeCredits).toFixed(2))
    : semesterSummary.semesterGPA;
}

/**
 * Main function to generate transcript data
 */
export async function generateTranscriptData(
  params: GenerateTranscriptParams
): Promise<TranscriptCalculationResult> {
  const { studentId, academicYear, semester, isOfficial = false } = params;

  // Fetch student grades for the specified period
  const grades = await fetchStudentGrades(studentId, academicYear, semester);

  if (grades.length === 0) {
    throw new Error("No grades found for the specified period");
  }

  // Fetch previous transcripts for cumulative GPA
  const previousTranscripts = await fetchPreviousTranscripts(studentId);

  // Group grades by course
  const courseMap = groupGradesByCourse(grades);

  // Calculate grades for each course
  const courseGrades: CourseGrade[] = [];
  const processedCourseIds = new Set<string>();

  courseMap.forEach((courseGradesArray, courseId) => {
    if (processedCourseIds.has(courseId)) return;
    processedCourseIds.add(courseId);

    const firstGrade = courseGradesArray[0];
    const { finalScore, finalPercentage, assessmentBreakdown } =
      calculateCourseGrade(courseId, courseGradesArray);

    const { grade, gradePoints } = calculateLetterGrade(finalPercentage);

    const instructor =
      firstGrade.teacher?.firstName && firstGrade.teacher?.lastName
        ? `${firstGrade.teacher.firstName} ${firstGrade.teacher.lastName}`
        : undefined;

    courseGrades.push({
      courseId,
      courseCode: firstGrade.course.code,
      courseTitle: firstGrade.course.title,
      credits: firstGrade.course.credits || 0,
      grade,
      gradePoints,
      assessmentBreakdown,
      instructor,
    });
  });

  // Calculate semester summary
  const semesterSummary = calculateSemesterSummary(courseGrades);

  // Calculate cumulative GPA
  const cumulativeGPA = calculateCumulativeGPA(
    semesterSummary,
    previousTranscripts
  );

  // Update summary with cumulative GPA
  semesterSummary.cumulativeGPA = cumulativeGPA;
  semesterSummary.academicStanding = getAcademicStanding(cumulativeGPA);

  // Create metadata
  const metadata: TranscriptMetadata = {
    generatedBy: "system",
    generatedAt: new Date(),
    isOfficial,
  };

  // Build transcript data
  const transcriptData: TranscriptData = {
    courses: courseGrades,
    summary: semesterSummary,
    metadata,
  };

  return {
    transcriptData,
    gpa: cumulativeGPA,
    totalCredits: semesterSummary.totalCredits,
  };
}

/**
 * Saves transcript to database
 */
export async function saveTranscript(
  studentId: string,
  academicYear: number,
  semester: Semester | null,
  transcriptData: TranscriptData,
  gpa: number,
  totalCredits: number,
  isOfficial: boolean = false
) {
  return await prisma.transcript.create({
    data: {
      studentId,
      academicYear,
      semester,
      gpa,
      totalCredits,
      transcriptData: transcriptData as any,
      isOfficial,
    },
  });
}

/**
 * Generates and saves a transcript
 */
export async function generateAndSaveTranscript(
  params: GenerateTranscriptParams
) {
  const { studentId, academicYear, semester, isOfficial } = params;

  // Generate transcript data
  const { transcriptData, gpa, totalCredits } =
    await generateTranscriptData(params);

  // Save to database
  const transcript = await saveTranscript(
    studentId,
    academicYear,
    semester || null,
    transcriptData,
    gpa,
    totalCredits,
    isOfficial
  );

  return transcript;
}
