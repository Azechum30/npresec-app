/** biome-ignore-all assist/source/organizeImports: reason */

import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { useMutation } from "@tanstack/react-query";
import {
  createDepartment,
  updateDepartmentAction,
} from "./create-department-action";
import {
  deleteDepartment,
  deleteDepartments,
} from "./delete-departments-action";
import { departmentsQueryOptions, getDepartmentQueryOptions } from "./queries";

export const useCreateDepartmentMutationFn = () =>
  useMutation({
    mutationFn: createDepartment,
    meta: {
      invalidates: departmentsQueryOptions.queryKey,
      message: "department created",
    } satisfies MutationCacheType,
  });

export const useUpdateDepartmentMutationFn = (departmentId: string) =>
  useMutation({
    mutationFn: updateDepartmentAction,
    meta: {
      invalidates: [
        departmentsQueryOptions.queryKey,
        getDepartmentQueryOptions(departmentId).queryKey,
      ],
      message: "department updated",
    } satisfies MutationCacheType,
  });

export const useDeleteDepartmentMutationFn = () =>
  useMutation({
    mutationFn: deleteDepartment,
    meta: {
      invalidates: departmentsQueryOptions.queryKey,
      message: "department deleted",
    } satisfies MutationCacheType,
  });

export const useDeleteDepartmentsMutationFn = () =>
  useMutation({
    mutationFn: deleteDepartments,
    meta: {
      invalidates: departmentsQueryOptions.queryKey,
      message: "department(s) deleted",
    } satisfies MutationCacheType,
  });
