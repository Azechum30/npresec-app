/**biome-ignore-all assist/source/organizeImports:reason */
import { nextSafeAction } from "@/lib/next-safe-action";
import { TemplateSchema, templateOutputSchema } from "@/lib/validation";
import { authMiddleware } from "@/middlewares/auth";
import { requirePermissions } from "@/middlewares/permissions";
import { TemplateService } from "@/shared/templates.service";
import z from "zod";

export const createDocumentTemplate = authMiddleware
  .use(requirePermissions("create:templates"))
  .input(TemplateSchema)
  .output(templateOutputSchema)
  .handler(async ({ input }) =>
    nextSafeAction(
      async () => await new TemplateService().createDocumentTemplate(input),
    ),
  );

export const listTemplates = authMiddleware
  .use(requirePermissions("view:templates"))
  .output(z.array(templateOutputSchema))
  .handler(async () =>
    nextSafeAction(async () => await new TemplateService().listTemplates()),
  );

export const getTemplateById = authMiddleware
  .use(requirePermissions("view:templates"))
  .input(z.object({ templateId: z.string().min(1) }))
  .output(templateOutputSchema)
  .handler(async ({ input }) =>
    nextSafeAction(
      async () => await new TemplateService().getTemplateById(input.templateId),
    ),
  );

export const updateTemplate = authMiddleware
  .use(requirePermissions("edit:templates"))
  .input(TemplateSchema.extend({ templateId: z.cuid() }))
  .output(templateOutputSchema)
  .handler(async ({ input }) =>
    nextSafeAction(async () => {
      const { templateId, ...rest } = input;
      return await new TemplateService().updateTemplate(templateId, rest);
    }),
  );

export const deleteTemplate = authMiddleware
  .use(requirePermissions("delete:templates"))
  .input(z.object({ templateId: z.cuid().min(1) }))
  .handler(async ({ input }) =>
    nextSafeAction(
      async () => await new TemplateService().deleteTemplate(input.templateId),
    ),
  );
export const deleteTemplates = authMiddleware
  .use(requirePermissions("delete:templates"))
  .input(z.object({ templateIds: z.array(z.cuid().min(1)).min(1) }))
  .handler(async ({ input }) =>
    nextSafeAction(
      async () =>
        await new TemplateService().deleteTemplates(input.templateIds),
    ),
  );
