/* eslint-disable no-console */
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { db } from "./db";

export async function migrateDB() {
  console.log("migrating db");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("db migrated");
}

migrateDB();
