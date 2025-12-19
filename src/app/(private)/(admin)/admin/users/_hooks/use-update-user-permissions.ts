import { UserPermissionsFormType } from "@/lib/validation";
import { useTransition, useState } from "react";
import { UpdateUserPermissions } from "../_actions/update-permissions";

export const useUpdateUserPermissions = () => {
  const [isPending, startTransition] = useTransition();
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleUpdateUserPermissions = (values: UserPermissionsFormType) => {
    startTransition(async () => {
      const { error, success } = await UpdateUserPermissions(values);

      if (error) {
        setUpdateError(error);
        setUpdateSuccess(false);
        return;
      }
      if (success) {
        setUpdateError("");
        setUpdateSuccess(true);
        return;
      }
    });
  };
  return {
    isPending,
    handleUpdateUserPermissions,
    updateError,
    updateSuccess,
  };
};
