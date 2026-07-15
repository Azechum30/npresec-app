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
import type { HouseType } from "@/lib/validation";
import { CreateHouseForm } from "../_forms/create-house";
import { useCreateHouseMutationFn } from "../mutations";

export const RenderCreateHouseModal = () => {
  const { dialogs, onClose } = useGenericDialog();

  const { mutateAsync, isPending } = useCreateHouseMutationFn();

  const handleHouseCreation = (data: HouseType) => {
    Promise.try(async () => {
      await mutateAsync(data);
      onClose("create-house");
    });
  };

  const isOpen = !!dialogs["create-house"];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("create-house")}>
      <DialogContent className="md:w-auto md:h-auto overflow-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle>Create a new House</DialogTitle>
          <DialogDescription>
            Kindly fill the form to create a new house
          </DialogDescription>
        </DialogHeader>
        <CreateHouseForm onSubmit={handleHouseCreation} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
};
