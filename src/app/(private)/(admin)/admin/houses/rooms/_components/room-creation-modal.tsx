"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { client } from "@/lib/orpc";
import { RoomType } from "@/lib/validation";
import { createSafeClient, isDefinedError } from "@orpc/client";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import { CreateRoomForm } from "../_forms/create-room-form";

export const RoomCreationModal = () => {
  const { dialogs, onClose } = useGenericDialog();
  const [isPending, startTransition] = useTransition();

  const safeClient = useMemo(() => createSafeClient(client), []);
  const router = useRouter();

  const handleSubmit = (data: RoomType) => {
    startTransition(async () => {
      const { error } = await safeClient.room.createRoom(data);

      if (isDefinedError(error)) {
        toast.error(error.message);
        return;
      } else if (error) {
        toast.error(error.message);
      } else {
        toast.success("room created succesfully!");
        setTimeout(() => {
          onClose("create-room");
          router.refresh();
        }, 100);
      }
    });
  };

  return (
    <>
      <Dialog
        open={dialogs["create-room"]}
        onOpenChange={() => onClose("create-room")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new Room</DialogTitle>
            <DialogDescription>
              Kindly fill the form to create a new room
            </DialogDescription>
          </DialogHeader>
          <>
            <CreateRoomForm
              onSubmitAction={handleSubmit}
              isPending={isPending}
            />
          </>
        </DialogContent>
      </Dialog>
    </>
  );
};
