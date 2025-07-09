import { PrismaClient } from "@prisma/client";
import argon from "argon2";
import {env} from "@/lib/server-only-actions/validate-env";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

 await prisma.role.upsert({
    where: { name: "teacher" },
    update: {},
    create: { name: "teacher" },
  });

await prisma.role.upsert({
    where: { name: "student" },
    update: {},
    create: { name: "student" },
  });

  await prisma.role.upsert({
    where: { name: "parent" },
    update: {},
    create: { name: "parent" },
  });

await prisma.permission.upsert({
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
  await prisma.permission.upsert({
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

 await prisma.permission.upsert({
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
await prisma.permission.upsert({
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
await prisma.permission.upsert({
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

  await prisma.permission.upsert({
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

  await prisma.permission.upsert({
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
await prisma.permission.upsert({
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
await prisma.permission.upsert({
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

await prisma.permission.upsert({
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

await prisma.permission.upsert({
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
 await prisma.permission.upsert({
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
 await prisma.permission.upsert({
    where: { name: "create:class" },
    update: {},
    create: {
      name: "create:class",
      description: "can create a class",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });

await prisma.permission.upsert({
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

await prisma.permission.upsert({
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
await prisma.permission.upsert({
    where: { name: "delete:class" },
    update: {},
    create: {
      name: "delete:class",
      description: "can delete a class",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });
await prisma.permission.upsert({
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

await prisma.permission.upsert({
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

 await prisma.permission.upsert({
    where: { name: "view:student" },
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
await prisma.permission.upsert({
    where: { name: "delete:student" },
    update: {},
    create: {
      name: "delete:student",
      description: "can delete a student",
      roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    },
  });

await prisma.permission.upsert({
    where: {name: "create:attendance"},
    update: {},
    create:{
        name: "create:attendance",
        description: "can create attendance",
        roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    }
})
    await prisma.permission.upsert({
    where: {name: "view:attendance"},
    update: {},
    create:{
        name: "view:attendance",
        description: "can view attendance",
        roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    }
})
    await prisma.permission.upsert({
    where: {name: "edit:attendance"},
    update: {},
    create:{
        name: "edit:attendance",
        description: "can edit attendance",
        roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    }
})
    await prisma.permission.upsert({
    where: {name: "delete:attendance"},
    update: {},
    create:{
        name: "delete:attendance",
        description: "can delete attendance",
        roles: adminRole
        ? {
            connect: { id: adminRole.id },
          }
        : undefined,
    }
})

    await prisma.permission.upsert({
        where:{name: "create:score" },
        update:{},
        create:{
            name: "create:score",
            description: "can create score",
            roles: adminRole
            ? {
                connect: { id: adminRole.id },
              }
            : undefined,
        }
    })
    await prisma.permission.upsert({
        where:{name: "view:score" },
        update:{},
        create:{
            name: "view:score",
            description: "can view score",
            roles: adminRole
            ? {
                connect: { id: adminRole.id },
              }
            : undefined,
        }
    })
    await prisma.permission.upsert({
        where:{name: "edit:score" },
        update:{},
        create:{
            name: "edit:score",
            description: "can edit score",
            roles: adminRole
            ? {
                connect: { id: adminRole.id },
              }
            : undefined,
        }
    })
    await prisma.permission.upsert({
        where:{name: "delete:score" },
        update:{},
        create:{
            name: "delete:score",
            description: "can delete score",
            roles: adminRole
            ? {
                connect: { id: adminRole.id },
              }
            : undefined,
        }
    })


  const adminUser = await prisma.user.count({where: {
    role: {name: "admin"}
    }});

  if(adminUser === 0){

    const adminEmail = env.ADMIN_USER_EMAIL || "admin@nakpanduripresec.org"
    const adminPassword = env.ADMIN_USER_PASSWORD;

    if(!adminEmail || !adminPassword) throw new Error(
      "ADMIN_USER_EMAIL and ADMIN_USER_PASSWORD must be set in .env file"
    )

    const hashedPassword = await argon.hash(adminPassword, {
      type: argon.argon2id
    });

    await prisma.user.create({
      data: {
        email: adminEmail,
        username:adminEmail.split("@")[0],
        password: hashedPassword,
        role: {
          connect:{
            id: adminRole.id
          }
        },
        resetPasswordRequired: true
      }
    })

    console.log("Admin user created")
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
