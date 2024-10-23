import type { Context } from "hono";

import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";

import {
  createWish,
  deleteWish,
  getAllWishes,
  getWishById,
  updateWish,
} from "../controllers/wishesController";
import { CreateWishSchema, IdSchema, WishSchema } from "../schemas/wish";

export const wishesApp = new OpenAPIHono();

// POST /wishes - Create a new wish
const createWishRoute = createRoute({
  method: "post",

  path: "/",
  body: {
    content: {
      "application/json": {
        schema: CreateWishSchema, // Use the CreateWishSchema wrapped in content
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: WishSchema,
        },
      },
      description: "Wish created successfully",
    },
    400: {
      description: "Invalid input",
    },
  },
  tags: ["Wishes"], // Add tag here for OpenAPI grouping
});
// GET /wishes - Get all wishes
const getAllWishesRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(WishSchema),
        },
      },
      description: "Retrieve all wishes",
    },
  },
  tags: ["Wishes"], // Add tag here for OpenAPI grouping
});

// DELETE /wishes/{id} - Delete a wish by ID
const deleteWishRoute = createRoute({
  method: "delete",
  path: "/{id}",
  request: {
    params: IdSchema,
  },
  responses: {
    200: {
      description: "Wish deleted successfully",
    },
    404: {
      description: "Wish not found",
    },
  },
  tags: ["Wishes"], // Add tag here for OpenAPI grouping
});

// PUT /wishes/{id} - Update an existing wish by ID
const updateWishRoute = createRoute({
  method: "put",
  path: "/{id}",
  request: {
    params: IdSchema,
    body: {
      content: {
        "application/json": {
          schema: CreateWishSchema, // Use the CreateWishSchema wrapped in content
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: WishSchema, // The schema for the updated wish
        },
      },
      description: "Wish updated successfully",
    },
    404: {
      description: "Wish not found", // When the ID does not match
    },
    400: {
      description: "Invalid input", // Bad request for invalid body
    },
  },
  tags: ["Wishes"], // Grouping tag
});

// GET /wishes/{id} - Get specific wish by ID
const getWishByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  request: {
    params: IdSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: WishSchema,
        },
      },
      description: "Retrieve a wish by ID",
    },
    404: {
      description: "Wish not found",
    },
  },
  tags: ["Wishes"], // Add tag here for OpenAPI grouping
});

wishesApp.openapi(getAllWishesRoute, getAllWishes);
wishesApp.openapi(getWishByIdRoute, getWishById);

wishesApp.openapi(createWishRoute, async (c: Context) => {
  return await createWish(c.req as unknown as Request); // Cast HonoRequest to Request
});
// Implement the logic for the updateWishRoute
wishesApp.openapi(updateWishRoute, async (c: Context) => {
  const id = Number.parseInt(c.req.param("id"), 10);
  return await updateWish(id, c.req as unknown as Request); // Cast HonoRequest to Request
});
wishesApp.openapi(deleteWishRoute, deleteWish);
