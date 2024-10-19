// wishesController.ts
import { Context } from "hono";
import { CreateWishSchema } from "../schemas/wish";
import { z } from "zod";
import { users, wishes } from "../db";
// Mocked data for simplicity (In real use-case, this would be replaced by database calls)

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
// Function to delete a wish by ID
export const deleteWish = (c: any): Response => {
  const id = parseInt(c.req.param("id")); // Get the wish ID from the request parameters
  const index = wishes.findIndex((w) => w.id === id); // Find the index of the wish

  // Check if the wish exists
  if (index === -1) {
    return new Response(JSON.stringify({ message: "Wish not found" }), {
      status: 404,
    });
  }

  // Remove the wish from the in-memory database
  wishes.splice(index, 1);
  return new Response(
    JSON.stringify({ message: "Wish deleted successfully" }),
    { status: 200 }
  );
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

// Function to create a new wish
export const createWish = async (request: Request): Promise<Response> => {
  try {
    const body = await request.json(); // Parse the JSON body

    // Validate the request body against CreateWishSchema
    const parsedBody = CreateWishSchema.parse(body); // Validate and parse using Zod

    // Check if the user exists
    const userExists = users.find((user) => user.id === parsedBody.userId);
    if (!userExists) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Create a new wish with a unique ID
    const newWish = {
      id: wishes.length + 1,
      ...parsedBody,
    };

    wishes.push(newWish); // Add to the in-memory database
    return new Response(JSON.stringify(newWish), { status: 201 }); // Return the new wish
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: error.errors }),
        { status: 400 }
      );
    }
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500 }
    );
  }
};
