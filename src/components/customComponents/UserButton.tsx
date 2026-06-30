/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { updateThemeAction } from "@/app/(private)/profile/_actions/update-theme-action";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import {
  Check,
  Key,
  Laptop2,
  Loader2,
  Monitor,
  Moon,
  Settings,
  Settings2,
  Shield,
  Sun,
  Table2,
  UsersRoundIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState, useTransition } from "react";
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
import { AvatarComponent } from "./avatar-component";
import LogoutButton from "./LogoutButton";
import { useAuth } from "./SessionProvider";

export default function UserButton() {
  const user = useAuth();
  const [isPending, startThemeUpdateTransition] = useTransition();
  const [isMounted, setIsMouted] = useState(false);

  const requiredRole = "admin";
  const userRoleNames =
    user?.roles?.map((r) => r.role?.name).filter(Boolean) ?? [];
  const hasRole = userRoleNames.includes(requiredRole);

  const { setTheme, theme } = useTheme();
  const { onOpen } = useGenericDialog();

  const handleThemeChange = (newTheme: "system" | "light" | "dark") => {
    setTheme(newTheme);

    startThemeUpdateTransition(async () => {
      await updateThemeAction(newTheme);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="bg-background hover:bg-secondary w-full h-full flex justify-start text-left rounded-none py-2 items-center gap-x-3 border-0 hover:cursor-pointer">
          {user && (
            <AvatarComponent
              fallback="User Name"
              image={user?.image as string | undefined}
            />
          )}
          {!user ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <span className=" flex flex-col">
              <span className="font-semibold text-accent-foreground">
                {user.username}
              </span>
              <span className="inline-block text-xs text-muted-foreground">
                {user.email}
              </span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <Link
          href={`/profile`}
          className="w-full flex items-center space-x-2 flex-nowrap">
          <DropdownMenuItem className="w-full hover:cursor-pointer">
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
          </DropdownMenuItem>
        </Link>
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="hover:cursor-pointer hover:bg-accent"
                      onClick={() =>
                        onOpen("open-system-wide-actions-setting")
                      }>
                      <Settings2 className="size-4" />
                      System Actions
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="hover:cursor-pointer hover:bg-accent"
                      onClick={() => onOpen("export-column-config")}>
                      <Table2 className="size-4" />
                      Export Column Settings
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
