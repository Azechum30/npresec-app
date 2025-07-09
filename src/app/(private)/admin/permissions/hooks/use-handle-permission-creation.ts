import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { PermissionType } from "@/lib/validation";
import { useTransition } from "react";
import { toast } from "sonner";
import { createPermissions } from "../actions/mutations";

export const useHandlePermissionCreation = () => {
  const [isPending, startTransition] = useTransition();
  const { onClose } = useGenericDialog();

  const handlePermissionCreation = async (values: PermissionType) => {
    startTransition(async () => {
      const promiseResult = await createPermissions(values);
      if (promiseResult.error) {
        toast.error(promiseResult.error);
        return;
      }
      if (promiseResult.count) {
        onClose("create-permission");
        toast.success(`${promiseResult.count} permssion(s) were/was created`);
      }
    });
  };

  return { isPending, handlePermissionCreation };
};
