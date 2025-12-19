"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateHouseForm } from "../_forms/create-house";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useEffect, useState, useTransition } from "react";
import { HouseType } from "@/lib/validation";
import { createSafeClient, isDefinedError } from "@orpc/client";
import { client } from "@/lib/orpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/customComponents/Loading";
import { cn } from "@/lib/utils";

export const EditHouseModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [defaulValues, setDefaultValues] = useState<HouseType | undefined>();

  useEffect(() => {
    if (!id || !dialogs["edit-house"]) return;

    setDefaultValues(undefined);
    const fetchHouse = async () => {
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
  }, [id]);

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
        <DialogContent
          className={cn(
            "w-full md:w-auto h-full md:h-auto overflow-auto scrollbar-thin",
            defaulValues && "md:max-h-[80vh]"
          )}>
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
      </Dialog>
    </>
  );
};
