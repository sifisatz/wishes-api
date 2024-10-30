import { selectUsersSchema, selectWishesSchema } from "@db/database/schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { notFoundSchema } from "@lib/constants";
import * as HttpStatusCodes from "~torch/http-status-codes";
import { jsonContent, jsonContentRequired } from "~torch/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema, IdParamsSchema } from "~torch/openapi/schemas";

export const insertUsersSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(31)
    .regex(/^\w+$/),
  password: z.string().min(3).max(255),
});
export const patcUsersSchema = insertUsersSchema.partial();

const tags = ["Users"];

/* This code snippet is defining a route for retrieving a list of Useres. Here's a breakdown of what
each part is doing: */
export const list = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectUsersSchema),
      "The list of users",
    ),
  },
});

/* This code snippet is defining a route for retrieving a list of Useres. Here's a breakdown of what
each part is doing: */
export const listOfUserWishes = createRoute({
  path: "users/{id}/wishes",
  summary: "Get user wishes based on their userid",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectWishesSchema),
      "The list of wishes based on the user ID",
    ),
  },
});

export const login = createRoute({
  path: "/login",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertUsersSchema,
      "The user to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Logged in"),
      "Logged in successfully",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Incorrect password"),
      "Incorrect password",
    ),
  },
});
/* This code snippet is defining a route for creating a new User. Here's a breakdown of what each part
is doing: */
export const signup = createRoute({
  path: "/signup",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertUsersSchema,
      "The user to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectUsersSchema,
      "The created user",
    ),

  },
});

export const getOne = createRoute({
  path: "/users/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "The requested user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: "/users/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patcUsersSchema,
      "The user updates",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "The updated user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patcUsersSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/users/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "User deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type SignUpRoute = typeof signup;
export type LoginRoute = typeof login;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
export type GetListOfUserWishes = typeof listOfUserWishes;
