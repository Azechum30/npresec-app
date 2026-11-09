/**biome-ignore-all assist/source/organizeImports:reason */

import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { TemplateType } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { CreateTemplateForm } from "../_forms/create-template-form";
import { useUpdateDocumentTemplateMutationFn } from "../mutations";
import { getTemplateQueryOptions } from "../queries";

export const EditTemplateModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useUpdateDocumentTemplateMutationFn();
  const isOpen = !!dialogs["edit-document-template"];
  const validId = id ?? null;

  const { data } = useQuery({
    ...getTemplateQueryOptions(validId as string),
    enabled: isOpen && !!validId,
  });

  const handleTemplateUpdate = async (data: TemplateType) => {
    await Promise.try(async () => {
      await mutateAsync({ ...data, templateId: validId as string });
      onClose("edit-document-template");
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => onClose("edit-document-template")}>
      <DialogContent className="w-full md:max-w-2xl">
        {isOpen && validId && data ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit Document Template</DialogTitle>
              <DialogDescription>
                Make changes to template and save in real-time.
              </DialogDescription>
            </DialogHeader>
            <CreateTemplateForm
              onSubmitAction={handleTemplateUpdate}
              isPending={isPending}
              defaultValues={{
                ...data,
                instructions: data.instructions ?? "",
                conclusion: data.conclusion ?? "",
              }}
            />
          </>
        ) : (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Data is Loading</DialogTitle>
              <DialogDescription>
                Please wait while data loads
              </DialogDescription>
            </DialogHeader>
            <ShowLoadingState />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
