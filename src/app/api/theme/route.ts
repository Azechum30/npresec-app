"use server";
import { NextRequest, NextResponse } from "next/server";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { user } = await getUserWithPermissions("edit:users");
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { theme } = await request.json();

    const validThemes = ["system", "light", "dark"];
    if (!validThemes.includes(theme)) {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { theme },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update theme:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
