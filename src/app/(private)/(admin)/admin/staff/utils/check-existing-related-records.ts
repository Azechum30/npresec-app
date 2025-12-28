import { resolveRole } from "@/lib/resolve-staff-role";
import { StaffType } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { transformAndValidateStaffData } from "@/utils/staff-data-transformer";

export const filterBools = <T>(
  arr: (T | "" | false | null | undefined)[]
): T[] => {
  return arr.filter((item): item is T => Boolean(item));
};

export const checkExistingRelatedRecords = async (
  data: ReturnType<typeof transformAndValidateStaffData>,
  roleName: ReturnType<typeof resolveRole>
) => {
  const uniquesFields = [
    data.employeeId && { employeeId: data.employeeId },
    data.rgNumber && { rgNumber: data.rgNumber },
    data.ghcardNumber && { ghcardNumber: data.ghcardNumber },
    data.ssnitNumber && { ssnitNumber: data.ssnitNumber },
    data.licencedNumber && { licencedNumber: data.licencedNumber },
  ].filter(Boolean);

  const [existingStaff, existingUser, staffRole] = await Promise.all([
    uniquesFields.length
      ? prisma.staff.findFirst({
          where: {
            OR: filterBools(uniquesFields),
          },
        })
      : null,
    prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    }),

    prisma.role.findFirst({
      where: {
        name: roleName,
      },
      select: {
        id: true,
      },
    }),
  ]);

  console.log("Existing Staff:", existingStaff);

  if (!staffRole) {
    return { error: `Role "${roleName}" not found in the database.` };
  }

  if (existingUser && existingUser.email === data.email) {
    return { error: `A user with the email "${data.email}" already exists.` };
  }
  if (
    existingUser &&
    data.username &&
    existingUser.username === data.username
  ) {
    return {
      error: `A user with the username "${data.username}" already exists.`,
    };
  }
  if (existingStaff && existingStaff.employeeId === data.employeeId) {
    return {
      error: `A staff with the employee ID "${data.employeeId}" already exists.`,
    };
  }
  if (
    existingStaff &&
    data.rgNumber &&
    existingStaff.rgNumber === data.rgNumber
  ) {
    return {
      error: `A staff with the RG number "${data.rgNumber}" already exists.`,
    };
  }
  if (
    existingStaff &&
    data.ghcardNumber &&
    existingStaff.ghcardNumber === data.ghcardNumber
  ) {
    return {
      error: `A staff with the GH Card number "${data.ghcardNumber}" already exists.`,
    };
  }
  if (
    existingStaff &&
    data.ssnitNumber &&
    existingStaff.ssnitNumber === data.ssnitNumber
  ) {
    return {
      error: `A staff with the SSNIT number "${data.ssnitNumber}" already exists.`,
    };
  }
  if (
    existingStaff &&
    data.licencedNumber &&
    existingStaff.licencedNumber === data.licencedNumber
  ) {
    return {
      error: `A staff with the Licenced number "${data.licencedNumber}" already exists.`,
    };
  }

  return { staffRole };
};
