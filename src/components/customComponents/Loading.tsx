import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="shadow-2xl border w-full max-w-md h-full max-h-24 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-999 bg-background rounded-2xl flex justify-center items-center">
      <div className="flex justify-between items-center gap-1.5">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="bg-linear-to-r from-primary text-base to-muted-foreground bg-clip-text text-transparent font-bold font-mono animate-pulse">
          Processing request...
        </span>
      </div>
    </div>
  );
}
