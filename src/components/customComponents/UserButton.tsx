/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { updateThemeAction } from "@/app/(private)/profile/_actions/update-theme-action";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { type ExtendedSession, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
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
import { startTransition, useEffect, useState, useTransition } from "react";
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
import { Skeleton } from "../ui/skeleton";
import { AvatarComponent } from "./avatar-component";
import LogoutButton from "./LogoutButton";
import { useAuth } from "./SessionProvider";
import { StopUserImpersonation } from "./stop-user-impersonation";

export default function UserButton() {
  const user = useAuth();
  const { data } = useSession();
  const [isPending, startThemeUpdateTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

  const requiredRole = "admin";
  const userRoleNames =
    user?.roles?.map((r) => r.role?.name).filter(Boolean) ?? [];
  const hasRole = userRoleNames.includes(requiredRole);

  const { setTheme, theme } = useTheme();
  const { onOpen } = useGenericDialog();

  useEffect(() => startTransition(() => setIsMounted(true)));

  const handleThemeChange = (newTheme: "system" | "light" | "dark") => {
    setTheme(newTheme);

    startThemeUpdateTransition(async () => {
      await updateThemeAction(newTheme);
    });
  };

  if (!isMounted) {
    return (
      <div className="flex space-x-1 items-center">
        <Skeleton className="size-8 rounded-full bg-gray-200 animate-pulse" />
        <Skeleton className="h-8 w-20 rounded-md bg-gray-200 animate-pulse" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className={cn(
            "bg-transparent hover:bg-secondary flex justify-start text-left py-6 items-center gap-x-1.5 border-0 hover:cursor-pointer",
            !!data?.session.impersonatedBy && "border border-destructive",
          )}>
          {user && (
            <AvatarComponent
              fallback={
                user.name.includes(" ")
                  ? user.name
                  : `${user.name.charAt(0)} ${user.name.charAt(1)}`
              }
              image={user?.image as string | undefined}
            />
          )}
          {!user ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <span className="hidden  md:flex flex-col">
              <span className="font-semibold text-accent-foreground">
                {user.username}
              </span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-fit">
        <Link
          href={`/profile`}
          className="w-full flex items-center space-x-2 flex-nowrap">
          <DropdownMenuItem className="w-full hover:cursor-pointer">
            <AvatarComponent
              image={user?.image ?? undefined}
              fallback={
                user?.name.includes(" ")
                  ? user?.name
                  : `${user?.name.charAt(0)} ${user?.name.charAt(1)}`
              }
            />
            <span className="flex flex-col">
              <span className="font-semibold">{user?.username}</span>
              <span className="text-xs text-muted-foreground">Profile</span>
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
        {data?.session.impersonatedBy && (
          <StopUserImpersonation user={user as ExtendedSession["user"]} />
        )}
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
