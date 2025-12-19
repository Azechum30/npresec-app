import { StaffEditType, StaffType } from "@/lib/validation";
import { useState, useTransition } from "react";
import { updateStaff } from "../actions/server";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";

export const useHandleStaffUpdate = () => {
  const [isUpdating, startTransition] = useTransition();
  const { id } = useGenericDialog();
  const [updateError, setUpdateError] = useState("");
  const [updateSucess, setUpdateSuccess] = useState(false);

  const handleStaffUpdate = async (data: StaffType) => {
    startTransition(async () => {
      const res = await updateStaff(id as string, data);
      if (res?.error) {
        setUpdateError(res.error || "Could not save changes to staff data");
        setUpdateSuccess(false);
        return;
      }
      setUpdateError("");
      setUpdateSuccess(true);
    });
  };
  return { handleStaffUpdate, isUpdating, updateError, updateSucess };
};
