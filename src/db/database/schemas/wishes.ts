import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";

import { users } from "./users";
// Define the SQLite table for wishes
export const wishes = pgTable("wishes", {
  id: uuid("id").primaryKey().defaultRandom().$defaultFn(() => uuidv4()), // 👈 this here,
  description: text("description").notNull(),
  price: integer("price").notNull(),
  priority: text("priority").notNull(),
  dateAdded: timestamp("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").notNull().$defaultFn(() => new Date()),
  userId: text("user_id").notNull().references(() => users.id),
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
  id: true,
  dateAdded: true,
  updatedAt: true,
});

// Patch schema (for partial updates)
export const patchWishesSchema = insertWishesSchema.partial();
