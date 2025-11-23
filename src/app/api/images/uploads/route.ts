import { uploadToCloudinary } from "@/utils/upload-to-cloudinary";
import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { updateDbTable } from "@/utils/update-db-table";

export async function POST(req: NextRequest) {
  try {
    console.log("API route hit - processing image upload");
    const { file, entityId, entityType, folder } = (await req.json()) as {
      file: { name: string; buffer: string; type: string };
      entityId: string;
      entityType: "user" | "boardMember";
      folder: string;
    };

    console.log("File data:", {
      name: file.name,
      type: file.type,
      bufferLength: file.buffer?.length,
      entityId,
      entityType,
      folder,
    });

    const { secure_url, public_id } = await uploadToCloudinary(
      {
        ...file,
        name: file.name.split("/").pop()?.split(".")[0] ?? "untitled",
      },
      folder
    );

    console.log("Upload successful:", { secure_url, public_id });

    let updatedSecureUrl: string = "";

    if (secure_url) {
      updatedSecureUrl = cloudinary.url(public_id, {
        transformation: [
          {
            width: 1200,
            crop: "limit",
            quality: "auto:best",
            fetch_format: "auto",
          },
        ],
      });
    }

    console.log("Updated secure URL:", updatedSecureUrl);

    await updateDbTable(entityType, entityId, updatedSecureUrl);

    console.log("Database updated successfully");
    return Response.json({ success: true });
  } catch (e) {
    console.error("Error in API route:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return Response.json(
      { error: "Failed to process image", details: errorMessage },
      { status: 500 }
    );
  }
}
