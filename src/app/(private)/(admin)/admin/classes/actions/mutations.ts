/** biome-ignore-all assist/source/organizeImports:reason */

import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { useMutation } from "@tanstack/react-query";
import { classQueryOptions, getClassQueryOptions } from "./queries";
import {
  bulkDeleteClasses,
  createClassAction,
  deleteClass,
  updateClass,
} from "./server-actions";

export const useCreateClassMutationFn = () =>
  useMutation({
    mutationFn: createClassAction,
    meta: {
      invalidates: classQueryOptions.queryKey,
      message: "class created",
    } as MutationCacheType,
  });

export const useUpdateClassMutationFn = (classId: string) =>
  useMutation({
    mutationFn: updateClass,
    meta: {
      invalidates: [
        classQueryOptions.queryKey,
        getClassQueryOptions(classId).queryKey,
      ],
      message: "class updated",
    },
  });

export const useDeleteClassMutationFn = () =>
  useMutation({
    mutationFn: deleteClass,
    meta: { invalidates: classQueryOptions.queryKey, message: "class deleted" },
  });

export const useDeleteClassesMutationFn = () =>
  useMutation({
    mutationFn: bulkDeleteClasses,
    meta: {
      invalidates: classQueryOptions.queryKey,
      message: "class(s) deleted",
    },
  });
