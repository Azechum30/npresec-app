import { Info } from "lucide-react";

type ErrorProps = {
  error: string;
};
export const ErrorComponent = ({ error }: ErrorProps) => {
  return (
    <div
      role="banner"
      className="w-full max-w-lg mx-auto border border-destructive/20 bg-destructive/10 h-fit p-1.5 rounded-lg text-destructive flex justify-center items-baseline gap-2 text-sm">
      {error}
    </div>
  );
};
