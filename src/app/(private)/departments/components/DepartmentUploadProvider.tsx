import { BulkUploadDepartmentType } from "@/lib/validation"
import UploadComponent from "./UploadComponent"
import { bulkUploadDepartments } from "./bulk-upload-action"

export default function DepartmentUploadProvider() {
	return (
		<UploadComponent<BulkUploadDepartmentType>
			handleUpload={bulkUploadDepartments}
		/>
	)
}
