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
import { Row } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConfirmDelete } from "./useConfirmDelete";
import LoadingState from "@/components/customComponents/Loading";

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
    isPending
}: GenericActionsProps<T>) => {
  const pathname = usePathname().split("/").pop();
  const { onOpen } = useGenericDialog();
  const { ConfirmDeleteComponent, confirmDelete } = useConfirmDelete();

  const { original } = row;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            {pathname === "students" ? (
              <Link href={`/admin/students/edit/${original.id}`}>
                <span className="flex items-center gap-1">
                  <Edit className="size-5" />
                  Edit
                </span>
              </Link>
            ) : (
              <span
                className="flex items-center gap-1 w-full"
                onClick={() => onOpen(dialogId as string, row.original.id)}>
                <Edit className="size-5" />
                Edit
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              const ok = await confirmDelete();
              if (ok) {
                await onDelete(original.id, String(original[secondaryKey]));
              }
            }}>
            <Trash2 className="size-5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDeleteComponent />
      {isPending && <LoadingState />}
    </>
  );
};
