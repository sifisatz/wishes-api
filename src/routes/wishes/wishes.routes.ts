import { insertWishesSchema, patchWishesSchema, selectWishesSchema } from "@db/database/schema";
import { createRoute, z } from "@hono/zod-openapi";
import { notFoundSchema } from "@lib/constants";
import * as HttpStatusCodes from "~torch/http-status-codes";
import { jsonContent, jsonContentRequired } from "~torch/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "~torch/openapi/schemas";

const tags = ["Wishes"];

/* This code snippet is defining a route for retrieving a list of wishes. Here's a breakdown of what
each part is doing: */
export const list = createRoute({
  path: "/wishes",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectWishesSchema),
      "The list of wishes",
    ),
  },
});

/* This code snippet is defining a route for creating a new wish. Here's a breakdown of what each part
is doing: */
export const create = createRoute({
  path: "/wishes",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertWishesSchema,
      "The task to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectWishesSchema,
      "The created task",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertWishesSchema),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  path: "/wishes/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectWishesSchema,
      "The requested task",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Wish not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: "/wishes/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchWishesSchema,
      "The task updates",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectWishesSchema,
      "The updated task",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Wish not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchWishesSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/wishes/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Wish deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Wish not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
