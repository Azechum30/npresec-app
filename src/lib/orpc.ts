import type { RouterClient } from "@orpc/server";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCClient } from "@orpc/client";
import { router } from "@/router/router";

declare global {
  var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
  url: () => {
    if (typeof window === "undefined") {
      throw new Error(
        "ORPC client link URL should not be called in the browser"
      );
    }

    return `${window.location.origin}/api/rpc`;
  },
});

export const client: RouterClient<typeof router> =
  global.$client ?? createORPCClient(link);
