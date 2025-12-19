"use client";

import LoadingState from "@/components/customComponents/Loading";
import DataTable from "@/components/customComponents/data-table";
import { useCourseStore } from "@/hooks/use-generic-store";
import { FC, use, useEffect, useMemo } from "react";
import { getCourses } from "../actions/actions";
import CourseRowDetail from "./CourseRowDetail";
import { useGetCourseColumns } from "./courses-columns";
import { useDeleteCourse } from "../hooks/use-delete-course";
import { useBulkDeleteCourses } from "../hooks/use-bulk-delete-courses";
import { coursesTransformer } from "../utils/courses-transformer";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { NoDataFound } from "@/components/customComponents/no-data-found";

type CoursesDataTableProps = {
  initialState: Awaited<ReturnType<typeof getCourses>>;
};

const RenderCoursesDataTable: FC<CoursesDataTableProps> = ({
  initialState,
}) => {
  const columns = useGetCourseColumns();
  const { isPending: isDeletePending } = useDeleteCourse();
  const { deleteCourses } = useBulkDeleteCourses();
  const { preferredDateFormat } = useUserPreferredDateFormat();

  const transformer = useMemo(
    () => coursesTransformer(preferredDateFormat),
    [preferredDateFormat]
  );

  return (
    <>
      {initialState.error ? (
        <ErrorComponent error={initialState.error} />
      ) : initialState.courses === undefined ? (
        <NoDataFound />
      ) : (
        <DataTable
          data={initialState.courses}
          columns={columns}
          transformer={transformer}
          filename="Courses-list"
          onDelete={async (rows) => {
            const ids = rows.map((row) => row.original.id);
            const codes = rows.map((row) => row.original.code);
            await deleteCourses(ids, codes);
          }}
          renderSubComponent={(row) => <CourseRowDetail row={row} />}
        />
      )}

      {isDeletePending && <LoadingState />}
    </>
  );
};

export default RenderCoursesDataTable;
