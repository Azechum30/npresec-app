import { env } from "@/lib/server-only-actions/validate-env";
import { v2 as cloudinary } from "cloudinary";

export const cloudinaryConfig = cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});
