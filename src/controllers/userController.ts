import { z } from "@hono/zod-openapi";
import { CreateUserSchema, User } from "../schemas/user";

export const users: User[] = [];

// Function to create a new user
export const createUser = async (request: any): Promise<Response> => {
  try {
    const body = await request.json(); // Parse the JSON body

    // Validate the request body against CreateUserSchema
    const parsedBody = CreateUserSchema.parse(body); // Validate and parse using Zod

    // Create a new user with a unique ID
    const newUser: User = {
      id: users.length + 1,
      ...parsedBody,
    };

    users.push(newUser); // Add to the in-memory database
    return new Response(JSON.stringify(newUser), { status: 201 }); // Return the new user
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


// Function to get all users
export const getAllUsers = async (): Promise<any> => {
    return new Response(JSON.stringify(users), { status: 200 });
  };
  