import UploadComponent from "@/components/customComponents/UploadComponent";
import { bulkCreateStudents } from "../actions/action";

export default function StudentProvider() {
  return <UploadComponent handleUpload={bulkCreateStudents} />;
}
