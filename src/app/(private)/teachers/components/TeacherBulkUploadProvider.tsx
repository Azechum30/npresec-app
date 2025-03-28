import { BulkCreateTeachersType } from "@/lib/validation"
import UploadComponent from "../../departments/components/UploadComponent"
import { bulkCreateTeachers } from "../actions/bulk-create-teachers"

export default function TeacherBulkUploadProvider() {
	return (
		<UploadComponent<BulkCreateTeachersType>
			handleUpload={bulkCreateTeachers}
		/>
	)
}
