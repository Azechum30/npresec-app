"use client";

import LoadingState from "@/components/customComponents/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { client } from "@/lib/orpc";
import { HouseType } from "@/lib/validation";
import { createSafeClient, isDefinedError } from "@orpc/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { CreateHouseForm } from "../_forms/create-house";

export const EditHouseModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [defaulValues, setDefaultValues] = useState<HouseType | undefined>();

  useEffect(() => {
    if (!id || !dialogs["edit-house"]) return;

    const fetchHouse = async () => {
      setDefaultValues(undefined);
      const safeClient = createSafeClient(client);
      const { data, error } = await safeClient.house.getHouseById({
        id: id as string,
      });

      if (isDefinedError(error)) {
        toast.error(
          error.message || "Failed to fetch house details. Please try again."
        );
        return;
      } else if (error) {
        toast.error(
          error.message || "An unexpected error occurred. Please try again."
        );
        return;
      } else {
        setDefaultValues({
          name: data.name,
          houseGender: data.houseGender,
          residencyType: data.residencyType,
          occupancy: data.occupancy,
          houseMasterId: data.houseMasterId,
        });
      }
    };

    fetchHouse();
  }, [id, dialogs]);

  const handleHouseUpdate = (data: HouseType) => {
    startTransition(async () => {
      const safeClient = createSafeClient(client);
      const { error } = await safeClient.house.updateHouse({
        ...data,
        id: id as string,
      });

      if (isDefinedError(error)) {
        toast.error(
          error.message || "Failed to update house. Please try again."
        );
        return;
      } else {
        if (error) {
          toast.error(
            error.message || "An unexpected error occurred. Please try again."
          );
        } else {
          toast.success("House updated successfully.");

          setTimeout(() => {
            onClose("edit-house");
            router.refresh();
          }, 100);
        }
      }
    });
  };
  return (
    <>
      <Dialog
        open={dialogs["edit-house"]}
        onOpenChange={() => onClose("edit-house")}>
        {dialogs["edit-house"] && id && (
          <DialogContent>
            {defaulValues ? (
              <>
                <DialogHeader>
                  <DialogTitle>Edit House Profile</DialogTitle>
                  <DialogDescription>
                    Kindly make changes and save in realtime
                  </DialogDescription>
                </DialogHeader>
                <CreateHouseForm
                  onSubmit={handleHouseUpdate}
                  isPending={isPending}
                  defaultValues={defaulValues}
                  id={id}
                />
              </>
            ) : (
              <>
                <DialogHeader className="sr-only">
                  <DialogTitle> Data is Loading...</DialogTitle>
                  <DialogDescription>
                    Kindly wait while data is loading
                  </DialogDescription>
                </DialogHeader>
                <LoadingState />
              </>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
