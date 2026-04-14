"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { RichTextEditorWithLabel } from "@/components/customComponents/rich-text-editor-with-label";
import { Form } from "@/components/ui/form";
import { TemplateSchema, TemplateType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type CreateTemplateFormProps = {
  onSubmitAction: (data: TemplateType) => void;
  id?: string;
  defaultValues?: TemplateType;
  isPending: boolean;
};

export const CreateTemplateForm = ({
  onSubmitAction,
  id,
  defaultValues,
  isPending,
}: CreateTemplateFormProps) => {
  const form = useForm<TemplateType>({
    mode: "onChange",
    resolver: zodResolver(TemplateSchema),
    defaultValues: defaultValues ?? {
      name: "",
      content: "",
      isActive: false,
    },
  });

  const handleSubmit = (values: TemplateType) => {
    onSubmitAction(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 rounded-md p-4 border max-h-[70vh] overflow-y-auto scrollbar-thin">
        <InputWithLabel
          name="name"
          fieldTitle="Document Title"
          schema={TemplateSchema}
        />

        <RichTextEditorWithLabel<TemplateType>
          name="content"
          fieldTitle="Body"
          schema={TemplateSchema}
        />

        <LoadingButton disabled={!form.formState.isValid} loading={isPending}>
          {id ? (
            <>{isPending ? "Updating..." : "Update Template"}</>
          ) : (
            <>{isPending ? "Creating..." : "Create Template"}</>
          )}
        </LoadingButton>
      </form>
    </Form>
  );
};
