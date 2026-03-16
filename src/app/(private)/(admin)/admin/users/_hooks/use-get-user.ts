import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { UserResponseType } from "@/lib/types";
import { useEffect, useState, useTransition } from "react";
import { getUserPermisions } from "../_actions/get-user-with-permission";

export const useGetUser = () => {
  const [isFetchingUser, startFetchingTransition] = useTransition();
  const [fetchError, setfetchError] = useState("");
  const [user, setUser] = useState<UserResponseType | undefined>(undefined);
  const [success, setSuccess] = useState(false);
  const { id, dialogs } = useGenericDialog();

  useEffect(() => {
    const shouldFetchUser =
      id && (dialogs["update-user-role"] || dialogs["update-user-permissions"]);
    if (!shouldFetchUser) return;

    startFetchingTransition(async () => {
      const { error, user } = await getUserPermisions(id as string);
      if (error) {
        setfetchError(error);
        setSuccess(false);
        setUser(undefined);
        return;
      }

      if (!user) {
        setfetchError("");
        setSuccess(false);
        setUser(undefined);
        return;
      }

      setfetchError("");
      setSuccess(true);
      setUser(user);
    });
  }, [id, dialogs]);

  return { isFetchingUser, fetchError, success, user };
};
