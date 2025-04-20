import { BulkCreateTeachersType } from "@/lib/validation";
import UploadComponent from "../../../../../components/customComponents/UploadComponent";
import { bulkCreateTeachers } from "../actions/bulk-create-teachers";

export default function TeacherBulkUploadProvider() {
  return (
    <UploadComponent<BulkCreateTeachersType>
      handleUpload={bulkCreateTeachers}
    />
  );
}
