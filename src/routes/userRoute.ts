import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { CreateUserSchema, UserSchema } from "../schemas/user";
import {
  createUser,
  getAllUsers,
  getWishesByUserId,
} from "../controllers/userController";
import { IdSchema, WishSchema } from "../schemas/wish";

export const userApp = new OpenAPIHono();

// POST /users - Create a new user
const createUserRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
      description: "User created successfully",
    },
    400: {
      description: "Invalid input",
    },
  },
  tags: ["Users"],
});
// GET /users - Retrieve all users
const getAllUsersRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(UserSchema),
        },
      },
      description: "List of users",
    },
  },
  tags: ["Users"],
});

// GET /users/{id}/wishes - Retrieve all wishes for a specific user
const getUserWishesRoute = createRoute({
  method: "get",
  summary: "Get user wishes based on their userid",
  path: "/{id}/wishes",
  request: {
    params: IdSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(WishSchema), // Array of wishes
        },
      },
      description: "List of wishes for the specified user",
    },
    404: {
      description: "User not found or no wishes found",
    },
  },
  tags: ["Users"],
});

// Logic for retrieving wishes by user ID
userApp.openapi(getUserWishesRoute, async (c: any) => {
  const userId = parseInt(c.req.param("id")); // Get user ID from request parameters
  return await getWishesByUserId(userId); // Call the controller function
});

// Logic for the createUser route
userApp.openapi(createUserRoute, async (c) => {
  return await createUser(c.req);
});

// Logic for the getAllUsers route
userApp.openapi(getAllUsersRoute, async () => {
  return await getAllUsers();
});
