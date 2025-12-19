"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { BioSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { client } from "@/utils/qstash";
import { env } from "@/lib/server-only-actions/validate-env";
import { revalidatePath } from "next/cache";

export const BioFormAction = async (values: unknown) => {
  try {
    const { user, hasPermission } = await getUserWithPermissions("edit:users");

    if (!user) return { error: "Kindly login to continue" };

    if (!hasPermission) return { error: "Permission denied" };

    const { error, success, data } = BioSchema.safeParse(values);

    if (!success || error) {
      const errMessage = error.errors.flatMap((e) => e.message).join(",");
      return { error: errMessage };
    }

    const {
      bio,
      email,
      fullName,
      role,
      social,
      username,
      image,
      subscribeToNewsletter,
    } = data;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        bio,
        name: fullName,
        subscribeToOurNewsLetter: subscribeToNewsletter,
        xUrl: social?.x,
        linkedInUrl: social?.linkedIn,
        facebookUrl: social?.facebook,
        instagramUrl: social?.instagram,
      },
    });

    if (!updatedUser) return { error: "Failed to update your profile" };

    if (image instanceof File) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const FileUploadData = {
        file: {
          buffer: buffer.toString("base64"),
          name: image.name,
          type: image.type,
        },
        entityType: "user" as const,
        entityId: user.id,
        folder: "users",
      };

      await client.publishJSON({
        url: `${env.NEXT_PUBLIC_URL}/api/images/uploads`,
        body: FileUploadData,
      });
    }

    revalidatePath("/profile");

    return { success: true };
  } catch (e) {
    console.error("Failed to update profile", e);
    Sentry.captureException(e);
    return { error: "Something went wrong! Please try again later" };
  }
};
