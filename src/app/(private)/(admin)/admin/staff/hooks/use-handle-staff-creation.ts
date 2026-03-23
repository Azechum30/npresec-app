import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { StaffType } from "@/lib/validation";
import { useState, useTransition } from "react";
import { createStaff } from "../actions/server";

export const useHandleStaffCreation = () => {
  const [isPending, startTransition] = useTransition();
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createError, setCreateError] = useState("");
  const { dialogs } = useGenericDialog();

  const handleStaffCreation = async (data: StaffType) => {
    if (!dialogs["createStaff"]) {
      setCreateError("");
      setCreateSuccess(false);

      return;
    }
    startTransition(async () => {
      const res = await createStaff(data);
      if (res.error) {
        setCreateError(res.error);
        setCreateSuccess(false);
        return;
      }
      setCreateError("");
      setCreateSuccess(true);
    });
  };

  return {
    handleStaffCreation,
    isPending,
    createSuccess,
    createError,
  };
};
