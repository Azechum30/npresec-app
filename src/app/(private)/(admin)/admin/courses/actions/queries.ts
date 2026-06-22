/**biome-ignore-all assist/source/organizeImports: reason */

import { getQueryClient } from "@/components/providers/get-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getQueryKey } from "../../staff/utils/get-query-key";
import { getCourse, getCourses } from "./actions";

export const coursesQueryOptions = queryOptions({
  queryKey: getQueryKey().course.all,
  queryFn: () => getCourses(),
  select: (data) =>
    data?.courses?.sort((a, b) => a.title.localeCompare(b.title)),
  placeholderData: keepPreviousData,
});

export const getCourseQueryOption = (courseId: string) => {
  const queryClient = getQueryClient();
  return queryOptions({
    queryKey: getQueryKey(courseId).course.single,
    queryFn: () => getCourse(courseId).then((data) => data.course),
    initialData: () =>
      queryClient
        .getQueryData(coursesQueryOptions.queryKey)
        ?.courses?.find((c) => c.id === courseId),
  });
};
