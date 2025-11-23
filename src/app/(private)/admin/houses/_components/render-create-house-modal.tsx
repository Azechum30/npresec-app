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

export const RenderCreateHouseModal = () => {
  const { dialogs, onClose } = useGenericDialog();

  return (
    <>
      <Dialog
        open={dialogs["create-house"]}
        onOpenChange={() => onClose("create-house")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new House</DialogTitle>
            <DialogDescription>
              Kindly fill the form to create a new house
            </DialogDescription>
          </DialogHeader>
          <CreateHouseForm onSubmit={() => {}} />
        </DialogContent>
      </Dialog>
    </>
  );
};
