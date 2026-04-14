"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { TemplateType } from "@/lib/validation";
import { useTransition } from "react";
import { CreateTemplateForm } from "../_forms/create-template-form";

export const RenderTemplateFormModal = () => {
  const { dialogs, onClose } = useGenericDialog();

  const [isPending, startTransition] = useTransition();

  const handlSubmission = (data: TemplateType) => {
    startTransition(() => {
      console.log(data);
    });
  };

  return (
    <Dialog
      open={!!dialogs["create-a-document-template"]}
      onOpenChange={() => onClose("create-a-document-template")}>
      {dialogs["create-a-document-template"] && (
        <DialogContent className="w-full md:max-w-2xl">
          <DialogHeader className="border-b">
            <DialogTitle>Add New Document Template</DialogTitle>
            <DialogDescription>
              Use the form below to create a document template. Dynamic values
              should be enclosed with double curly braces.
            </DialogDescription>
          </DialogHeader>
          <>
            <CreateTemplateForm
              onSubmitAction={handlSubmission}
              isPending={isPending}
            />
          </>
        </DialogContent>
      )}
    </Dialog>
  );
};
