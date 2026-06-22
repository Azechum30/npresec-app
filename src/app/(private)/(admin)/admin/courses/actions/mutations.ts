/**biome-ignore-all assist/source/organizeImports: reason */
import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { useMutation } from "@tanstack/react-query";
import {
  bulkDeleteCourses,
  createCourse,
  deleteCourse,
  updateCourse,
} from "./actions";
import { coursesQueryOptions, getCourseQueryOption } from "./queries";

export const useCreateCourseMutationFn = () =>
  useMutation({
    mutationFn: createCourse,
    meta: {
      invalidates: coursesQueryOptions.queryKey,
      message: "course created",
    } satisfies MutationCacheType,
  });

export const useUpdateCourseMutationFn = (courseId: string) =>
  useMutation({
    mutationFn: updateCourse,
    meta: {
      invalidates: [
        coursesQueryOptions.queryKey,
        getCourseQueryOption(courseId).queryKey,
      ],
      message: "course updated",
    } satisfies MutationCacheType,
  });

export const useDeleteCourseMutationFn = () =>
  useMutation({
    mutationFn: deleteCourse,
    meta: {
      invalidates: coursesQueryOptions.queryKey,
      message: "course deleted",
    } satisfies MutationCacheType,
  });

export const useDeleteCoursesMutationFn = () =>
  useMutation({
    mutationFn: bulkDeleteCourses,
    meta: {
      invalidates: coursesQueryOptions.queryKey,
      message: "course(s) deleted",
    } satisfies MutationCacheType,
  });
