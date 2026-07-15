/** biome-ignore-all assist/source/organizeImports: reason */
import "server-only";

import { router } from "@/router/router";
import { createRouterClient } from "@orpc/server";
import { headers } from "next/headers";

globalThis.$client = createRouterClient(router, {
  context: async () => ({
    headers: await headers(),
  }),
});
