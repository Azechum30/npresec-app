import { getAuthUser } from "@/lib/getAuthUser";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const UserRole = user.role?.name;

    // 4. Return only what middleware needs
    return NextResponse.json({
      valid: !!UserRole,
      role: UserRole,
    });
  } catch (error) {
    console.error("Auth validation error:", error);
    return NextResponse.json(
      { error: "Authentication service unavailable" },
      { status: 503 }
    );
  }
}
