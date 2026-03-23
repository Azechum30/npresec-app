import { AlertCircle } from "lucide-react";

type ErrorProps = {
  error: string;
};
export const ErrorComponent = ({ error }: ErrorProps) => {
  return (
    <div
      role="banner"
      className="mt-4 w-full max-w-lg mx-auto border border-destructive/20 bg-destructive/10 h-fit p-1.5 rounded-lg text-destructive flex justify-start items-center gap-1.5 text-sm">
      <AlertCircle className="size-6 text-red flex-1" />
      <span className="block flex-3/4">{error}</span>
    </div>
  );
};
