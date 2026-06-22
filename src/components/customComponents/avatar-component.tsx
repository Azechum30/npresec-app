import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const AvatarComponent = ({
  image,
  fallback,
}: {
  image?: string;
  fallback: string;
}) => {
  return (
    <Avatar size="lg" className="p-1 border-primary border-[1.5px]">
      <AvatarImage src={image} alt={fallback} />
      <AvatarFallback className="font-bold">
        {fallback.split(" ")[0].charAt(0).toUpperCase() +
          fallback.split(" ")[1].charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
