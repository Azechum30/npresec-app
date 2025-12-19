import { useState, useTransition } from "react";
import { createStaff } from "../actions/server";
import { StaffType } from "@/lib/validation";

export const useHandleStaffCreation = () => {
  const [isPending, startTransition] = useTransition();
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createError, setCreateError] = useState("");

  const handleStaffCreation = async (data: StaffType) => {
    startTransition(async () => {
      const res = await createStaff(data);
      if (res.error) {
        setCreateError(res.error);
        setCreateSuccess(false);
        return;
      } else if (res.errors) {
        res.errors.forEach((error: string) => {
          setCreateError(error);
          setCreateSuccess(false);
        });
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
