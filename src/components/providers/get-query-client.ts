import {
  environmentManager,
  MutationCache,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { MutationCacheType } from "./tanstack-query-provider";

const makeQueryClient = () => {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: (data, __, ___, mutation) => {
        const meta = mutation.meta as MutationCacheType | undefined;
        const invalidates = meta?.invalidates;
        const message = meta?.message;

        if (invalidates) {
          const keysToInvalidate = (
            Array.isArray(invalidates[0]) ? invalidates : [invalidates]
          ) as unknown[][];

          for (const key of keysToInvalidate) {
            queryClient.invalidateQueries({ queryKey: key });
          }
        }

        if (message) {
          if (
            data &&
            typeof data === "object" &&
            "count" in data &&
            typeof data.count === "number"
          ) {
            toast.success(`${data.count} ${message}`);
          } else {
            toast.success(message);
          }
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000 * 5,
        gcTime: 60 * 30 * 1000,
        structuralSharing: false,
      },
    },
  });

  return queryClient;
};

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
};
