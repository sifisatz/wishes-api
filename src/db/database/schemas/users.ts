import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().$defaultFn(() => uuidv4()), // 👈 this here,
  email: text("email"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().default(sql`now()`),
});
