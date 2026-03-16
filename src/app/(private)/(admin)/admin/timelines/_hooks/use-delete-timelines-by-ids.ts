import { useState, useTransition } from "react";
import { deleteTimelinesByIds } from "../_actions/delete-timelimes-by-ids";

export const useDeleteTimelinesByIds = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<boolean | undefined>(false);
  const [count, setCount] = useState<number | undefined>();

  const [isPending, startTransition] = useTransition();

  const handleDeleteTimelinesByIds = (ids: string[]) => {
    setError(undefined);
    setSuccess(undefined);
    setCount(undefined);

    startTransition(async () => {
      const res = await deleteTimelinesByIds(ids);
      if (res.error) {
        setError(res.error);
        setSuccess(undefined);
        setCount(undefined);
        return;
      }

      if (res.success) {
        setSuccess(true);
        setCount(res.count);
        setError(undefined);
      }
    });
  };

  return { count, isPending, success, error, handleDeleteTimelinesByIds };
};
