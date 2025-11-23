"use server";

import { prisma } from "@/lib/prisma";
import { GenerateTranscriptSchema } from "@/lib/validation";
import {
  generateAndSaveTranscript,
  generateTranscriptData,
} from "@/lib/services/transcript.service";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import * as Sentry from "@sentry/nextjs";

/**
 * Server action to generate a transcript for a student
 */
export const generateTranscriptAction = async (values: unknown) => {
  try {
    const { user, hasPermission } = await getUserWithPermissions(
      "generate:transcripts"
    );

    // if (!hasPermission) {
    //   return { error: "Permission denied" };
    // }

    const { error, success, data } = GenerateTranscriptSchema.safeParse(values);

    if (!success || error) {
      console.error(error);
      const errorMessage = error.errors.flatMap((e) => e.message).join("\n");
      return { error: errorMessage };
    }

    const { studentId, academicYear, semester, isOfficial } = data;

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentNumber: true,
      },
    });

    if (!student) {
      return { error: "Student not found" };
    }

    // Check if transcript already exists
    const existingTranscript = await prisma.transcript.findUnique({
      where: {
        studentId_academicYear_semester: {
          studentId,
          academicYear,
          semester: semester || null,
        },
      },
    });

    if (existingTranscript) {
      return {
        error: `Transcript already exists for ${student.firstName} ${student.lastName} (${student.studentNumber}) for ${academicYear} ${semester || "Full Year"}`,
        transcript: existingTranscript,
      };
    }

    // Generate and save transcript
    const transcript = await generateAndSaveTranscript({
      studentId,
      academicYear,
      semester,
      isOfficial: isOfficial || false,
    });

    return { transcript };
  } catch (e) {
    console.error("Could not generate transcript", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while generating transcript" };
  }
};

/**
 * Server action to preview transcript data without saving
 */
export const previewTranscriptAction = async (values: unknown) => {
  try {
    const { user, hasPermission } =
      await getUserWithPermissions("view:transcripts");

    // if (!hasPermission) {
    //   return { error: "Permission denied" };
    // }

    const { error, success, data } = GenerateTranscriptSchema.safeParse(values);

    if (!success || error) {
      console.error(error);
      const errorMessage = error.errors.flatMap((e) => e.message).join("\n");
      return { error: errorMessage };
    }

    const { studentId, academicYear, semester } = data;

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentNumber: true,
        currentLevel: true,
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        currentClass: {
          select: {
            id: true,
            name: true,
            code: true,
            level: true,
          },
        },
      },
    });

    if (!student) {
      return { error: "Student not found" };
    }

    // Generate transcript data without saving
    const { transcriptData, gpa, totalCredits } = await generateTranscriptData({
      studentId,
      academicYear,
      semester,
      isOfficial: false,
    });

    return {
      student,
      transcriptData,
      gpa,
      totalCredits,
      academicYear,
      semester,
    };
  } catch (e) {
    console.error("Could not preview transcript", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while previewing transcript" };
  }
};

/**
 * Server action to fetch a specific transcript
 */
export const getTranscriptAction = async (transcriptId: string) => {
  try {
    const { user, hasPermission } =
      await getUserWithPermissions("view:transcripts");

    // if (!hasPermission) {
    //   return { error: "Permission denied" };
    // }

    const transcript = await prisma.transcript.findUnique({
      where: { id: transcriptId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            studentNumber: true,
            currentLevel: true,
            dateEnrolled: true,
            graduationDate: true,
            department: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            currentClass: {
              select: {
                id: true,
                name: true,
                code: true,
                level: true,
              },
            },
          },
        },
      },
    });

    if (!transcript) {
      return { error: "Transcript not found" };
    }

    return { transcript };
  } catch (e) {
    console.error("Could not fetch transcript", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while fetching transcript" };
  }
};

/**
 * Server action to fetch all transcripts for a student
 */
export const getStudentTranscriptsAction = async (studentId: string) => {
  try {
    const { user, hasPermission } =
      await getUserWithPermissions("view:transcripts");

    // if (!hasPermission) {
    //   return { error: "Permission denied" };
    // }

    const transcripts = await prisma.transcript.findMany({
      where: { studentId },
      orderBy: [{ academicYear: "desc" }, { semester: "desc" }],
    });

    return { transcripts };
  } catch (e) {
    console.error("Could not fetch student transcripts", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while fetching transcripts" };
  }
};

/**
 * Server action to delete a transcript
 */
export const deleteTranscriptAction = async (transcriptId: string) => {
  try {
    const { user, hasPermission } =
      await getUserWithPermissions("delete:transcripts");

    // if (!hasPermission) {
    //   return { error: "Permission denied" };
    // }

    const transcript = await prisma.transcript.delete({
      where: { id: transcriptId },
    });

    return { transcript };
  } catch (e) {
    console.error("Could not delete transcript", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while deleting transcript" };
  }
};


