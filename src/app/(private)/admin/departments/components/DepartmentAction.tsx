import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { deleteDepartment } from "../actions/delete-departments-action";
import { toast } from "sonner";
import { useConfirmDelete } from "@/components/customComponents/useConfirmDelete";
import { getDepartment } from "../actions/get-department";
import { useDepartmentStore } from "@/hooks/use-generic-store";
import { useTransition } from "react";
import LoadingState from "@/components/customComponents/Loading";
import { useGenericDialog } from "../../../../../hooks/use-open-create-teacher-dialog";

export default function DepartmentActions({
  id,
  code,
}: {
  id: string;
  code?: string;
}) {
  const { onOpen } = useGenericDialog();
  const { deleteData: Delete, addData } = useDepartmentStore();
  const { ConfirmDeleteComponent, confirmDelete } = useConfirmDelete();

  const [isPending, startTransition] = useTransition();

  const handleSingleDelete = async () => {
    Delete(code as string);
    startTransition(async () => {
      const res = await deleteDepartment(id);
      if ("error" in res) {
        const rollback = await getDepartment(id);
        if (!(rollback.error || rollback.department === undefined)) {
          addData(rollback.department);
        }
        toast.error(res.error);
        return;
      } else {
        toast.success("department deleted Successfully!");
      }
    });
  };
  return (
    <>
      <ConfirmDeleteComponent />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onOpen("editDepartment", id)}>
            <Edit className="size-4 mr-1" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              const ok = await confirmDelete();

              if (ok) {
                await handleSingleDelete();
              }
            }}>
            <Trash2 className="size-4 mr-1" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isPending && <LoadingState />}
    </>
  );
}
