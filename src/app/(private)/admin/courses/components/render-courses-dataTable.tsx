"use client";

import LoadingState from "@/components/customComponents/Loading";
import DataTable from "@/components/customComponents/data-table";
import { useCourseStore } from "@/hooks/use-generic-store";
import { FC, use, useEffect } from "react";
import { getCourses } from "../actions/actions";
import CourseRowDetail from "./CourseRowDetail";
import { useGetCourseColumns } from "./courses-columns";
import { useDeleteCourse } from "../hooks/use-delete-course";
import { useBulkDeleteCourses } from "../hooks/use-bulk-delete-courses";
import { coursesTransformer } from "../utils/courses-transformer";

type CoursesDataTableProps = {
  initialState: Promise<Awaited<ReturnType<typeof getCourses>>>;
};

const RenderCoursesDataTable: FC<CoursesDataTableProps> = ({
  initialState,
}) => {
  const {
    setData,
    intialState: storeState,
    bulkAddData,
    bulkDeleteData,
  } = useCourseStore();

  const promise = use(initialState);
  const columns = useGetCourseColumns();
  const { isPending: isDeletePending } = useDeleteCourse();
  const { deleteCourses } = useBulkDeleteCourses();

  useEffect(() => {
    if (!(promise.error || promise.courses === undefined))
      setData(promise.courses);
  }, [promise.courses, setData]);

  return (
    <>
      <DataTable
        data={storeState}
        columns={columns}
        transformer={coursesTransformer}
        filename="Courses-list"
        onDelete={async (rows) => {
          const ids = rows.map((row) => row.original.id);
          const codes = rows.map((row) => row.original.code);
          await deleteCourses(ids, codes);
        }}
        renderSubComponent={(row) => <CourseRowDetail row={row} />}
      />

      {isDeletePending && <LoadingState />}
    </>
  );
};

export default RenderCoursesDataTable;
