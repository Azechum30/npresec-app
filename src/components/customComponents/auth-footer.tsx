/**biome-ignore-all assist/source/organizeImports: reason */

import { getUserAgentInfo } from "@/lib/get-user-agent-info";
import { Monitor, Smartphone, TabletIcon } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

export const AuthFooter = () => {
  return (
    <div className="flex gap-4 justify-between items-center w-full">
      <div className="text-sm text-muted-foreground font-mono">
        Copyright &copy; <Suspense>{new Date().getFullYear()}</Suspense>
        <span className="hidden md:inline-flex">| NPRESEC</span>
      </div>

      <Suspense
        fallback={<Skeleton className="bg-card w-20 h-6 animate-pulse" />}>
        <RenderFooterData />
      </Suspense>
    </div>
  );
};

const RenderFooterData = async () => {
  await connection();
  const result = await getUserAgentInfo();

  if (result === undefined) return;

  return (
    <div className="ml-auto flex items-center space-x-1.5 bg-linear-to-br from-primary to-muted-foreground bg-clip-text text-transparent text-sm font-mono">
      <span className="flex items-center text-muted-foreground">
        Device:{" "}
        {result.userAgentInfo?.device.model === "mobile" ? (
          <Smartphone className="size-5 ml-1.5" />
        ) : result.userAgentInfo?.device.model === "tablet" ? (
          <TabletIcon className="size-5 ml-1.5" />
        ) : (
          <Monitor className="size-5 ml-1.5" />
        )}
      </span>
      <span className="flex items-center gap-1.5"></span>
      <span className="flex items-center gap-1.5">{result.device}</span>
    </div>
  );
};
