import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().$defaultFn(() => uuidv4()), // 👈 this here,
  email: text("email").notNull(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().default(sql`now()`),
});

// Create Zod schemas for inserting and selecting wishes
export const selectUsersSchema = createSelectSchema(users).omit({
  password: true,
});

// Insert schema with validation
export const insertUsersSchema = createInsertSchema(
  users,
  {
    email: schema => schema.email.email("Provide a valid email"),
    name: schema => schema.name.min(1, "Name is required").max(120),
    password: schema => schema.password.min(8, "Password must be at least 8 characters long"),
  },
).required({
  password: true,
  email: true,
  name: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Patch schema (for partial updates)
export const patcUsersSchema = insertUsersSchema.partial();
