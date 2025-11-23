import "server-only";

import { createRouterClient } from "@orpc/server";
import { router } from "@/router/router";
import { headers } from "next/headers";

globalThis.$client = createRouterClient(router, {
  context: async () => ({
    headers: await headers(),
  }),
});
