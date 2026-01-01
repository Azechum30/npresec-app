import { auth } from "@/lib/auth";
import { getAuthUser } from "@/lib/get-session";
import { ORPCError, os } from "@orpc/server";

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

    const user = await getAuthUser();

    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    return next({ context: { user } });
  });

export const authMiddleware = os.use(middlewareAuth);
