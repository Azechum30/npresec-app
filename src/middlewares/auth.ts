import { auth } from "@/lib/auth";
import { ORPCError, os } from "@orpc/server";

const base = os.$context<{ headers: Headers }>();

const middlewareAuth = base.middleware(async ({ context, next }) => {
  const sessionData = await auth.api.getSession({
    headers: context.headers,
  });

  if (!sessionData?.session || !sessionData.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      user: sessionData.user,
      session: sessionData.session,
    },
  });
});

export const authMiddleware = base.use(middlewareAuth);
