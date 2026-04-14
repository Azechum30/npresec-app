import { GradeType } from "@/lib/validation";
import { useState, useTransition } from "react";
import { createScoresAction } from "../_actions/create-scores-action";

export const useHandleScoresCreation = () => {
  const [isCreating, startTransition] = useTransition();
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createCount, setCreateCount] = useState(0);

  const handleScoresCreation = (values: GradeType) => {
    startTransition(async () => {
      const { error, count } = await createScoresAction(values);
      if (error) {
        setCreateError(error);
        setCreateSuccess(false);
        return;
      }

      if (!count) {
        setCreateCount(0);
        setCreateError("");
        setCreateSuccess(false);
        return;
      }
      setCreateError("");
      setCreateSuccess(true);
      setCreateCount(count);
    });
  };

  return {
    handleScoresCreation,
    isCreating,
    createError,
    createSuccess,
    createCount,
  };
};
