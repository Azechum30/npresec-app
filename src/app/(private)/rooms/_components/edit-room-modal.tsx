/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { RoomType } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { useUpdateRoomMutationFn } from "../_actions/mutations";
import { getRoomQueryOptions } from "../_actions/queries";
import { CreateRoomForm } from "../_forms/create-room-form";

export const EditRoomModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();

  const { mutateAsync, isPending } = useUpdateRoomMutationFn();
  const isOpen = !!dialogs["edit-room"];
  const validId = id ?? null;

  const { data } = useQuery({
    ...getRoomQueryOptions(validId as string),
    enabled: isOpen && !!validId,
  });

  const handleRoomUpdate = (values: RoomType) => {
    Promise.try(async () => {
      await mutateAsync({ id: validId as string, ...values });
      onClose("edit-room");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("edit-room")}>
      <DialogContent>
        {isOpen && validId && data ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit Room Details</DialogTitle>
              <DialogDescription>
                Makes changes to the room details and save in realtime
              </DialogDescription>
            </DialogHeader>
            <CreateRoomForm
              onSubmitAction={handleRoomUpdate}
              defaultValues={{
                capacity: data.capacity,
                houseId: data.houseId,
                rmGender: data.rmGender,
              }}
              isPending={isPending}
              id={validId}
            />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Data is Loading</DialogTitle>
              <DialogDescription>Wait as we load the data</DialogDescription>
            </DialogHeader>
            <ShowLoadingState />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
