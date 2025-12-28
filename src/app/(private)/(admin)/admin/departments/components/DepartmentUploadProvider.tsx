import { BulkUploadDepartmentType } from "@/lib/validation";
import UploadComponent from "@/components/customComponents/UploadComponent";
import { bulkUploadDepartments } from "../actions/bulk-upload-action";

export default function DepartmentUploadProvider() {
  return (
    <UploadComponent<BulkUploadDepartmentType>
      handleUploadAction={bulkUploadDepartments}
    />
  );
}
