import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  email: text("email"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().default(sql`now()`),
});

// Define the SQLite table for wishes
export const wishes = pgTable("wishes", {
  id: integer("id").primaryKey(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  priority: text("priority").notNull(),
  dateAdded: timestamp("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").notNull().$defaultFn(() => new Date()),
  userId: integer("user_id").notNull(),
});

// Create Zod schemas for inserting and selecting wishes
export const selectWishesSchema = createSelectSchema(wishes);

// Insert schema with validation
export const insertWishesSchema = createInsertSchema(
  wishes,
  {
    description: schema => schema.description.min(1, "Description is required").max(500),
    price: schema => schema.price.positive(),
  },
).required({
  priority: true,
  userId: true,
}).omit({
  // id: true,
  dateAdded: true,
  updatedAt: true,
});

// Patch schema (for partial updates)
export const patchWishesSchema = insertWishesSchema.partial();
