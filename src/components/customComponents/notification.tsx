import { Info } from "lucide-react";
import { FC } from "react";

export const Notification: FC<{ description: string }> = ({ description }) => {
  return (
    <div className="mt-4 flex max-w-lg mx-auto items-start gap-2 p-3 bg-primary/5 border border-primary rounded-md w-full">
      <Info className="size-8 text-primary flex-l/4" />
      <span className="flex-3/4 text-sm text-muted-foreground text-justify">
        {description}
      </span>
    </div>
  );
};
