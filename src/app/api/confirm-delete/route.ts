import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  console.log("Delete confirmed");
  return Response.json({ message: "Delete confirmed" }, { status: 200 });
};
