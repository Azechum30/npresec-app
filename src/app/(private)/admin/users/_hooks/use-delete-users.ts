import { useTransition, useState } from "react";
import { deleteUsersAction } from "../_actions/delete-users";

export const useHandleUsersDelete = () => {
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [isError, setIsError] = useState("");
  const [userDeleteCount, setUserDeleteCount] = useState(0);

  const handleUsersDelete = async ({ data }: { data: { ids: string[] } }) => {
    const { error, success, count } = await deleteUsersAction(data);
    if (error) {
      setIsError(error);
      setIsDeleteSuccess(false);
      setUserDeleteCount(0);
      return;
    }

    if (success) {
      setIsError("");
      setIsDeleteSuccess(true);
      setUserDeleteCount(count);
      return;
    }
  };

  return { isDeleteSuccess, isError, userDeleteCount, handleUsersDelete };
};
