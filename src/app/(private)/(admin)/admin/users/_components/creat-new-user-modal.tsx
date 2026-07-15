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
import type { UserType } from "@/lib/validation";
import { useCreateUserWithRoleFn } from "../_actions/mutations";
import { CreateUserForm } from "../_forms/create-new-user-form";

export const CreateNewUserModal = () => {
  const { dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useCreateUserWithRoleFn();

  const handleUserCreation = (data: UserType) => {
    Promise.try(async () => {
      await mutateAsync(data);
      onClose("create-auth-user");
    });
  };
  const isOpen = !!dialogs["create-auth-user"];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("create-auth-user")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new User</DialogTitle>
          <DialogDescription>
            Kindly fill the form fields and create a new user
          </DialogDescription>
        </DialogHeader>

        <CreateUserForm onSubmit={handleUserCreation} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
};
