import { useTransition, useState } from "react";
import { deleteUserAction } from "../_actions/delete-user";
import { z } from "zod";

const UserIdSchema = z.object({
  id: z.string().min(1),
});

export const useHandleUserDelete = () => {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [isError, setIsError] = useState("");

  const handleUserDelete = (data: z.infer<typeof UserIdSchema>) => {
    startDeleteTransition(async () => {
      const { error, success } = await deleteUserAction(data);

      if (error) {
        setIsError(error);
        setIsDeleteSuccess(false);
        return;
      }

      if (success) {
        setIsError("");
        setIsDeleteSuccess(true);
        return;
      }
    });
  };

  return { isDeletePending, isError, isDeleteSuccess, handleUserDelete };
};
