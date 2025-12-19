"use client";

import DataTable from "@/components/customComponents/data-table";
import { client } from "@/lib/orpc";
import { useGetHouseColumns } from "../_hooks/use-get-house-columns";
import { createSafeClient, isDefinedError } from "@orpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type RenderHouseListTableProps = {
  houses: Awaited<ReturnType<typeof client.house.getHouses>>;
};
export const RenderHouseListTable = ({ houses }: RenderHouseListTableProps) => {
  const columns = useGetHouseColumns();
  const router = useRouter();

  const handleBulkHouseDelete = async (selectedIds: string[]) => {
    const safeClient = createSafeClient(client);
    const { error, data } = await safeClient.house.bulkDeleteHouses({
      ids: selectedIds,
    });

    if (isDefinedError(error)) {
      toast.error(
        error.message || "Failed to delete selected houses. Please try again."
      );
      return;
    } else if (error) {
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
      return;
    } else {
      toast.success(`Successfully deleted ${data.count} house(s).`);

      setTimeout(() => {
        router.refresh();
      }, 100);
    }
  };
  return (
    <>
      <DataTable
        data={houses}
        columns={columns}
        onDelete={async (rows) => {
          const ids = rows.map((row) => row.original.id);
          await handleBulkHouseDelete(ids);
        }}
      />
    </>
  );
};
