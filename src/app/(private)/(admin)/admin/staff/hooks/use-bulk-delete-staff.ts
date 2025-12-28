import { useStaffStore } from "@/hooks/use-generic-store";
import { useTransition } from "react";
import { bulkDeleteStaff, getStaff } from "../actions/server";
import { toast } from "sonner";

export const useBulkDeleteStaff = () => {
  const [isBulkDeletePending, startTransition] = useTransition();

  const deletestaff = async (ids: string[]) => {
    startTransition(async () => {
      const { error, count } = await bulkDeleteStaff(ids);
      if (error) {
        toast.error(error || "An error occurred while trying to delete staff");
        return;
      } else if (count && count === 0) {
        toast.error("No staff were deleted");
      } else if (count && count > 0) {
        toast.success(
          `${count} staff${count > 0 && "s"} ${
            count > 0 ? "were" : "was"
          } deleted successfully!`,
        );
      }
    });
  };

  return { deletestaff, isBulkDeletePending };
};
