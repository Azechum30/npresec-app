import { useState, useTransition } from "react";
import { deleteTimelineById } from "../_actions/delete-timeline-by-id";

export const useDeleteTimelineById = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<boolean | undefined>(false);

  const [isPending, startTransition] = useTransition();

  const handleDeleteTimelineById = (id: string) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      const res = await deleteTimelineById(id);
      if (res.error) {
        setError(res.error);
        setSuccess(undefined);
        return;
      }

      if (res.success) {
        setSuccess(true);
        setError(undefined);
      }
    });
  };

  return { isPending, success, error, handleDeleteTimelineById };
};
