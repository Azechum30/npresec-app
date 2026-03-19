import { updateDbTable } from "@/utils/update-db-table";
import { uploadToCloudinary } from "@/utils/upload-to-cloudinary";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  try {
    console.log("API route hit - processing image upload");
    const { file, entityId, entityType, folder } = (await req.json()) as {
      file: { name: string; buffer: string; type: string };
      entityId: string;
      entityType: "user" | "boardMember";
      folder: string;
    };

    const { secure_url, public_id } = await uploadToCloudinary(
      {
        ...file,
        name: file.name.split("/").pop()?.split(".")[0] ?? "untitled",
      },
      folder,
    );

    if (secure_url) {
      const updatedSecureUrl = cloudinary.url(public_id, {
        transformation: [
          {
            width: 1200,
            crop: "limit",
            quality: "auto:best",
            fetch_format: "auto",
          },
        ],
      });
      await updateDbTable(entityType, entityId, updatedSecureUrl);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 400 },
    );
  } catch (e) {
    console.error("Error in API route:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process image", details: errorMessage },
      { status: 500 },
    );
  }
}

export const POST = verifySignatureAppRouter(handler);
