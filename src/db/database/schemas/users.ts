import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { wishes } from "./wishes";

// export const users = pgTable("users", {
//   id: uuid("id").primaryKey().defaultRandom().$defaultFn(() => uuidv4()), // 👈 this here,
//   email: text("email").notNull().unique(),
//   name: text("name").notNull(),
//   password: text("password").notNull(),
//   avatar: text("avatar"),
//   createdAt: timestamp("created_at", { mode: "string" }).notNull().default(sql`now()`),
//   updatedAt: timestamp("updated_at", { mode: "string" }).notNull().default(sql`now()`),
// });
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  password_hash: text("password_hash").notNull(),
});

// export const userRelations = relations(users, ({ many }) => ({
//   wishes: many(wishes, { relationName: "author" }),
//   comments: many(commentsTable, { relationName: "author" }),
//   postUpvotes: many(postUpvotesTable, {
//     relationName: "postUpvotes",
//   }),
//   commentUpvotes: many(commentUpvotesTable, {
//     relationName: "commentUpvotes",
//   }),
// }));

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// Create Zod schemas for inserting and selecting wishes
export const selectUsersSchema = createSelectSchema(users).omit({
  password_hash: true,
});
