import { BulkCreateStaffType } from "@/lib/validation";
import UploadComponent from "../../../../../../components/customComponents/UploadComponent";
import { bulkCreateStaff } from "../actions/bulk-create-staff";

export default function StaffBulkUploadProvider() {
  return (
    <UploadComponent<BulkCreateStaffType>
      filepath="staff/staff-template.csv"
      handleUpload={bulkCreateStaff}
    />
  );
}
