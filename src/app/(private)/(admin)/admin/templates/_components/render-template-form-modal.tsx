/**biome-ignore-all assist/source/organizeImports:reason */

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { TemplateType } from "@/lib/validation";
import { CreateTemplateForm } from "../_forms/create-template-form";
import { useCreateDocumentTemplateMutationFn } from "../mutations";

export const RenderTemplateFormModal = () => {
  const { dialogs, onClose } = useGenericDialog();

  const { mutateAsync, isPending } = useCreateDocumentTemplateMutationFn();

  const handlSubmission = async (data: TemplateType) => {
    await Promise.try(async () => {
      await mutateAsync(data);
      onClose("create-a-document-template");
    });
  };

  const isOpen = !!dialogs["create-a-document-template"];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => onClose("create-a-document-template")}>
      <DialogContent className="w-full md:max-w-2xl">
        <DialogHeader className="border-b">
          <DialogTitle>Add New Document Template</DialogTitle>
          <DialogDescription>
            Use the form below to create a document template. Dynamic values
            should be enclosed with double curly braces.
          </DialogDescription>
        </DialogHeader>
        <CreateTemplateForm
          onSubmitAction={handlSubmission}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
