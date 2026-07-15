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
import type { BanUserType } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { useBanUserMutationFn } from "../_actions/mutations";
import { BanUserForm } from "../_forms/ban-user-form";

export const BanUserModal = () => {
  const { dialogs, id, onClose } = useGenericDialog();

  const { mutateAsync, isPending } = useBanUserMutationFn(id as string);
  const router = useRouter();

  const handleUserBan = async (data: BanUserType) => {
    await Promise.try(async () => {
      await mutateAsync(data);
      onClose("ban-user");
      router.refresh();
    });
  };

  const isOpen = !!dialogs["ban-user"];
  const validId = id ?? null;
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("ban-user")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User Form</DialogTitle>
          <DialogDescription>
            Kindly fill the form and proceed with banning the selected user
          </DialogDescription>
        </DialogHeader>
        <BanUserForm
          onSubmitAction={handleUserBan}
          userId={validId as string}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
