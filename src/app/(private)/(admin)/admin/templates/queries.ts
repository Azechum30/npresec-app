/**biome-ignore-all assist/source/organizeImports:reason */

import { getQueryClient } from "@/components/providers/get-query-client";
import { orpc } from "@/lib/orpc-react-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

export const templatesQueries = queryOptions({
  ...orpc.template.listTemplates.queryOptions(),
  placeholderData: keepPreviousData,
});

export const getTemplateQueryOptions = (templateId: string) => {
  const queryClient = getQueryClient();

  return queryOptions({
    ...orpc.template.getTemplateById.queryOptions({ input: { templateId } }),
    initialData: () =>
      queryClient
        .getQueryData(templatesQueries.queryKey)
        ?.find((template) => template.id === templateId),
    enabled: !!templateId,
  });
};
