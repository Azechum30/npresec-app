/** biome-ignore-all assist/source/organizeImports: reason */
import type { router } from "@/router/router";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";

declare global {
  var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
  url: () => {
    if (typeof window === "undefined") {
      throw new Error(
        "ORPC client link URL should not be called in the browser",
      );
    }

    return `${window.location.origin}/rpc`;
  },
});

export const client: RouterClient<typeof router> =
  globalThis.$client ?? createORPCClient(link);
