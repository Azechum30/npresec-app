import type { Prisma } from "@/generated/prisma/client";
import { ActionError } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { type TemplateServerResponseType, templateSelect } from "@/lib/types";
import type { TemplateType } from "@/lib/validation";

interface ITemplateService {
  createDocumentTemplate: (
    data: TemplateType,
  ) => Promise<TemplateServerResponseType>;

  listTemplates: () => Promise<TemplateServerResponseType[]>;

  getTemplateById: (templateId: string) => Promise<TemplateServerResponseType>;
  updateTemplate: (
    templateId: string,
    data: TemplateType,
  ) => Promise<TemplateServerResponseType>;

  deleteTemplate: (templateId: string) => Promise<void>;

  deleteTemplates: (templateIds: string[]) => Promise<{ count: number }>;
}

export class TemplateService implements ITemplateService {
  existingTemplate = async (id?: string, data?: TemplateType) => {
    const whereInput: Prisma.TemplateWhereInput = {};

    if (id && !data) whereInput.id = id;

    if (id && data) {
      whereInput.AND = [{ type: data.type }, { NOT: { id: id } }];
    }

    if (!id && data) {
      whereInput.type = data.type;
    }

    const template = await prisma.template.findFirst({
      where: whereInput,
      select: templateSelect,
    });

    return template;
  };

  createDocumentTemplate = async (data: TemplateType) => {
    const template = await this.existingTemplate(undefined, data);

    if (template)
      throw new ActionError("A template with the same name already exists");

    return await prisma.template.create({
      data: { ...data, isActive: !!data.isActive },
    });
  };

  listTemplates = async () =>
    await prisma.template.findMany({
      select: templateSelect,
      orderBy: { createdAt: "desc" },
    });

  /**
   * Locates a template by its unique Id among the templates records or table
   * @param templateId, The Unique template ID associated with the template
   * @returns {Promise<TemplateServerResponseType>}
   */

  getTemplateById = async (
    templateId: string,
  ): Promise<TemplateServerResponseType> => {
    const template = await this.existingTemplate(templateId);
    if (!template) throw new Error("No template found with the provided ID");

    return template;
  };

  /**
   * Updates a document template.
   * @param {string} templateId, the unique ID of the template record that needs to be updated.
   * @param {TemplateType} data, the new data that needs to be saved.
   * @returns {Promise<TemplateServerResponseType>}
   */

  updateTemplate = async (
    templateId: string,
    data: TemplateType,
  ): Promise<TemplateServerResponseType> => {
    const template = await this.existingTemplate(templateId, data);

    if (template)
      throw new Error("A template with the same name is already saved.");

    return await prisma.template.update({
      where: { id: templateId },
      data: { ...data, isActive: !!data.isActive },
    });
  };

  /**
   * Removes a document template using its Unique ID record.
   * @param {string} templateId the unique template ID as saved in the DB
   * @returns {Promise<void>}
   */

  deleteTemplate = async (templateId: string): Promise<void> => {
    const template = await this.existingTemplate(templateId);
    if (!template) throw new Error("No template found with the provided ID");
    await prisma.template.delete({ where: { id: templateId } });
  };

  deleteTemplates = async (templateIds: string[]) => {
    const templateIdsExist = (
      await Promise.all(
        templateIds.map((templateId) => this.existingTemplate(templateId)),
      )
    )
      .filter((templateId) => templateId !== null)
      .map((template) => template.id);

    return await prisma.template.deleteMany({
      where: { id: { in: templateIdsExist } },
    });
  };
}
