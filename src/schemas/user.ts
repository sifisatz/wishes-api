import { z } from "@hono/zod-openapi";

// Schema for a User
export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
}).openapi("User");


export type User = z.infer<typeof UserSchema>; // string
// Schema for creating/updating a user (no `id`)
export const CreateUserSchema = UserSchema.omit({ id: true });
