"use client";

import DataTable from "@/components/customComponents/data-table";
import LoadingState from "@/components/customComponents/Loading";
import { toast } from "sonner";
import { useGetBoardMembersColumns } from "../_hooks/use-get-board-members-columns";
import { useHandleBulkBoardMembersDelete } from "../_hooks/use-handle-bulk-members-delete";
import { useEffect, useRef } from "react";
import { BoardMemberDetails } from "./board-member-detail";
import { getBoardOfGovernors } from "@/app/(public)/about/board-of-governors/actions/server";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { NoDataFound } from "@/components/customComponents/no-data-found";

type RenderBoardMembersTableProps = {
  boardMembers: Awaited<ReturnType<typeof getBoardOfGovernors>>["boardMembers"];
  error: string | undefined;
};

export const RenderBoardMembersTable = ({
  boardMembers,
  error,
}: RenderBoardMembersTableProps) => {
  const columns = useGetBoardMembersColumns();
  const {
    bulkDeletePending,
    deleteError,
    deleteSuccess,
    handleBulkBoardMembersDelete,
    recordCount,
  } = useHandleBulkBoardMembersDelete();

  const prevErrorRef = useRef(false);

  useEffect(() => {
    const wasError = prevErrorRef.current;
    if (wasError && !bulkDeletePending && deleteError) {
      toast.error(deleteError);
    }
    prevErrorRef.current = bulkDeletePending;
  }, [deleteError, bulkDeletePending]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success(`${recordCount} board members were deleted!`);
    }
  }, [deleteSuccess, recordCount]);

  if (!boardMembers) {
    return <LoadingState />;
  }

  return (
    <>
      {error ? (
        <ErrorComponent error={error} />
      ) : boardMembers === undefined ? (
        <NoDataFound />
      ) : (
        <DataTable
          columns={columns}
          data={boardMembers}
          onDelete={async (row) => {
            const ids = row.map((r) => r.original.id);
            await handleBulkBoardMembersDelete(ids);
          }}
          renderSubComponent={(row) => <BoardMemberDetails row={row} />}
        />
      )}
    </>
  );
};
