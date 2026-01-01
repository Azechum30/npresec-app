"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateItemsPerPage } from "@/app/(private)/profile/_actions/update-items-per-page";

interface UseItemsPerPageSyncProps {
  initialPageSize?: number;
  onPageSizeChangeAction?: (newPageSize: number) => void;
}

export const useItemsPerPageSync = ({
  initialPageSize = 10,
  onPageSizeChangeAction,
}: UseItemsPerPageSyncProps) => {
  const [currentPageSize, setCurrentPageSize] = useState(() => initialPageSize);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [prevInitialPageSize, setPrevInitialPageSize] =
    useState(initialPageSize);

  if (initialPageSize !== prevInitialPageSize) {
    setPrevInitialPageSize(initialPageSize);
    setCurrentPageSize(initialPageSize);
    Promise.resolve().then(() => onPageSizeChangeAction?.(initialPageSize));
  }

  const updatePageSize = useCallback(
    (newPageSize: number) => {
      // Store the previous value for rollback
      const previousPageSize = currentPageSize;

      // Optimistically update local state
      setCurrentPageSize(newPageSize);

      // Immediately update the table
      onPageSizeChangeAction?.(newPageSize);

      // Persist to server
      startTransition(async () => {
        try {
          const { error, success } = await updateItemsPerPage(newPageSize);

          if (error) {
            toast.error(error);

            // Rollback optimistic updates
            setCurrentPageSize(previousPageSize);
            onPageSizeChangeAction?.(previousPageSize);
            return;
          }

          if (success) {
            toast.success("Items per page updated successfully");

            router.refresh();
          }
        } catch (error) {
          console.error("Failed to update items per page:", error);
          toast.error("Failed to update items per page");

          // Rollback optimistic updates
          setCurrentPageSize(previousPageSize);
          onPageSizeChangeAction?.(previousPageSize);
        }
      });
    },
    [currentPageSize, onPageSizeChangeAction, router],
  );

  return {
    currentPageSize,
    updatePageSize,
    isPending,
    isLoading: isPending,
  };
};
