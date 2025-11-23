import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/server-only-actions/validate-env";

export const cloudinary1 = cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

type SerializedFile = {
  buffer: string;
  name: string;
  type: string;
};

export const uploadToCloudinary = async (
  imageFile: SerializedFile,
  sub: string
) => {
  const buffer = Buffer.from(imageFile.buffer, "base64");

  const uploadResponse: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `npresec/${sub}/`,
          public_id: imageFile.name,
          overwrite: true,
          invalidate: true,
          quality_analysis: true,
          format: "webp",
        },
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      )
      .end(buffer);
  });

  if (!uploadResponse.secure_url)
    throw new Error("Failed to upload to cloudinary");

  return {
    secure_url: uploadResponse.secure_url,
    public_id: uploadResponse.public_id,
  };
};
