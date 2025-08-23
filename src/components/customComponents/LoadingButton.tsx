import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LoadingButtonProps {
  loading: boolean;
  children: ReactNode;
  className?: string;
}
export default function LoadingButton({
  loading,
  children,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={loading}
      className={cn(" w-full flex items-center gap-x-3", className)}
      {...props}>
      {children}
      {loading && <Loader2 className="size-5 animate-spin" />}
    </Button>
  );
}
