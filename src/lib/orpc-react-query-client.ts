/** biome-ignore-all assist/source/organizeImports: reason */
import { client } from "@/lib/orpc";
import { createORPCReactQueryUtils } from "@orpc/react-query";

export const orpc = createORPCReactQueryUtils(client);
