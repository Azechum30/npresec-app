import { useState, useTransition } from "react";
import { createTeacher } from "../actions/server";
import { TeacherType } from "@/lib/validation";

export const useHandleTeacherCreation = () => {
  const [isPending, startTransition] = useTransition();
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createError, setCreateError] = useState("");

  const handleTeacherCreation = async (data: TeacherType) => {
    startTransition(async () => {
      const res = await createTeacher(data);
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
    handleTeacherCreation,
    isPending,
    createSuccess,
    createError,
  };
};
