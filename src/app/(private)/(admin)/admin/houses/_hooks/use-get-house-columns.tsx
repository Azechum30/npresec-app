import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { HouseResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useHandleHouseDelete } from "./handle-delete-house";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/lib/orpc";

export const useGetHouseColumns = () => {
  const { handleHouseDelete, error, isPending, success } =
    useHandleHouseDelete();

  const errorRef = useRef(false);
  const successRef = useRef(false);

  const router = useRouter();

  useEffect(() => {
    const wasError = errorRef.current;

    if (wasError && !isPending && error) {
      toast.error(error);
      return;
    }

    errorRef.current = isPending;
  }, [error, isPending]);

  useEffect(() => {
    const wasSuccess = successRef.current;

    if (wasSuccess && !isPending && success) {
      toast.success("House deleted successfully.");
      router.refresh();
      return;
    }

    successRef.current = isPending;
  }, [success, isPending, router]);

  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections isHeader table={table} />,
      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableColumnFilter: false,
      enableSorting: false,
      enableHiding: false,
      enablePinning: false,
      enableResizing: false,
      enableGlobalFilter: false,
      enableGrouping: false,
      enableMultiSort: false,
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Gender",
      accessorKey: "houseGender",
    },
    {
      header: "ResidencyType",
      accessorKey: "residencyType",
    },
    {
      header: "MRCount",
      accessorKey: "occupancy.maleOccupancy.roomCount",
    },
    {
      header: "FRCount",
      accessorKey: "occupancy.femaleOccupancy.roomCount",
    },
    {
      header: "HouseMaster",
      accessorFn: (row) =>
        row.houseMaster
          ? `${row.houseMaster.firstName} ${row.houseMaster.lastName}`
          : "Unassigned",
    },

    {
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions
          secondaryKey="id"
          dialogId="edit-house"
          onDelete={async () => handleHouseDelete(row.original.id)}
          row={row}
          isPending={isPending}
        />
      ),
    },
  ] satisfies ColumnDef<
    Awaited<ReturnType<typeof client.house.getHouses>>[number]
  >[];
};
