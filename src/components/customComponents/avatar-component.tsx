import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const AvatarComponent = ({
  image,
  fallback,
  className,
}: {
  fallback: string;
  image?: string;
  className?: string;
}) => {
  return (
    <Avatar size="lg" className="p-1 border-primary border-[1.5px]">
      <AvatarImage
        src={image}
        alt={fallback}
        className={cn("object-top", className)}
      />
      {fallback && (
        <AvatarFallback className="font-bold">
          {fallback?.split(" ")[0].charAt(0).toUpperCase() +
            fallback?.split(" ")[1].charAt(0).toUpperCase()}
        </AvatarFallback>
      )}
    </Avatar>
  );
};
