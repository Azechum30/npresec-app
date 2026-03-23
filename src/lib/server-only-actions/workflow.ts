import "server-only";

import { Client } from "@upstash/workflow";
import { env } from "./validate-env";

export const workflowClient = new Client({
  token: env.QSTASH_TOKEN,
});
