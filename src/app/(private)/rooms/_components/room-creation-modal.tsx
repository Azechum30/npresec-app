/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { RoomType } from "@/lib/validation";
import { useCreateRoomMutationFn } from "../_actions/mutations";
import { CreateRoomForm } from "../_forms/create-room-form";

export const RoomCreationModal = () => {
  const { dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useCreateRoomMutationFn();

  const handleSubmit = (data: RoomType) => {
    Promise.try(async () => {
      await mutateAsync(data);
      onClose("create-room");
    });
  };

  const isOpen = !!dialogs["create-room"];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("create-room")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Room</DialogTitle>
          <DialogDescription>
            Kindly fill the form to create a new room
          </DialogDescription>
        </DialogHeader>

        <CreateRoomForm onSubmitAction={handleSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
};
