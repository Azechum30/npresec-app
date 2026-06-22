/**
 * biome-ignore-all assist/source/organizeImports: reason
 * biome-ignore-all lint/a11y/noStaticElementInteractions: reason
 * */
import LoadingState from "@/components/customComponents/Loading";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useSystemWideActionsStore } from "@/hooks/use-system-wide-actions-store";
import type { Row } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./SessionProvider";
import { useConfirmDelete } from "./useConfirmDelete";

type GenericActionsProps<T extends { id: string }> = {
  row: Row<T>;
  dialogId?: string;
  isPending?: boolean;
  onDelete: (id: string, secondaryValue: string) => Promise<void>;
  secondaryKey: keyof T;
};

export const GenericActions = <T extends { id: string }>({
  row,
  dialogId,
  secondaryKey,
  onDelete,
  isPending,
}: GenericActionsProps<T>) => {
  const pathname = usePathname().split("/").pop();
  const { onOpen } = useGenericDialog();
  const { ConfirmDeleteComponent, confirmDelete } = useConfirmDelete();

  const user = useAuth();
  const { settings } = useSystemWideActionsStore();
  const userRoles =
    user?.roles?.flatMap((r) => r.role?.name).filter((r) => r !== undefined) ??
    [];

  const { original } = row;
  const handleKeyPress = () => {};
  if (
    !userRoles.includes("admin") &&
    (settings?.enableDeleting || settings?.enableEditing)
  ) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:cursor-pointer">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
            {settings.enableEditing && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:cursor-pointer">
                  {pathname === "students" ? (
                    <Link
                      prefetch="auto"
                      href={`/admin/students/edit/${original.id}`}>
                      <span className="flex items-center gap-1">
                        <Edit className="size-5 text-blue-500" />
                        Edit
                      </span>
                    </Link>
                  ) : (
                    <span
                      onKeyUp={handleKeyPress}
                      className="flex items-center gap-1 w-full"
                      onClick={() => {
                        onOpen(dialogId as string, row.original.id);
                      }}>
                      <Edit className="size-5 text-blue-500" />
                      Edit
                    </span>
                  )}
                </DropdownMenuItem>
              </>
            )}
            {settings.enableDeleting && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={async () => {
                    const ok = await confirmDelete();
                    if (ok) {
                      await onDelete(
                        original.id,
                        String(original[secondaryKey]),
                      );
                    }
                  }}>
                  <Trash2 className="size-5 text-destructive" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <ConfirmDeleteComponent />
        {isPending && <LoadingState />}
      </>
    );
  } else if (userRoles.includes("admin")) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:cursor-pointer">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:cursor-pointer">
              {pathname === "students" ? (
                <Link href={`/admin/students/edit/${original.id}`}>
                  <span className="flex items-center gap-1">
                    <Edit className="size-5 text-blue-500" />
                    Edit
                  </span>
                </Link>
              ) : (
                <span
                  onKeyUp={handleKeyPress}
                  className="flex items-center gap-1 w-full"
                  onClick={() => {
                    onOpen(dialogId as string, row.original.id);
                  }}>
                  <Edit className="size-5 text-blue-500" />
                  Edit
                </span>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={async () => {
                const ok = await confirmDelete();
                if (ok) {
                  await onDelete(original.id, String(original[secondaryKey]));
                }
              }}>
              <Trash2 className="size-5 text-destructive" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ConfirmDeleteComponent />
        {isPending && <LoadingState />}
      </>
    );
  }

  return null;
};
