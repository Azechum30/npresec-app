import { Loader } from "lucide-react";

export const ShowLoadingState = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <span>Wait patiently while data loads...</span>
      <Loader className="size-6 animate-spin" />
    </div>
  );
};
