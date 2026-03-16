import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { BoardOfGovernorsType } from "@/lib/validation";
import { useEffect, useState, useTransition } from "react";
import { getBoardMember } from "../_actions/handle-get-board-member-details";

export const usePrefetchBoardMember = () => {
  const [fetchError, setFetchError] = useState("");
  const [isFetchSuccess, setIsFetchSuccess] = useState(false);
  const [isFetching, startFetching] = useTransition();
  const [values, setValues] = useState<BoardOfGovernorsType | undefined>();
  const { id, dialogs } = useGenericDialog();

  useEffect(() => {
    if (!dialogs["edit-board-of-governor"]) {
      return;
    }
    const fetchData = async () => {
      setValues(undefined);
      startFetching(async () => {
        const { error, boardMember } = await getBoardMember(id as string);

        if (error) {
          setFetchError(error);
          setIsFetchSuccess(false);
          setValues(undefined);
          return;
        }

        if (!boardMember) {
          setFetchError("");
          setIsFetchSuccess(false);
          setValues(undefined);
          return;
        }

        setFetchError("");
        setIsFetchSuccess(true);

        setValues({
          ...boardMember,
          photo_url:
            boardMember.picture && boardMember.picture.startsWith("https")
              ? boardMember.picture
              : null,
        });
      });
    };

    if (id) {
      fetchData();
    }
  }, [id, dialogs]);

  return { fetchError, isFetchSuccess, isFetching, values };
};
