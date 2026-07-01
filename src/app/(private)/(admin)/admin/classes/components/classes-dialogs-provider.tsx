/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import type { UploadProps } from "@/components/customComponents/UploadComponent";
import { BulkClassesType } from "@/lib/validation";
import dynamic from "next/dynamic";
import type { JSX } from "react";
import { useBulkUploadClasses } from "../actions/mutations";

const CreateClassDialog = dynamic(() =>
  import("./CreateClassDialog").then((mod) => mod.default),
);
const EditClassDialog = dynamic(() =>
  import("./EditClassDialog").then((mod) => mod.default),
);
const DynamicUploadDialog = dynamic(() =>
  import("@/components/customComponents/UploadComponent").then(
    (mod) => mod.default,
  ),
);

const BulkUploadClassesDialog = DynamicUploadDialog as <T>(
  props: UploadProps<T>,
) => JSX.Element;

export const ClassesDialogsProvider = () => {
  const { mutateAsync } = useBulkUploadClasses();

  const handleUploadAction = async (data: BulkClassesType) => {
    await Promise.try(async () => mutateAsync(data));
  };
  return (
    <>
      <CreateClassDialog />
      <EditClassDialog />
      <BulkUploadClassesDialog
        filepath="classes/class-template.csv"
        handleUploadAction={handleUploadAction}
      />
    </>
  );
};
