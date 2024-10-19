// wishesController.ts
import { Context } from "hono";
import { CreateWishSchema } from "../schemas/wish";
import { z } from "zod";
// Mocked data for simplicity (In real use-case, this would be replaced by database calls)
let wishes = [
  {
    id: 1,
    description: "New Laptop",
    price: 1500,
    priority: "high",
    dateAdded: "2024-10-01",
  },
  {
    id: 2,
    description: "Vacation",
    price: 3000,
    priority: "medium",
    dateAdded: "2024-10-05",
  },
];

// Controller function to get all wishes
export const getAllWishes = (c: any) => {
  return c.json(wishes, 200);
};

export const getWishById = (c: any) => {
  const id = parseInt(c.req.param("id"));
  const wish = wishes.find((w) => w.id === id);
  if (!wish) return c.json({ message: "Wish not found" }, 404);
  return c.json(wish, 200);
};
export const deleteWish = (c: any) => {
  const id = parseInt(c.req.param("id"));
  const index = wishes.findIndex((w) => w.id === id);
  if (index === -1) return c.json({ message: "Wish not found" }, 404);

  wishes = wishes.filter((w) => w.id !== id);
  return c.json({ message: "Wish deleted successfully" }, 200);
};

// Function to update an existing wish by ID
export const updateWish = async (
  id: number,
  request: Request
): Promise<Response> => {
  const index = wishes.findIndex((w) => w.id === id);

  // Check if the wish exists
  if (index === -1) {
    return new Response(JSON.stringify({ message: "Wish not found" }), {
      status: 404,
    }); // Return 404 if not found
  }

  try {
    // Parse the JSON body from the request
    const body = await request.json(); // Use request.json() to read the body

    // Validate the request body against CreateWishSchema
    const parsedBody = CreateWishSchema.parse(body); // Validate and parse using Zod

    // Update the existing wish with the new data
    wishes[index] = { ...wishes[index], ...parsedBody };

    // Return the updated wish
    return new Response(JSON.stringify(wishes[index]), { status: 200 });
  } catch (error) {
    // Handle errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: error.errors }),
        { status: 400 }
      ); // Return validation errors
    }
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500 }
    ); // Handle unexpected errors
  }
};



export const createWish = async (
    c: any
  ): Promise<Response> => {
   const body = await c.req.valid('body');
  const newWish = {
    id: wishes.length + 1,
    ...body,
    dateAdded: body.dateAdded || new Date().toISOString().split('T')[0],
  };
  wishes.push(newWish);
  return c.json(newWish, 201);
  };