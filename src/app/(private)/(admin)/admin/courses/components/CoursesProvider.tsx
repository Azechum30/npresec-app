"use client";

import UploadComponent from "@/components/customComponents/UploadComponent";
import { bulkUploadCourses } from "../actions/actions";

export default function CoursesProvider() {
  return <UploadComponent handleUploadAction={bulkUploadCourses} />;
}
