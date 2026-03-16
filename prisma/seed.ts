import { PrismaClient } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { env } from "@/lib/server-only-actions/validate-env";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
  "timelines",
];
const actions = ["create", "view", "edit", "delete", "export"];

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
  admin: { resources: [], actions: [] },
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
  support_staff: { resources: ["notifications"], actions: ["view"] },
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

  // Create roles if missing
  const existingRoles = await prisma.role.findMany({
    where: { name: { in: roles } },
  });
  const existingRoleNames = new Set(existingRoles.map((r) => r.name));
  const rolesToCreate = roles.filter((r) => !existingRoleNames.has(r));

  if (rolesToCreate.length > 0) {
    await prisma.role.createMany({
      data: rolesToCreate.map((name) => ({ name })),
    });
    console.log(`Created ${rolesToCreate.length} roles`);
  }

  const allRoles = await prisma.role.findMany({
    where: { name: { in: roles } },
  });
  const roleMap = new Map(allRoles.map((r) => [r.name, r.id]));

  // Permission generation
  const shouldHavePermission = (
    roleName: string,
    resource: string,
    action: string,
  ): boolean => {
    const config = rolePermissions[roleName];
    if (!config) return false;
    if (
      roleName === "admin" &&
      config.resources.length === 0 &&
      (!config.actions || config.actions.length === 0)
    ) {
      return true; // admin gets everything
    }
    return (
      config.resources.includes(resource) &&
      (!config.actions || config.actions.includes(action))
    );
  };

  const expectedPermissions: {
    name: string;
    description: string;
    roleIds: string[];
  }[] = [];
  for (const resource of resources) {
    for (const action of actions) {
      const name = `${action}:${resource}`;
      const roleIds = allRoles
        .filter((r) => shouldHavePermission(r.name, resource, action))
        .map((r) => r.id);
      if (roleIds.length > 0) {
        expectedPermissions.push({
          name,
          description: `can ${action} ${resource}`,
          roleIds,
        });
      }
    }
  }

  const existingPermissions = await prisma.permission.findMany({
    select: { name: true },
  });
  const existingPermissionNames = new Set(
    existingPermissions.map((p) => p.name),
  );
  const permissionsToCreate = expectedPermissions.filter(
    (p) => !existingPermissionNames.has(p.name),
  );

  for (const perm of permissionsToCreate) {
    await prisma.permission.create({
      data: {
        name: perm.name,
        description: perm.description,
        roles: { connect: perm.roleIds.map((id) => ({ id })) },
      },
    });
  }

  console.log(`Created ${permissionsToCreate.length} permissions`);

  // Ensure admin user exists
  const adminEmail = env.ADMIN_USER_EMAIL || "admin@nakpanduripresec.org";
  const adminPassword = env.ADMIN_USER_PASSWORD;

  const adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    console.log("Creating admin user...");
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
      const adminRoleId = roleMap.get("admin");
      if (!adminRoleId) throw new Error("Admin role not found");

      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: adminRoleId,
        },
      });
      console.log("Admin user created and assigned admin role");
    }
  } else {
    console.log("Admin user already exists, skipping");
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
