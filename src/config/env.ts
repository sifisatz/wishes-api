/* eslint-disable no-console */

import { z } from "zod";
import "dotenv/config";

console.log("🔐 Loading environment variables...");

const serverSchema = z.object({
  // Node
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(9999),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),

  // Database
  DATABASE_URL: z.string().min(1),

  // Supabase
  SUPABASE_URL: z.string().min(1),
  SUPABASE_SERVICE_ROLE: z.string().min(1),
});

export type env = z.infer<typeof serverSchema>;

// eslint-disable-next-line ts/no-redeclare, node/no-process-env
const { data: env, error } = serverSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export default env!;

console.log("✅ Environment variables loaded");
