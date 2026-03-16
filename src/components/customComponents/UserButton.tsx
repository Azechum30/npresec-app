"use client";

import { updateThemeAction } from "@/app/(private)/profile/_actions/update-theme-action";
import {
  Check,
  Key,
  Laptop2,
  Loader2,
  Monitor,
  Moon,
  Settings,
  Shield,
  Sun,
  UsersRoundIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LogoutButton from "./LogoutButton";
import { useAuth } from "./SessionProvider";

export default function UserButton() {
  const user = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const requiredRole = "admin";
  const userRoleNames =
    user?.roles?.map((r) => r.role?.name).filter(Boolean) ?? [];
  const hasRole = userRoleNames.includes(requiredRole);

  const { setTheme, theme } = useTheme();

  const handleThemeChange = (newTheme: "system" | "light" | "dark") => {
    setTheme(newTheme);

    startTransition(async () => {
      await updateThemeAction(newTheme);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="w-fit bg-background hover:bg-accent md:w-full h-full flex justify-center md:justify-start text-left rounded-none py-2 items-center gap-x-3 border-0 hover:cursor-pointer">
          <Avatar className="border p-1.5">
            <AvatarImage src={user?.image!} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {!user ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <span className=" hidden md:flex flex-col">
              <span className="font-semibold text-accent-foreground">
                {user.username}
              </span>
              <span className="sm:hidden lg:inline-block text-xs text-muted-foreground">
                {user.email}
              </span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" alignOffset={-150}>
        <DropdownMenuItem asChild>
          <Link
            href={`/profile`}
            className="w-full flex items-center space-x-2 flex-nowrap">
            <Avatar>
              <AvatarImage src={user?.image ? user.image : ""} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="flex flex-col">
              <span className="font-semibold">{user?.username}</span>
              <span className="text-xs text-muted-foreground">
                {user?.email}
              </span>
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex justify-start items-center text-sm">
              <Monitor className="size-4 mr-2" />
              Theme
            </Button>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => handleThemeChange("system")}
                disabled={isPending}>
                <Laptop2 className="size-4 mr-2" />
                System
                {theme === "system" && <Check className="size-4" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleThemeChange("light")}
                disabled={isPending}>
                <Sun className="size-4 mr-2" />
                Light
                {theme === "light" && <Check className="size-4" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleThemeChange("dark")}
                disabled={isPending}>
                <Moon className="size-4 mr-2" />
                Dark
                {theme === "dark" && <Check className="size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {hasRole && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex justify-start items-center text-sm">
                  <Settings className="size-5 mr-2" />
                  Settings
                </Button>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem asChild className="hover:cursor-pointer">
                      <Link
                        className="flex items-center gap-1 w-full hover:bg-accent hover:cursor-pointer rounded-md"
                        href="/admin/users">
                        <UsersRoundIcon className="size-4 mr-2" />
                        Manage Users
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="hover:cursor-pointer">
                      <Link
                        className="flex items-center gap-1 w-full hover:bg-accent hover:cursor-pointer rounded-md"
                        href="/admin/roles">
                        <Shield className="size-4 mr-2" />
                        Manage Roles
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="hover:cursor-pointer">
                      <Link
                        className="flex items-center gap-1 w-full hover:bg-accent hover:cursor-pointer  rounded-md"
                        href="/admin/permissions">
                        <Key className="size-4 mr-2" />
                        Manage Permissions
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSubTrigger>
            </DropdownMenuSub>
          </>
        )}
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
