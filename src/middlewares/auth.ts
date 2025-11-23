import { ORPCError, os } from "@orpc/server";
import { getAuthUser } from "@/lib/getAuthUser";

const middlewareAuth = os
  .$context<{
    session?: NonNullable<Awaited<ReturnType<typeof getAuthUser>>>;
  }>()
  .middleware(async ({ context, next }) => {
    const user = context.session ?? (await getAuthUser());

    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    return next({ context: { user } });
  });

export const authMiddleware = os.use(middlewareAuth);
