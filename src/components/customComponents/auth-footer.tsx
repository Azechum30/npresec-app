import { ipToLocationTranslation } from "@/lib/ip-to-location-translation";
import { Circle } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

export const AuthFooter = () => {
  return (
    <div className="flex gap-4 justify-between items-center w-full">
      <div className="text-sm text-muted-foreground font-mono">
        Copyright &copy; <Suspense>{new Date().getFullYear()}</Suspense> |
        NPRESEC
      </div>

      <Suspense
        fallback={<Skeleton className="bg-accent w-20 h-6 animate-pulse" />}>
        <RenderFooterData />
      </Suspense>
    </div>
  );
};

const RenderFooterData = async () => {
  await connection();
  const result = await ipToLocationTranslation();

  if (result === null) return;

  return (
    <div className="ml-auto flex items-center space-x-2 bg-gradient-to-br from-primary to-muted-foreground bg-clip-text text-transparent text-sm font-mono">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        Location
      </span>
      <span className="flex items-center gap-1.5">
        <Circle className="text-primary size-2 fill-primary" /> {result.city}
      </span>
      <span className="flex items-center gap-1.5">
        <Circle className="text-primary size-2" />
        {result.country}
      </span>
    </div>
  );
};
