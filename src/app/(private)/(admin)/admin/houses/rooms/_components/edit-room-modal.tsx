"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HouseGender } from "@/generated/prisma/enums";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { client } from "@/lib/orpc";
import { RoomResponseType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { RoomType } from "@/lib/validation";
import { createSafeClient, isDefinedError } from "@orpc/client";
import { Loader } from "lucide-react";
import { startTransition, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { CreateRoomForm } from "../_forms/create-room-form";

export const EditRoomModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();

  const [values, setValues] = useState<RoomResponseType | null>(null);
  const [isUpdating, startUpdateTransition] = useTransition();

  useEffect(() => {
    if (!id || !dialogs["edit-room"]) return;

    const fetchRoomById = () => {
      const safeClient = createSafeClient(client);
      startTransition(async () => {
        const { error, data } = await safeClient.room.getRoomById({
          id: id as string,
        });

        if (isDefinedError(error)) {
          toast.error(error.message || "An unknown error occurred");
          return;
        } else if (error) {
          toast.error(error.message);
          return;
        } else if (data) {
          setValues({ ...data, rmGender: data.rmGender as HouseGender });
        }
      });
    };

    fetchRoomById();
  }, [id, dialogs]);

  const handleRoomUpdate = (data: RoomType) => {
    const safeClient = createSafeClient(client);
    startUpdateTransition(async () => {
      const { error } = await safeClient.room.updateRoomById({
        ...data,
        id: id as string,
      });
      if (isDefinedError(error)) {
        toast.error(error.message || "Something went wrong!");
        return;
      } else if (error) {
        toast.error(error.message || "Something went wrong!");
        return;
      } else {
        toast.success("room details updated successfully");
        setTimeout(() => onClose("edit-room"), 300);
      }
    });
  };

  return (
    <>
      <Dialog
        open={dialogs["edit-room"]}
        onOpenChange={() => onClose("edit-room")}>
        {dialogs["edit-room"] && (
          <DialogContent className={cn("w-full", !values && "w-fit")}>
            {values !== null ? (
              <>
                <DialogHeader>
                  <DialogTitle>Edit Room Details</DialogTitle>
                  <DialogDescription>
                    Makes changes to the room details and save in realtime
                  </DialogDescription>
                </DialogHeader>
                <CreateRoomForm
                  onSubmitAction={handleRoomUpdate}
                  defaultValues={values}
                  isPending={isUpdating}
                  id={id}
                />
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Data is Loading</DialogTitle>
                  <DialogDescription>
                    Wait as we load the data
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full h-full justify-center items-center">
                  <Loader className="size-12 text-primary animate-spin" />
                </div>
              </>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
