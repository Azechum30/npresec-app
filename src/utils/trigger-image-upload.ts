import { env } from "@/lib/server-only-actions/validate-env";
import { client } from "./qstash";

const entityTypes = ["user", "staff"];

export const triggerImageUpload = async (
  imageFile: File,
  entityId: string,
  folderName: string,
  entityType: (typeof entityTypes)[number]
) => {
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const jobData = {
    file: {
      name: imageFile.name,
      type: imageFile.type,
      buffer: buffer.toString("base64"),
    },
    entityId,
    entityType,
    folder: folderName,
  };

  const response = await client.publishJSON({
    url: `${env.NEXT_PUBLIC_URL}/api/images/uploads`,
    body: jobData,
  });

  return response.url
    ? `${imageFile.name} upload triggerd successfully.`
    : `Failed to trigger upload for ${imageFile.name}.`;
};
