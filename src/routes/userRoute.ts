import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { CreateUserSchema, UserSchema } from "../schemas/user";
import { createUser, getAllUsers } from "../controllers/userController";

export const userApp = new OpenAPIHono();

// POST /users - Create a new user
const createUserRoute = createRoute({
  method: "post",
  path: "/users",
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
    method: 'get',
    path: '/users',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(UserSchema),
          },
        },
        description: 'List of users',
      },
    },
    tags: ['Users'],
  });



// Logic for the createUser route
userApp.openapi(createUserRoute, async (c) => {
  return await createUser(c.req);
});

// Logic for the getAllUsers route
userApp.openapi(getAllUsersRoute, async () => {
    return await getAllUsers();
  });