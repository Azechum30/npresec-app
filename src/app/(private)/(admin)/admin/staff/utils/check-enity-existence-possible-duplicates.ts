import { prisma } from "@/lib/prisma";
import { validateAndTransformBulkData } from "./validate-and-transform-bulk-data";
import { filterBools } from "./check-existing-related-records";
import { resolveRole } from "@/lib/resolve-staff-role";
import { generatePassword } from "@/lib/generatePassword";

export const checkEntityExistencePossibleDuplicates = async (
  data: ReturnType<typeof validateAndTransformBulkData>
) => {
  const emails = [...new Set(data.map((st) => st.email).filter(Boolean))];
  const usernames = [...new Set(data.map((st) => st.username).filter(Boolean))];

  const employeeIds = [
    ...new Set(data.map((st) => st.employeeId).filter(Boolean)),
  ];
  const rgNumbers = [...new Set(data.map((st) => st.rgNumber).filter(Boolean))];
  const ghcardNumbers = [
    ...new Set(data.map((st) => st.ghcardNumber).filter(Boolean)),
  ];
  const licencedNumbers = [
    ...new Set(data.map((st) => st.licencedNumber).filter(Boolean)),
  ];
  const ssnitNumbers = [
    ...new Set(data.map((st) => st.ssnitNumber).filter(Boolean)),
  ];

  const [
    existingDepartments,
    existingClasses,
    existingCourses,
    existingUsers,
    existingStaff,
    existingRoles,
  ] = await Promise.all([
    prisma.department.findMany({
      where: {
        name: {
          in: [...new Set(data.map((dp) => dp.departmentId as string))],
        },
      },
      select: { id: true, name: true },
    }),

    prisma.class.findMany({
      where: { name: { in: data.flatMap((cl) => cl.classes || []) } },
      select: { id: true, name: true },
    }),
    prisma.course.findMany({
      where: { title: { in: data.flatMap((co) => co.courses || []) } },
      select: { id: true, title: true },
    }),
    prisma.user.findMany({
      where: {
        OR: [{ email: { in: emails } }, { username: { in: usernames } }],
      },
      select: { email: true, username: true },
    }),

    prisma.staff.findMany({
      where: {
        OR: [
          { employeeId: { in: employeeIds } },
          { rgNumber: { in: filterBools(rgNumbers) } },
          { ghcardNumber: { in: filterBools(ghcardNumbers) } },
          { licencedNumber: { in: filterBools(licencedNumbers) } },
          { ssnitNumber: { in: filterBools(ssnitNumbers) } },
        ],
      },
      select: {
        employeeId: true,
        rgNumber: true,
        ghcardNumber: true,
        licencedNumber: true,
        ssnitNumber: true,
      },
    }),
    prisma.role.findMany({
      where: {
        name: {
          in: ["teaching_staff", "admin_staff", "support_staff", "staff"],
        },
      },
      select: { id: true, name: true },
    }),
  ]);

  const existingUserEmails = new Set(existingUsers.map((u) => u.email));
  const existingUsernames = new Set(existingUsers.map((u) => u.username));
  const existingEmployeeIds = new Set(existingStaff.map((s) => s.employeeId));
  const existingRgNumbers = new Set(
    existingStaff
      .map((s) => s.rgNumber)
      .filter((num): num is string => typeof num === "string")
  );
  const existingGhcardNumbers = new Set(
    existingStaff
      .map((s) => s.ghcardNumber)
      .filter((num): num is string => typeof num === "string")
  );
  const existingLicencedNumbers = new Set(
    existingStaff
      .map((s) => s.licencedNumber)
      .filter((num): num is string => typeof num === "string")
  );
  const existingSsnitNumbers = new Set(
    existingStaff
      .map((s) => s.ssnitNumber)
      .filter((num): num is string => typeof num === "string")
  );

  const filteredData = data.filter((item) => {
    const isDuplicateUser =
      existingUserEmails.has(item.email) ||
      existingUsernames.has(item.username);

    const isDuplicateStaff =
      existingEmployeeIds.has(item.employeeId) ||
      existingRgNumbers.has(item.rgNumber || "") ||
      existingGhcardNumbers.has(item.ghcardNumber || "") ||
      existingLicencedNumbers.has(item.licencedNumber || "") ||
      existingSsnitNumbers.has(item.ssnitNumber || "");

    return !isDuplicateUser && !isDuplicateStaff;
  });

  const departmentMap = new Map(existingDepartments.map((d) => [d.name, d.id]));
  const classMap = new Map(existingClasses.map((c) => [c.name, c.id]));
  const courseMap = new Map(existingCourses.map((c) => [c.title, c.id]));
  const roleMap = new Map(existingRoles.map((r) => [r.name, r.id]));

  const transformedData = filteredData.map((item) => {
    const roleName = resolveRole(item);

    return {
      ...item,
      classes: item.classes
        ?.map((title) => classMap.get(title))
        .filter(Boolean),
      courses: item.courses?.map((name) => courseMap.get(name)).filter(Boolean),
      departmentId: item.departmentId
        ? departmentMap.get(item.departmentId)
        : undefined,

      roleId: roleMap.get(roleName) as string,
      password: generatePassword(),
    };
  });

  return { transformedData };
};
