import { prisma } from "@/lib/prisma";
import { type TemplateServerResponseType, templateSelect } from "@/lib/types";

/**
 * Returns a JSON serializable object of a document template.
 * @param {string} type The Unique of the template record as saved in the DB
 * @returns {Promise<TemplateServerResponseType}
 */

export const getTemplateData = async (
  type: string,
): Promise<TemplateServerResponseType> => {
  const template = await prisma.template.findUnique({
    where: { type },
    select: templateSelect,
  });

  if (!template) throw new Error("No template data found");

  return template;
};
