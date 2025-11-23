"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateUserForm } from "../_forms/create-new-user-form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { UserType } from "@/lib/validation";
import { useTransition } from "react";
import { createNewUserAction } from "../_actions/create-new-user";
import { toast } from "sonner";

export const CreateNewUserModal = () => {
  const { dialogs, onClose } = useGenericDialog();
  const [isPending, startTransition] = useTransition();

  const handleUserCreation = (data: UserType) => {
    startTransition(async () => {
      const { error, success } = await createNewUserAction(data);
      if (error) {
        toast.error(error);
        return;
      }

      if (success) {
        toast.success("User created successfully");
        setTimeout(() => {
          onClose("create-auth-user");
        }, 100);
      }
    });
  };
  return (
    <>
      <Dialog
        open={dialogs["create-auth-user"] === true ? true : false}
        onOpenChange={() => onClose("create-auth-user")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new User</DialogTitle>
            <DialogDescription>
              Kindly fill the form fields and create a new user
            </DialogDescription>
          </DialogHeader>

          <CreateUserForm
            onSubmit={(values) => handleUserCreation(values)}
            isPending={isPending}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
