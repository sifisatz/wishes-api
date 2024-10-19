import type { Config } from "drizzle-kit";
import { env } from "./src/config/env";

export default {
  schema: "./src/libs/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
