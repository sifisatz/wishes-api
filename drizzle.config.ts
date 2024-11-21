import type { Config } from "drizzle-kit";

import env from "@config/env";

export default {
  schema: "./src/db/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",

  dbCredentials: {
    ssl: { rejectUnauthorized: false },
    url: env.DATABASE_URL,
  },
} satisfies Config;
