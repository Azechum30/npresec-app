"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { CreateHouseForm } from "../_forms/create-house";
import { useTransition } from "react";
import { HouseType } from "@/lib/validation";
import { client } from "@/lib/orpc";
import { createSafeClient, isDefinedError } from "@orpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const RenderCreateHouseModal = () => {
  const { dialogs, onClose } = useGenericDialog();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleHouseCreation = (data: HouseType) => {
    startTransition(async () => {
      const safeClient = createSafeClient(client);
      const { error } = await safeClient.house.createHouse(data);

      if (isDefinedError(error)) {
        toast.error(
          error.message || "Failed to create house. Please try again."
        );
        return;
      } else if (error) {
        toast.error(
          error.message || "An unexpected error occurred. Please try again."
        );
      } else {
        toast.success("House created successfully.");

        setTimeout(() => {
          onClose("create-house");
          router.refresh();
        }, 100);
      }
    });
  };

  return (
    <>
      <Dialog
        open={dialogs["create-house"]}
        onOpenChange={() => onClose("create-house")}>
        <DialogContent className="md:w-auto md:h-auto overflow-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle>Create a new House</DialogTitle>
            <DialogDescription>
              Kindly fill the form to create a new house
            </DialogDescription>
          </DialogHeader>
          <CreateHouseForm
            onSubmit={handleHouseCreation}
            isPending={isPending}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
