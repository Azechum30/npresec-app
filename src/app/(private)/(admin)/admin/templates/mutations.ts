/**biome-ignore-all assist/source/organizeImports:reaon */

import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { orpc } from "@/lib/orpc-react-query-client";
import { useMutation } from "@tanstack/react-query";

export const useCreateDocumentTemplateMutationFn = () =>
  useMutation({
    ...orpc.template.createDocumentTemplate.mutationOptions(),
    meta: {
      invalidates: orpc.template.listTemplates.key(),
      message: "template saved",
    } satisfies MutationCacheType,
  });

export const useUpdateDocumentTemplateMutationFn = () =>
  useMutation({
    ...orpc.template.updateTemplate.mutationOptions(),
    meta: {
      invalidates: [
        orpc.template.listTemplates.key(),
        orpc.template.getTemplateById.key(),
      ],
      message: "template updated",
    } satisfies MutationCacheType,
  });

export const useDeleteDocumentTemplateMutationFn = () =>
  useMutation({
    ...orpc.template.deleteTemplate.mutationOptions(),
    meta: {
      invalidates: orpc.template.listTemplates.key(),
      message: "template deleted",
    } satisfies MutationCacheType,
  });

export const useDeleteDocumentTemplatesMutationFn = () =>
  useMutation({
    ...orpc.template.deleteTemplates.mutationOptions(),
    meta: {
      invalidates: orpc.template.listTemplates.key(),
      message: "template(s) deleted",
    } satisfies MutationCacheType,
  });
