import { Row, Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { useConfirmDelete } from "./useConfirmDelete";
import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import LoadingState from "./Loading";

type RowSelectionCompoenentProps<TData> = {
  className?: string;
  table: Table<TData>;
  onDelete?: (rows: Row<TData>[]) => void;
};

export default function RowSelectionComponent<TData>({
  className,
  table,
  onDelete,
  ...props
}: RowSelectionCompoenentProps<TData>) {
  const { confirmDelete, ConfirmDeleteComponent } = useConfirmDelete();
  const [isPending, startTransition] = useTransition();

  const handleBulkDelete = () => {
    startTransition(() => {
      const rows = table.getSelectedRowModel().rows;
      onDelete?.(rows);
      table.resetRowSelection();
    });
  };

  if (isPending) {
    return <LoadingState />;
  }

  return (
    <>
      <ConfirmDeleteComponent />
      {table.getSelectedRowModel().rows?.length !== 0 && (
        <Button
          variant="destructive"
          className={className}
          onClick={async () => {
            const ok = await confirmDelete();
            if (ok) {
              handleBulkDelete();
            }
          }}
          {...props}>
          <Trash2 className="" /> Delete (
          {table.getSelectedRowModel().rows?.length})
        </Button>
      )}
    </>
  );
}
