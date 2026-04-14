import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useTransition, useState, useEffect } from "react";

export const useFetchStudentScoreById = () => {
  const [fetchError, setFetchError] = useState("");
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [isFetching, startFetching] = useTransition();
  const { id } = useGenericDialog();

  useEffect(() => {
    if (!id) return;

    startFetching(async () => {});
  }, [id]);
};
