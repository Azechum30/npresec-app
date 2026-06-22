/** biome-ignore-all assist/source/organizeImports: reason */

import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { useMutation } from "@tanstack/react-query";
import { getQueryKey } from "../../staff/utils/get-query-key";
import {
  bulkDeleteStudents,
  createStudent,
  deleteStudent,
  updateStudent,
} from "./action";

export const useCreateStudentMutationFn = () =>
  useMutation({
    mutationFn: createStudent,
    meta: {
      invalidates: getQueryKey().student.all,
      message: "student has been queued for processing",
    } satisfies MutationCacheType,
  });

export const useUpdateStudentMutationFn = (studentId: string) =>
  useMutation({
    mutationFn: updateStudent,
    meta: {
      invalidates: [
        getQueryKey().student.all,
        getQueryKey(studentId).student.single,
      ],
      message: "student updated",
    } satisfies MutationCacheType,
  });

export const useDeleteStudentMutationFn = () =>
  useMutation({
    mutationFn: deleteStudent,
    meta: {
      invalidates: getQueryKey().student.all,
      message: "student deleted",
    } satisfies MutationCacheType,
  });

export const useDeleteStudentsMutationFn = () =>
  useMutation({
    mutationFn: bulkDeleteStudents,
    meta: {
      invalidates: getQueryKey().student.all,
      message: "student deleted",
    } satisfies MutationCacheType,
  });
