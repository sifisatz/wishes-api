/* eslint-disable no-restricted-globals */
/* eslint-disable no-var */
/* eslint-disable import/no-mutable-exports */
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "@/config/env";

import * as schema from "./schema";

type DBType = PostgresJsDatabase<typeof schema>;

declare global {
  // biome-ignore lint/style/noVar: <explanation>
  // eslint-disable-next-line vars-on-top
  var db: DBType | undefined;
}

export const client = postgres(env.DATABASE_URL, { prepare: false });
const drizzleConfig = {
  schema,
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
};

let db: DBType;
if (env.NODE_ENV === "production") {
  db = drizzle(client, drizzleConfig);
}
else {
  if (!global.db)
    global.db = drizzle(client, drizzleConfig);

  db = global.db;
}

export { db };

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  schema.sessionTable,
  schema.users,
);
