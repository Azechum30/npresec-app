"use client";

import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { client } from "@/lib/orpc";
import { ChangePasswordType } from "@/lib/validation";
import { createSafeClient, isDefinedError } from "@orpc/client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ChangePasswordForm } from "./change-password";

export const RenderChangePasswordModal = () => {
  const { dialogs, onClose } = useGenericDialog();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (values: ChangePasswordType) => {
    const safeClient = createSafeClient(client);
    setError(null);
    startTransition(async () => {
      const { error } = await safeClient.user.updatePassword(values);
      if (isDefinedError(error)) {
        setError(error.message);
      } else if (error) {
        setError(error.message);
      } else {
        toast.success("Password updated successfully");
        setTimeout(() => onClose("change-password"), 300);
      }
    });
  };
  return (
    <Dialog
      open={dialogs["change-password"]}
      onOpenChange={() => onClose("change-password")}>
      {dialogs["change-password"] && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change a new Password</DialogTitle>
            <DialogDescription>
              Kindly fill the form to change a new password
            </DialogDescription>
          </DialogHeader>
          {error && <ErrorComponent error={error} />}
          <ChangePasswordForm
            onSubmitAction={handlePasswordChange}
            isPending={isPending}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};
