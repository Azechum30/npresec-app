import UploadComponent from "../../../../../components/customComponents/UploadComponent";
import { bulkUploadClasses } from "../actions/server-actions";

export default function ClassesProvider() {
  return <UploadComponent handleUpload={bulkUploadClasses} />;
}
