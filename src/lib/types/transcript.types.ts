import { Prisma } from "../../../prisma/generated/client";
import { Semester, AssessmentType } from "../../../prisma/generated/client";

export type GradePoints = 4.0 | 3.5 | 3.0 | 2.5 | 2.0 | 1.5 | 1.0 | 0.5 | 0.0;

export interface AssessmentBreakdown {
  assessmentType: AssessmentType;
  score: number;
  maxScore: number;
  weight: number;
  percentage: number;
}

export interface CourseGrade {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  grade: string;
  gradePoints: GradePoints;
  assessmentBreakdown: AssessmentBreakdown[];
  instructor?: string;
  remarks?: string;
}

export interface TranscriptSummary {
  semesterGPA: number;
  cumulativeGPA: number;
  totalCredits: number;
  totalGradePoints: number;
  academicStanding: string;
  coursesCompleted: number;
  coursesPassed: number;
  coursesFailed: number;
}

export interface TranscriptMetadata {
  generatedBy: string;
  generatedAt: Date;
  verifiedBy?: string;
  verificationDate?: Date;
  isOfficial: boolean;
}

export interface TranscriptData {
  courses: CourseGrade[];
  summary: TranscriptSummary;
  metadata: TranscriptMetadata;
}

export type TranscriptWithData = Prisma.TranscriptGetPayload<{
  include: {
    student: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        middleName: true;
        studentNumber: true;
        currentLevel: true;
        department: {
          select: {
            id: true;
            name: true;
            code: true;
          };
        };
        currentClass: {
          select: {
            id: true;
            name: true;
            code: true;
            level: true;
          };
        };
      };
    };
  };
}>;

export interface GenerateTranscriptParams {
  studentId: string;
  academicYear: number;
  semester?: Semester;
  isOfficial?: boolean;
}

export interface TranscriptCalculationResult {
  transcriptData: TranscriptData;
  gpa: number;
  totalCredits: number;
}
