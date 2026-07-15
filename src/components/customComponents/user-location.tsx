/**biome-ignore-all assist/source/organizeImports: reason */

import { auth } from "@/lib/auth";
import { getUserLocationFromIp } from "@/utils/get-user-location-from-ip";
import { Globe } from "lucide-react";
import { headers } from "next/headers";

export const UserLocationFromIp = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const location = await getUserLocationFromIp(session?.session.ipAddress);

  return (
    <div className="flex space-x-2 mt-4 px-4 py-1 rounded-md justify-center items-center">
      <Globe className="size-5 text-primary" />
      <span className="font-bold bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
        {location?.city}, {location?.country}
      </span>
    </div>
  );
};
