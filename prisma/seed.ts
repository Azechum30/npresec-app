import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { env } from "@/lib/server-only-actions/validate-env";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "@/lib/auth";

const pool = new Pool({ connectionString: env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const resources = [
  "courses",
  "departments",
  "roles",
  "users",
  "students",
  "staff",
  "parents",
  "grades",
  "permissions",
  "attendance",
  "classes",
  "notifications",
  "transcripts",
  "documents",
  "houses",
  "boardmembers",
  "events",
  "lessons",
  "assignments",
  "rooms",
];
const actions = ["create", "view", "edit", "delete"];

const roles = [
  "admin",
  "staff",
  "teaching_staff",
  "admin_staff",
  "support_staff",
  "student",
  "parent",
  "classTeacher",
  "houseMaster",
  "hod",
  "accountant",
  "librarian",
];

const rolePermissions: Record<
  string,
  { resources: string[]; actions?: string[] }
> = {
  admin: {
    resources: [],
    actions: [],
  },
  staff: {
    resources: [
      "courses",
      "students",
      "grades",
      "attendance",
      "classes",
      "notifications",
      "lessons",
      "assignments",
    ],
    actions: ["view", "create", "edit"],
  },
  teaching_staff: {
    resources: [
      "courses",
      "students",
      "grades",
      "attendance",
      "classes",
      "notifications",
      "lessons",
      "assignments",
    ],
    actions: ["view", "create", "edit"],
  },
  admin_staff: {
    resources: ["students", "classes", "notifications"],
    actions: ["view"],
  },
  support_staff: {
    resources: ["notifications"],
    actions: ["view"],
  },
  student: {
    resources: [
      "courses",
      "grades",
      "attendance",
      "classes",
      "notifications",
      "transcripts",
      "assignments",
      "events",
    ],
    actions: ["view"],
  },
  parent: {
    resources: [
      "courses",
      "grades",
      "attendance",
      "classes",
      "notifications",
      "transcripts",
      "students",
      "events",
    ],
    actions: ["view"],
  },
  classTeacher: {
    resources: [
      "courses",
      "students",
      "grades",
      "attendance",
      "classes",
      "notifications",
      "lessons",
      "assignments",
      "events",
    ],
    actions: ["view", "create", "edit"],
  },
  houseMaster: {
    resources: ["houses", "students", "attendance", "notifications", "events"],
    actions: ["view", "create", "edit"],
  },
  hod: {
    resources: [
      "departments",
      "courses",
      "staff",
      "students",
      "classes",
      "grades",
      "attendance",
      "notifications",
    ],
    actions: ["view", "create", "edit"],
  },
  accountant: {
    resources: ["students", "users", "notifications"],
    actions: ["view", "create", "edit"],
  },
  librarian: {
    resources: ["documents", "students", "notifications", "assignments"],
    actions: ["view", "create", "edit", "delete"],
  },
};

async function main() {
  console.log("Seeding database...");

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }
  const allRoles = await prisma.role.findMany({
    where: { name: { in: roles } },
  });

  const roleMap = new Map(allRoles.map((role) => [role.name, role.id]));

  const shouldHavePermission = (
    roleName: string,
    resource: string,
    action: string
  ): boolean => {
    const permissionConfig = rolePermissions[roleName];
    if (!permissionConfig) return false;

    if (
      roleName === "admin" &&
      permissionConfig.resources.length === 0 &&
      (!permissionConfig.actions || permissionConfig.actions.length === 0)
    ) {
      return true;
    }

    const resourceAllowed = permissionConfig.resources.includes(resource);
    if (!resourceAllowed) return false;

    const actions = permissionConfig.actions || [];
    if (actions.length > 0 && !actions.includes(action)) {
      return false;
    }

    return true;
  };

  for (const resource of resources) {
    for (const action of actions) {
      const permissionName = `${action}:${resource}`;

      const allowedRoleIds = allRoles
        .filter((role) => shouldHavePermission(role.name, resource, action))
        .map((role) => ({ id: role.id }));

      if (allowedRoleIds.length > 0) {
        await prisma.permission.upsert({
          where: { name: permissionName },
          update: {
            roles: {
              set: allowedRoleIds,
            },
          },
          create: {
            name: permissionName,
            description: `can ${action} ${resource}`,
            roles: {
              connect: allowedRoleIds,
            },
          },
        });
      }
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

    const adminRoleId = roleMap.get("admin");
    if (!adminRoleId) {
      throw new Error("Admin role not found");
    }

    const { user } = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: adminEmail.split("@")[0],
        username: adminEmail.split("@")[0],
        callbackURL: "/email-verified",
        rememberMe: true,
      },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: {
            connect: {
              id: adminRoleId,
            },
          },
        },
      });
    }

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
