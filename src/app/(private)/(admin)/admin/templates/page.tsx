import { PageHeader } from "@/components/customComponents/page-header";
import { RenderTemplateFormModal } from "./_components/render-template-form-modal";

export default function TemplatesPage() {
  return (
    <>
      <PageHeader
        pageTitle="Manage Document Templates"
        showAddButton
        buttonText="Add Template"
        modalKey="create-a-document-template"
        permission="create:templates"
      />

      <RenderTemplateFormModal />
    </>
  );
}
