/** biome-ignore-all assist/source/organizeImports:reason */
"use client";

import { CheckboxWithLabel } from "@/components/customComponents/checkbox-with-label";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { RichTextEditorWithLabel } from "@/components/customComponents/rich-text-editor-with-label";
import { Form } from "@/components/ui/form";
import { TemplateSchema, type TemplateType } from "@/lib/validation";
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
      type: "",
      documentHeading: "",
      intro: "",
      instructions: "",
      conclusion: "",
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
          name="type"
          fieldTitle="Document Type"
          className="md:max-w-2xl"
          schema={TemplateSchema}
        />

        <InputWithLabel
          name="documentHeading"
          fieldTitle="Document Heading (text after salutation)"
          schema={TemplateSchema}
          className="md:max-w-2xl"
        />

        <RichTextEditorWithLabel<TemplateType>
          name="intro"
          fieldTitle="Letter Intro"
          schema={TemplateSchema}
        />
        <RichTextEditorWithLabel<TemplateType>
          name="instructions"
          fieldTitle="Notable instructions"
          schema={TemplateSchema}
        />
        <RichTextEditorWithLabel<TemplateType>
          name="conclusion"
          fieldTitle="Conclusion and summary"
          schema={TemplateSchema}
        />

        <CheckboxWithLabel
          name="isActive"
          label="Indicate whether the template is active or or not. This determines whether the template can be used for document generation."
        />

        <LoadingButton disabled={!form.formState.isValid} loading={isPending}>
          {id
            ? isPending
              ? "Updating..."
              : "Update Template"
            : isPending
              ? "Creating..."
              : "Create Template"}
        </LoadingButton>
      </form>
    </Form>
  );
};
