import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { RenderTemplateFormModal } from "./_components/render-template-form-modal";

export default function TemplatesPage() {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-base font-semibold tracking-tight line-clamp-1">
          Document Tamplates
        </h1>
        <OpenDialogs
          dialogKey="create-a-document-template"
          title="Add a new Template"
        />
      </div>

      <RenderTemplateFormModal />
    </>
  );
}
