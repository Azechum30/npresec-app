/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import DataTable from "@/components/customComponents/data-table";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDeleteCoursesMutationFn } from "../actions/mutations";
import { coursesQueryOptions } from "../actions/queries";
import { coursesTransformer } from "../utils/courses-transformer";
import CourseRowDetail from "./CourseRowDetail";
import { useGetCourseColumns } from "./courses-columns";

const RenderCoursesDataTable = () => {
  const columns = useGetCourseColumns();
  const { preferredDateFormat } = useUserPreferredDateFormat();

  const transformer = useMemo(
    () => coursesTransformer(preferredDateFormat),
    [preferredDateFormat],
  );
  const { mutateAsync } = useDeleteCoursesMutationFn();

  const { data, error } = useSuspenseQuery({
    ...coursesQueryOptions,
  });

  return (
    <>
      {error ? (
        <ErrorComponent error={error.message} />
      ) : data === undefined ? (
        <FallbackComponent />
      ) : (
        <DataTable
          data={data}
          columns={columns}
          transformer={transformer}
          filename="Courses-list"
          exportKey="courses"
          onDelete={async (rows) => {
            const ids = rows.map((row) => row.original.id);
            await Promise.try(async () => mutateAsync(ids));
          }}
          renderSubComponent={(row) => <CourseRowDetail row={row} />}
        />
      )}
    </>
  );
};

export default RenderCoursesDataTable;
