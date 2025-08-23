import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type PublicMainContainerProps = {
  children: ReactNode;
  className?: string;
};

export const PublicMainContainer = ({
  children,
  className,
}: PublicMainContainerProps) => {
  return (
    <section
      className={cn("container mx-auto px-4 md:px-6 lg:px-8", className)}>
      {children}
    </section>
  );
};
