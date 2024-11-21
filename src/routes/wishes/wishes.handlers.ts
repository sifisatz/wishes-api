import type { AppRouteHandler } from "@lib/types";

import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from "./wishes.routes";
import { db } from "@/db/database/db";
import { wishes } from "@db/database/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@lib/constants";
import * as HttpStatusCodes from "~torch/http-status-codes";

import * as HttpStatusPhrases from "~torch/http-status-phrases";

import { eq } from "drizzle-orm";

// Controller function to get all wishes
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const res = await db.query.wishes.findMany();
  return c.json(res);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const toInsert = c.req.valid("json");
  const [inserted] = await db.insert(wishes).values(toInsert).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const task = await db.query.wishes.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!task) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(task, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [task] = await db
    .update(wishes)
    .set(updates)
    .where(eq(wishes.id, id))
    .returning();

  if (!task) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(task, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  // Check if the wish exists before deleting
  const wishExists = await db.select().from(wishes).where(eq(wishes.id, id));

  if (!wishExists) {
    // If the wish is not found, return a 404 error
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Execute the delete query
  await db.delete(wishes).where(eq(wishes.id, id));

  // If the wish was found and deleted, return 204 No Content
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
