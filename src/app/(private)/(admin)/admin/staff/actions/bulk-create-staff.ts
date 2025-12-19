"use server";

import { prisma } from "@/lib/prisma";
import { BulkCreateStaffSchema, BulkCreateStaffType } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { generatePassword } from "@/lib/generatePassword";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { hasPermissions } from "@/lib/hasPermission";
import { Prisma } from "@/generated/prisma/client";
import { client } from "@/utils/qstash";
import { env } from "@/lib/server-only-actions/validate-env";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const bulkCreateStaff = async (values: BulkCreateStaffType) => {
  const startTime = Date.now();

  try {
    // Validate permissions
    const permission = await hasPermissions("create:staff");
    if (!permission) {
      return { error: "Unauthorized access: insufficient permissions" };
    }

    const errors: string[] = [];

    // Early validation - check if we have data to process
    if (!values.data || values.data.length === 0) {
      return { error: "No staff data provided for bulk creation" };
    }

    // Limit batch size for performance
    const MAX_BATCH_SIZE = 100;
    if (values.data.length > MAX_BATCH_SIZE) {
      return {
        error: `Batch size too large. Maximum ${MAX_BATCH_SIZE} staff allowed per batch.`,
      };
    }

    // Validate the entire batch using Zod schema (accepts both strings and arrays for CSV compatibility)
    const validationResult = BulkCreateStaffSchema.safeParse(values);
    if (!validationResult.success) {
      const validationErrors = validationResult.error.issues.map(
        (issue) =>
          `Row ${issue.path[1] ? (issue.path[1] as number) + 1 : "unknown"}: ${issue.message}`
      );
      return { error: validationErrors.join("; ") };
    }

    const validData = validationResult.data;

    // Transform string inputs to arrays after validation (for CSV compatibility)
    const transformedData = validData.data.map((staff) => ({
      ...staff,
      classes:
        typeof staff.classes === "string"
          ? staff.classes
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : staff.classes,
      courses:
        typeof staff.courses === "string"
          ? staff.courses
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : staff.courses,
    }));

    // Convert names to IDs for departments, classes, and courses
    const allDepartmentNames = [
      ...new Set(transformedData.map((s) => s.departmentId).filter(Boolean)),
    ];
    const allClassNames = [
      ...new Set(
        transformedData.flatMap((s) => s.classes || []).filter(Boolean)
      ),
    ];
    const allCourseCodes = [
      ...new Set(
        transformedData.flatMap((s) => s.courses || []).filter(Boolean)
      ),
    ];

    // Look up departments by name
    const departments = await prisma.department.findMany({
      where: {
        name: { in: allDepartmentNames as string[] },
      },
      select: { id: true, name: true },
    });

    // Look up classes by name
    const classes = await prisma.class.findMany({
      where: {
        name: { in: allClassNames as string[] },
      },
      select: { id: true, name: true },
    });

    // Look up courses by code
    const courses = await prisma.course.findMany({
      where: {
        title: { in: allCourseCodes as string[] },
      },
      select: { id: true, title: true },
    });

    // Create lookup maps
    const departmentMap = new Map(departments.map((d) => [d.name, d.id]));
    const classMap = new Map(classes.map((c) => [c.name, c.id]));
    const courseMap = new Map(courses.map((c) => [c.title, c.id]));

    console.log(courseMap);

    // Check for missing references
    const missingDepartments = allDepartmentNames.filter(
      (name) => !departmentMap.has(name as string)
    );
    const missingClasses = allClassNames.filter((name) => !classMap.has(name));
    const missingCourses = allCourseCodes.filter(
      (code) => !courseMap.has(code)
    );

    if (missingDepartments.length > 0) {
      errors.push(`Departments not found: ${missingDepartments.join(", ")}`);
    }
    if (missingClasses.length > 0) {
      errors.push(`Classes not found: ${missingClasses.join(", ")}`);
    }
    if (missingCourses.length > 0) {
      errors.push(`Courses not found: ${missingCourses.join(", ")}`);
    }

    if (errors.length > 0) {
      return { error: errors.join("; ") };
    }

    // Transform data to use IDs instead of names
    const dataWithIds = transformedData.map((staff) => ({
      ...staff,
      departmentId: staff.departmentId
        ? departmentMap.get(staff.departmentId)
        : undefined,
      classes: staff.classes
        ? staff.classes.map((name) => classMap.get(name)).filter(Boolean)
        : undefined,
      courses: staff.courses
        ? staff.courses.map((code) => courseMap.get(code)).filter(Boolean)
        : undefined,
    }));

    // Check for duplicates within the batch and against existing records
    const employeeIds = dataWithIds.map((staff) => staff.employeeId);
    const emails = dataWithIds.map((staff) => staff.email.toLowerCase());
    const usernames = dataWithIds.map((staff) => staff.username);

    // Check for duplicates within the batch
    const uniqueEmployeeIds = new Set(employeeIds);
    const uniqueEmails = new Set(emails);
    const uniqueUsernames = new Set(usernames);

    if (uniqueEmployeeIds.size !== employeeIds.length) {
      errors.push("Duplicate employee IDs found within the batch");
    }

    if (uniqueEmails.size !== emails.length) {
      errors.push("Duplicate emails found within the batch");
    }

    if (uniqueUsernames.size !== usernames.length) {
      errors.push("Duplicate usernames found within the batch");
    }

    // Check against existing database records
    const [existingStaff, existingUsers] = await Promise.all([
      prisma.staff.findMany({
        where: {
          employeeId: { in: employeeIds },
        },
        select: { employeeId: true },
      }),
      prisma.user.findMany({
        where: {
          OR: [{ email: { in: emails } }, { username: { in: usernames } }],
        },
        select: { email: true, username: true },
      }),
    ]);

    const existingEmployeeIds = existingStaff.map((s) => s.employeeId);
    const existingUserEmails = existingUsers.map((u) => u.email);
    const existingUserUsernames = existingUsers.map((u) => u.username);

    if (existingEmployeeIds.length > 0) {
      errors.push(
        `Employee IDs already exist: ${existingEmployeeIds.join(", ")}`
      );
    }

    if (existingUserEmails.length > 0) {
      errors.push(`Emails already exist: ${existingUserEmails.join(", ")}`);
    }

    if (existingUserUsernames.length > 0) {
      errors.push(
        `Usernames already exist: ${existingUserUsernames.join(", ")}`
      );
    }

    if (errors.length > 0) {
      return { error: errors.join("; ") };
    }

    // Get all possible roles for staff members
    const roles = await prisma.role.findMany({
      where: {
        name: {
          in: ["teaching_staff", "admin_staff", "support_staff", "staff"],
        },
      },
      select: { id: true, name: true },
    });

    const roleMap = new Map(roles.map((role) => [role.name, role.id]));

    if (roleMap.size === 0) {
      return { error: "Required staff roles not found in the system" };
    }

    // Process staff creation in batches to avoid overwhelming the database
    const BATCH_SIZE = 10;
    const results: Array<{
      employeeId: string;
      status: "success" | "failed";
      email: string;
      error?: string;
    }> = [];
    const createdUsers: Array<any & { password: string }> = [];
    const createdStaff: any[] = [];

    for (let i = 0; i < dataWithIds.length; i += BATCH_SIZE) {
      const batch = dataWithIds.slice(i, i + BATCH_SIZE);

      // Create users first
      for (const staffData of batch) {
        try {
          const password = generatePassword();

          // Determine appropriate role based on staff type and category
          let roleName = "staff"; // fallback
          if (staffData.staffType === "Teaching") {
            roleName = "teaching_staff";
          } else if (staffData.staffType === "Non_Teaching") {
            if (staffData.staffCategory === "Professional") {
              roleName = "admin_staff";
            } else if (staffData.staffCategory === "Non_Professional") {
              roleName = "support_staff";
            }
          }

          const roleId = roleMap.get(roleName);
          if (!roleId) {
            errors.push(`Role '${roleName}' not found for ${staffData.email}`);
            continue;
          }

          await auth.api.signUpEmail({
            body: {
              email: staffData.email.toLowerCase(),
              password,
              name: `${staffData.firstName} ${staffData.lastName}`,
              username: staffData.username,
              callbackURL: "/email-verified",
            },
            headers: await headers(),
          });

          const user = await prisma.user.findUnique({
            where: { email: staffData.email.toLowerCase() },
          });

          if (user) {
            // Update user role
            await prisma.user.update({
              where: { id: user.id },
              data: { roleId },
            });

            createdUsers.push({ ...user, password, roleName });
          }
        } catch (userError) {
          console.error(
            `Failed to create user for ${staffData.email}:`,
            userError
          );
          errors.push(`Failed to create user account for ${staffData.email}`);
        }
      }

      // Create staff records
      for (let j = 0; j < batch.length; j++) {
        const staffData = batch[j];
        const userIndex = i + j;

        if (userIndex >= createdUsers.length) continue;

        const user = createdUsers[userIndex];

        try {
          const staffRecord = await prisma.staff.create({
            data: {
              employeeId: staffData.employeeId,
              firstName: staffData.firstName,
              lastName: staffData.lastName,
              middleName: staffData.middleName,
              birthDate: new Date(staffData.birthDate),
              dateOfFirstAppointment: staffData.dateOfFirstAppointment
                ? new Date(staffData.dateOfFirstAppointment)
                : undefined,
              staffType: staffData.staffType,
              staffCategory: staffData.staffCategory,
              gender: staffData.gender,
              maritalStatus: staffData.maritalStatus,
              rgNumber: staffData.rgNumber?.trim() || undefined,
              rank: staffData.rank,
              academicQual: staffData.academicQual,
              ssnitNumber: staffData.ssnitNumber?.trim() || undefined,
              ghcardNumber: staffData.ghcardNumber?.trim() || undefined,
              phone: staffData.phone,
              licencedNumber: staffData.licencedNumber?.trim() || undefined,
              department: staffData.departmentId
                ? { connect: { id: staffData.departmentId } }
                : undefined,

              courses: staffData.courses
                ? {
                    connect: staffData.courses.map((courseId) => ({
                      id: courseId,
                    })),
                  }
                : undefined,
              classes: staffData.classes
                ? {
                    connect: staffData.classes.map((classId) => ({
                      id: classId,
                    })),
                  }
                : undefined,
              user: { connect: { id: user.id } },
            },
          });

          createdStaff.push(staffRecord);

          // Send welcome email
          const emailData = {
            to: [staffData.email],
            username: staffData.firstName,
            data: {
              lastName: staffData.lastName,
              email: staffData.email,
              password: user.password,
            },
          };

          await client.publishJSON({
            url: `${env.NEXT_PUBLIC_URL}/api/send/emails`,
            body: emailData,
          });

          results.push({
            employeeId: staffData.employeeId,
            status: "success",
            email: staffData.email,
          });
        } catch (staffError) {
          console.error(
            `Failed to create staff record for ${staffData.employeeId}:`,
            staffError
          );
          errors.push(
            `Failed to create staff record for ${staffData.employeeId}`
          );
          results.push({
            employeeId: staffData.employeeId,
            status: "failed",
            email: staffData.email,
            error: getErrorMessage(staffError),
          });
        }
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (errors.length > 0) return { errors };

    revalidatePath("/admin/staff");

    return {
      success: true,
      count: results.length,
    };
  } catch (error) {
    console.error("Bulk staff creation failed:", error);
    return {
      error: `Bulk creation failed: ${getErrorMessage(error)}`,
    };
  }
};
