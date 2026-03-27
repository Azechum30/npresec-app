import { filterBools } from "@/app/(private)/(admin)/admin/staff/utils/check-existing-related-records";
import { validateAndTransformStudentsData } from "@/app/(private)/(admin)/admin/students/utils/validate-and-transform-students-data";
import { Prisma } from "@/generated/prisma/client";
import { computeGraduationDate } from "@/lib/compute-graduation-date";
import { generatePassword } from "@/lib/generatePassword";
import { prisma } from "@/lib/prisma";
import { createUserCredentials } from "@/utils/create-user-credentials";
import {
  Department,
  generateStudentIndex,
  gradelevels,
} from "@/utils/generateStudentIndex";
import { triggerRollback } from "@/utils/trigger-better-auth-user-delete";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  const body = (await req.json()) as ReturnType<
    typeof validateAndTransformStudentsData
  >;
  const data = body?.data;

  if (!data || !data.data) {
    console.error("[BULK_STUDENT_UPLOAD] Error: No data received.");
    return NextResponse.json(
      { error: "Students data was not received!" },
      { status: 400 },
    );
  }

  const classNames = [
    ...new Set(filterBools(data.data.map((item) => item.classId))),
  ];
  const deptNames = [
    ...new Set(filterBools(data.data.map((item) => item.departmentId))),
  ];

  const emails = data.data.map((s) => s.email.trim().toLowerCase());

  const [existingClasses, existingDepartments, existingRole, existingUsers] =
    await Promise.all([
      prisma.class.findMany({
        where: { name: { in: classNames } },
        select: { id: true, name: true },
      }),
      prisma.department.findMany({
        where: { name: { in: deptNames } },
        select: { id: true, name: true },
      }),
      prisma.role.findFirst({
        where: { name: "student" },
        select: { id: true },
      }),
      prisma.user.findMany({
        where: { email: { in: emails } },
        select: { email: true },
      }),
    ]);

  if (!existingRole) {
    return NextResponse.json(
      { error: "Student role not configured." },
      { status: 404 },
    );
  }

  // 2. Filter Existing Records (Uniqueness Check)
  const existingEmailSet = new Set(
    existingUsers.map((u) => u.email.toLowerCase()),
  );
  const initialCount = data.data.length;

  const filteredData = data.data.filter((student) => {
    const isDuplicate = existingEmailSet.has(
      student.email.trim().toLowerCase(),
    );
    if (isDuplicate) {
      console.warn(
        `[BULK_STUDENT_UPLOAD] Skipping existing user: ${student.email}`,
      );
    }
    return !isDuplicate;
  });

  const skippedCount = initialCount - filteredData.length;
  console.info(
    `[BULK_STUDENT_UPLOAD] Total: ${initialCount}, To Process: ${filteredData.length}, Skipped: ${skippedCount}`,
  );

  // Maps for O(1) lookups
  const classMap = new Map(existingClasses.map((c) => [c.name, c]));
  const deptMap = new Map(existingDepartments.map((d) => [d.name, d]));

  const CHUNK_SIZE = 15;
  const results = { successCount: 0, errors: [] as string[] };

  // 3. Chunked Processing
  for (let i = 0; i < filteredData.length; i += CHUNK_SIZE) {
    const chunk = filteredData.slice(i, i + CHUNK_SIZE);

    await Promise.all(
      chunk.map(async (student) => {
        const password = generatePassword();
        const targetClass = classMap.get(student.classId as string);
        const targetDept = deptMap.get(student.departmentId as string);

        if (!targetClass || !targetDept) {
          results.errors.push(`Row ${student.email}: Class/Dept not found.`);
          return;
        }

        let createUserId: string | null = null;

        try {
          const authUser = await createUserCredentials({
            email: student.email.trim().toLowerCase(),
            username: `${student.lastName}${Math.floor(Math.random() * 1000)}`, // Logic handles username uniqueness via randomness
            lastName: student.lastName,
            password,
            roleId: existingRole.id,
          });

          if (!authUser.user) throw new Error("Auth service failed");
          createUserId = authUser.user.id;

          await prisma.$transaction(async (tsx) => {
            const admissionYear = new Date(student.dateEnrolled).getFullYear();
            const latest = await tsx.student.findFirst({
              where: {
                departmentId: targetDept.id,
                dateEnrolled: { gte: new Date(admissionYear, 0, 1) },
              },
              orderBy: { studentNumber: "desc" },
              select: { studentNumber: true },
            });

            const seq = latest
              ? (parseInt(latest.studentNumber.slice(-3)) || 0) + 1
              : 1;
            const studentID = generateStudentIndex({
              admissionYear,
              department: targetDept.name as Department,
              sequenceNumber: seq,
            });

            const {
              classId,
              imageFile,
              email,
              photoURL,
              departmentId,
              ...rest
            } = student;

            await tsx.student.create({
              data: {
                ...rest,
                studentNumber: studentID,
                birthDate: new Date(rest.birthDate),
                dateEnrolled: new Date(rest.dateEnrolled),
                userId: authUser.user.id,
                classId: targetClass.id,
                departmentId: targetDept.id,
                currentLevel: rest.currentLevel as (typeof gradelevels)[number],
                graduationDate: rest.graduationDate
                  ? new Date(rest.graduationDate)
                  : computeGraduationDate(rest.dateEnrolled),
              },
            });

            await tsx.class.update({
              where: { id: targetClass.id },
              data: { currentEnrollment: { increment: 1 } },
            });
          });

          results.successCount++;
        } catch (e) {
          if (createUserId) {
            console.warn(
              `[BULK_STUDENT_UPLOAD] Rollback user ID: ${createUserId}`,
            );
            await triggerRollback(createUserId).catch(console.error);
          }
          const errorMsg =
            e instanceof Prisma.PrismaClientKnownRequestError
              ? `DB Error ${e.code}`
              : "Unknown Error";
          results.errors.push(`Failed row ${student.email}: ${errorMsg}`);
        }
      }),
    );
  }

  void revalidateTag("students-list", "seconds");

  return NextResponse.json(
    {
      success: true,
      processed: results.successCount,
      skipped: skippedCount,
      failed: results.errors.length,
      errors: results.errors,
    },
    { status: 200 },
  );
};

export const POST = verifySignatureAppRouter(handler);
