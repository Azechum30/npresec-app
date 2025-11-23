import { useEffect, useState } from "react";
import { fetchClassessAction } from "../_actions/fetch-classess-action";
import { useAuth } from "@/components/customComponents/SessionProvider";
import { ClassesResponseType } from "@/lib/types";

export const useFetchClassess = () => {
  const [classes, setClasses] = useState<ClassesResponseType[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchSuccess, setFetchSuccess] = useState<boolean>(false);

  const user = useAuth();

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user) {
        setFetchError("User not found!");
        setFetchSuccess(false);
        return;
      }

      const { error, classes } = await fetchClassessAction(user.id);

      if (error) {
        setFetchError(error);
        setFetchSuccess(false);
        return;
      }

      if (classes === undefined) {
        setFetchError(null);
        setFetchSuccess(false);
        return;
      }

      setFetchError(null);
      setFetchSuccess(true);
      setClasses(classes);
    };

    if (user && user.id) {
      setClasses(null);
      setFetchError(null);
      setFetchSuccess(false);
      fetchClasses();
    }
  }, [user?.id]);

  return { classes, fetchError, fetchSuccess };
};
