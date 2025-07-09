import { PrismaClient } from "./generated/client";
import argon from "argon2";
import { env } from "@/lib/server-only-actions/validate-env";

const prisma = new PrismaClient();
const resources = [
  "courses",
  "departments",
  "roles",
  "users",
  "students",
  "teachers",
  "parents",
  "grades",
  "permissions",
  "attendance",
  "classes",
  "notifications",
];
const actions = ["create", "view", "edit", "delete"];

const roles = ["admin", "teacher", "student", "parent"];

async function main() {
  console.log("Seeding database...");

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }
  const adminRole = await prisma.role.findUnique({
    where: { name: "admin" },
  });

  for (const resource of resources) {
    for (const action of actions) {
      await prisma.permission.upsert({
        where: { name: `${action}:${resource}` },
        update: {},
        create: {
          name: `${action}:${resource}`,
          description: `can ${action} ${resource}`,
          roles: {
            connect: { id: adminRole?.id },
          },
        },
      });
    }
  }

  const adminUser = await prisma.user.count({
    where: {
      role: { name: "admin" },
    },
  });

  if (adminUser === 0) {
    const adminEmail = env.ADMIN_USER_EMAIL || "admin@nakpanduripresec.org";
    const adminPassword = env.ADMIN_USER_PASSWORD;

    if (!adminEmail || !adminPassword)
      throw new Error(
        "ADMIN_USER_EMAIL and ADMIN_USER_PASSWORD must be set in .env file"
      );

    const hashedPassword = await argon.hash(adminPassword, {
      type: argon.argon2id,
    });

    await prisma.user.create({
      data: {
        email: adminEmail,
        username: adminEmail.split("@")[0],
        password: hashedPassword,
        role: {
          connect: {
            id: adminRole?.id,
          },
        },
        resetPasswordRequired: true,
      },
    });

    console.log("Admin user created");
  }
  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
