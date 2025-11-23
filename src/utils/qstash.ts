import { env } from "@/lib/server-only-actions/validate-env";
import { Client } from "@upstash/qstash";

export const client = new Client({
  token: env.QSTASH_TOKEN,
});
