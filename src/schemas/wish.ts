import { z } from "zod";

// Schema for a Wish
export const WishSchema = z.object({
  id: z.number(),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dateAdded: z.string().optional(),
});

// Schema for path parameters (like wish ID)
export const IdSchema = z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number"),
  });

// Schema for creating/updating a wish (no `id`)
export const CreateWishSchema = WishSchema.omit({ id: true });
