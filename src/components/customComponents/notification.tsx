import { Info } from "lucide-react";
import { FC } from "react";

export const Notification: FC<{ description?: string }> = ({ description }) => {
  return (
    <div className="mt-4 flex max-w-lg mx-auto items-start gap-2 p-3 bg-primary/5 border border-primary rounded-md w-full">
      <Info className="size-8 text-primary flex-l/4" />
      <span className="flex-3/4 text-sm text-muted-foreground text-justify">
        {description
          ? description
          : "Kindly wait while data is being retrieved from the server. This could take some time depending server's latency and your network speed. Patience is a virtue"}
      </span>
    </div>
  );
};
