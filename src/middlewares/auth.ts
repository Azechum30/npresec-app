import { auth } from "@/lib/auth";
import { ORPCError, os } from "@orpc/server";
import { prisma } from "@/lib/prisma";

const middlewareAuth = os
  .$context<{
    session?: Awaited<ReturnType<typeof auth.api.getSession>>;
  }>()
  .middleware(async ({ context, next }) => {
    const session =
      context.session ??
      (await auth.api.getSession({
        headers: await import("next/headers").then((m) => m.headers()),
      }));

    if (!session?.user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        role: { include: { permissions: true } },
        permissions: true,
      },
    });

    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    return next({ context: { user } });
  });

export const authMiddleware = os.use(middlewareAuth);
