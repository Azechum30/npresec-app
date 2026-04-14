"use client";

import DataTable from "@/components/customComponents/data-table";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { Notification } from "@/components/customComponents/notification";
import { StudentResponseType } from "@/lib/types";
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

  return (
    <>
      {students === undefined && error === undefined ? (
        <Notification description="Kindly select a class to filter students based on the selected class. " />
      ) : error ? (
        <ErrorComponent error={error} />
      ) : students && students.length === 0 ? (
        <Notification description="No student was found for the selected class." />
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
