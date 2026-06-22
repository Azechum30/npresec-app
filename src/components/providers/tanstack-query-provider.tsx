"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { FC, ReactNode } from "react";
import { getQueryClient } from "./get-query-client";

type QueryKey = readonly unknown[];

export type MutationCacheType = {
  message?: string;
  invalidates?: QueryKey | QueryKey[];
};

const TanstackQueryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanstackQueryProvider;
