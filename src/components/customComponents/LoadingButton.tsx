import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

type LoadingButtonProps = {
  loading: boolean;
  children: ReactNode;
  className?: string;
} & React.ComponentProps<typeof Button>;

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
