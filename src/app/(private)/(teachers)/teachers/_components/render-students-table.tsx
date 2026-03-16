"use client";

import DataTable from "@/components/customComponents/data-table";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { StudentResponseType } from "@/lib/types";
import { useEffect } from "react";
import { toast } from "sonner";
import { useGetStudentColumns } from "../_hooks/use-get-student-columns";
import { StudentTransformer } from "../_utils/student-transformer";

type RenderStudentsTableProps = {
  students?: StudentResponseType[];
  error?: string;
};

export const RenderStudentsTable = ({
  students,
  error,
}: RenderStudentsTableProps) => {
  const columns = useGetStudentColumns();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      {/* Show different states based on data availability */}
      {students === undefined && error === undefined ? (
        <div className="flex items-center justify-center py-8 w-full  h-full max-h-svh">
          <p className="text-muted-foreground">
            Please select a class to view students
          </p>
        </div>
      ) : error ? (
        <ErrorComponent error={error} />
      ) : students && students.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">
            No students found in the selected class
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={students ?? []}
          filename="Students-list"
          transformer={StudentTransformer}
        />
      )}
    </>
  );
};
