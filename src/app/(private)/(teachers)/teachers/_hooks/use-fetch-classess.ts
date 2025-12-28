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
    if (!user || !user.id) return;

    const fetchClasses = async () => {
      setClasses(null);
      setFetchError(null);
      setFetchSuccess(false);

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

    fetchClasses();
  }, [user]);

  return { classes, fetchError, fetchSuccess };
};
