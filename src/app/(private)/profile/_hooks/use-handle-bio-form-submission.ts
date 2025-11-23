import { BioType } from "@/lib/validation";
import { useTransition, useState } from "react";
import { BioFormAction } from "../_actions/handle-bio-form-submission-action";

export const useHandleBioFormSubmission = () => {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState("");

  const handleBioFormSubmission = (data: BioType) => {
    startTransition(async () => {
      const { error, success } = await BioFormAction(data);

      if (error) {
        setIsError(error);
        setIsSuccess(false);
        return;
      }

      if (success) {
        setIsError("");
        setIsSuccess(true);
      }
    });
  };

  return { isError, isSuccess, isPending, handleBioFormSubmission };
};
