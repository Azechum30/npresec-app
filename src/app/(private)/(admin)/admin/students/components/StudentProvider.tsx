import UploadComponent from "@/components/customComponents/UploadComponent";
import { bulkCreateStudents } from "../actions/action";

export default function StudentProvider() {
  return (
    <UploadComponent
      filepath="students/students-template.csv"
      handleUpload={bulkCreateStudents}
    />
  );
}
