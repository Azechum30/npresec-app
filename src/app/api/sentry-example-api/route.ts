import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ data: "Testing Sentry Error..." });
}
