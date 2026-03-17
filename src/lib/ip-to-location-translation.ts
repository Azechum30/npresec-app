"use server";
import { headers } from "next/headers";

export const ipToLocationTranslation = async () => {
  try {
    const requestHeaders = await headers();

    const ip = requestHeaders.get("x-forward-for") || "127.0.0.1";

    const city = requestHeaders.get("x-vercel-ip-city") || "development";

    const country = requestHeaders.get("x-vercel-ip-country") || "development";

    return { city, ip, country };
  } catch (e) {
    console.log("Failed to fetch location data", e);
    return null;
  }
};
