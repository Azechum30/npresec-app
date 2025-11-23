import { PermissionResponseType } from "@/lib/types";
import { useTransition, useState, useEffect } from "react";
import { fetchAllPermissions } from "../_actions/fetch-all-permissions";

export const useFetchAllPermissions = () => {
  const [isFetching, startFetchingTransition] = useTransition();
  const [permissions, setPermissions] = useState<
    PermissionResponseType[] | undefined
  >(undefined);
  const [fetchError, setfetchError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    startFetchingTransition(async () => {
      const { error, permissions } = await fetchAllPermissions();
      if (error) {
        setfetchError(error);
        setSuccess(false);
        setPermissions(undefined);
        return;
      }

      if (!permissions) {
        setfetchError("");
        setSuccess(false);
        setPermissions(undefined);
        return;
      }
      setfetchError("");
      setSuccess(true);
      setPermissions(permissions);
      return;
    });
  }, []);

  return { fetchError, success, permissions, isFetching };
};
