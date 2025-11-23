import { Info } from "lucide-react";

type ErrorProps = {
  error: string;
};
export const ErrorComponent = ({ error }: ErrorProps) => {
  return (
    <div className=" w-full max-w-lg mx-auto border border-destructive/20 bg-destructive/10 h-fit p-4 rounded-lg text-destructive flex justify-center items-center gap-2">
      <Info className="text-destructive" />
      <span>{error}</span>
    </div>
  );
};
