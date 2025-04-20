import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  const teacherRole = await prisma.role.upsert({
    where: { name: "teacher" },
    update: {},
    create: { name: "teacher" },
  });

  const studentRole = await prisma.role.upsert({
    where: { name: "student" },
    update: {},
    create: { name: "student" },
  });

  const parentRole = await prisma.role.upsert({
    where: { name: "parent" },
    update: {},
    create: { name: "parent" },
  });

  const creatDepartmentPermission = await prisma.permission.upsert({
    where: { name: "create:department" },
    update: {},
    create: {
      name: "create:department",
      description: "can create a department",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });

  const editDepartmentPermision = await prisma.permission.upsert({
    where: { name: "edit:department" },
    update: {},
    create: {
      name: "edit:department",
      description: "can edit department",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });

  const viewDepartmentPermission = await prisma.permission.upsert({
    where: { name: "view:department" },
    update: {},
    create: {
      name: "view:department",
      description: "can view department",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });
  const deleteDepartmentPermission = await prisma.permission.upsert({
    where: { name: "delete:department" },
    update: {},
    create: {
      name: "delete:department",
      description: "can delete department",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });
  const creatTeacherPermission = await prisma.permission.upsert({
    where: { name: "create:teacher" },
    update: {},
    create: {
      name: "create:teacher",
      description: "can create a teacher",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });

  const editTeacherPermision = await prisma.permission.upsert({
    where: { name: "edit:teacher" },
    update: {},
    create: {
      name: "edit:teacher",
      description: "can edit a teacher",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });

  const viewTeacherPermission = await prisma.permission.upsert({
    where: { name: "view:teacher" },
    update: {},
    create: {
      name: "view:teacher",
      description: "can view a teacher",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });
  const deleteTeacherPermission = await prisma.permission.upsert({
    where: { name: "delete:teacher" },
    update: {},
    create: {
      name: "delete:teacher",
      description: "can delete a teacher",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });
  const creatCoursePermission = await prisma.permission.upsert({
    where: { name: "create:course" },
    update: {},
    create: {
      name: "create:course",
      description: "can create a course",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });

  const editCoursePermision = await prisma.permission.upsert({
    where: { name: "edit:course" },
    update: {},
    create: {
      name: "edit:course",
      description: "can edit a course",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });

  const viewCoursePermission = await prisma.permission.upsert({
    where: { name: "view:course" },
    update: {},
    create: {
      name: "view:course",
      description: "can view a course",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });
  const deleteCoursePermission = await prisma.permission.upsert({
    where: { name: "delete:course" },
    update: {},
    create: {
      name: "delete:course",
      description: "can delete a course",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });
  const creatClassPermission = await prisma.permission.upsert({
    where: { name: "create:class" },
    update: {},
    create: {
      name: "create_class",
      description: "can create a class",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });

  const editClassPermision = await prisma.permission.upsert({
    where: { name: "edit:class" },
    update: {},
    create: {
      name: "edit:class",
      description: "can edit a class",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });

  const viewClassPermission = await prisma.permission.upsert({
    where: { name: "view:class" },
    update: {},
    create: {
      name: "view:class",
      description: "can view a class",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });
  const deleteClassPermission = await prisma.permission.upsert({
    where: { name: "delete:course" },
    update: {},
    create: {
      name: "delete:course",
      description: "can delete a course",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });
  const creatStudentPermission = await prisma.permission.upsert({
    where: { name: "create:student" },
    update: {},
    create: {
      name: "create:student",
      description: "can create a student",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });

  const editStudentPermision = await prisma.permission.upsert({
    where: { name: "edit:student" },
    update: {},
    create: {
      name: "edit:student",
      description: "can edit a student",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });

  const viewStudentPermission = await prisma.permission.upsert({
    where: { name: "view_student" },
    update: {},
    create: {
      name: "view:student",
      description: "can view a student",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });
  const deleteStudentPermission = await prisma.permission.upsert({
    where: { name: "delete:student" },
    update: {},
    create: {
      name: "delete:student",
      description: "can delete a cstudent",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
