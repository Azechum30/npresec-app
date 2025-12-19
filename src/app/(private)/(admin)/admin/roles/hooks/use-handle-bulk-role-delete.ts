import { useCallback } from "react";
import { toast } from "sonner";
import { bulkDeleteRoles } from "@/app/(private)/(admin)/admin/roles/actions/mutations";

export const useHandleBulkRoleDelete = () => {
  const handleBulkRoleDelete = async (values: string[]) => {
    const result = await bulkDeleteRoles(values);
    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.count) {
      toast.success(`${result.count} role(s) was/were deleted!`);
    }
  };

  return { handleBulkRoleDelete };
};
