import LogoutButton from "@/components/customComponents/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Home, Info, UserPlus } from "lucide-react";
import { Route } from "next";
import Link from "next/link";

type UserProfileProps = {
  user: {
    id?: string;
    email?: string;
    username?: string;
    image?: string | null;
  };
  onClose?: (dialogId: string) => void;
};

export const UserProfile = ({ user, onClose }: UserProfileProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="flex items-center space-x-2 hover:cursor-pointer"
      >
        <Button
          variant="ghost"
          className=" h-auto p-0 hover:bg-transparent hover:cursor-pointer"
        >
          <Avatar className="hover:cursor-pointer">
            <AvatarImage src={user.image as string} className="" />
            <AvatarFallback>
              {`${user.username?.[0].toUpperCase()}${user.username?.[1].toUpperCase()}`}
            </AvatarFallback>
          </Avatar>
          <ChevronDown size={16} className="opacity-60" aria-hidden={true} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex flex-col space-y-1.5">
          <span className="font-semibold text-sm">{user.username}</span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/"
            onClick={() => onClose?.("mobile-nav")}
            className="hover:cursor-pointer text-muted-foreground hover:text-primary transition-colors"
          >
            <Home size={16} aria-hidden={true} />
            <span>Home</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/about"
            onClick={() => onClose?.("mobile-nav")}
            className="hover:cursor-pointer text-muted-foreground hover:text-primary transition-colors"
          >
            <Info size={16} aria-hidden={true} />
            <span>About</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={"/admissions" as Route}
            onClick={() => onClose?.("mobile-nav")}
            className="hover:cursor-pointer text-muted-foreground hover:text-primary transition-colors"
          >
            <UserPlus size={16} aria-hidden={true} />
            <span>Admissions</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
