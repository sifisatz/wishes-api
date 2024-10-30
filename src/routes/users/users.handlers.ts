import type { AppRouteHandler } from "@lib/types";

import { users, wishes } from "@db/database/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@lib/constants";
import { lucia } from "@lucia";
import * as HttpStatusCodes from "~torch/http-status-codes";
import * as HttpStatusPhrases from "~torch/http-status-phrases";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";

import { db } from "@/db/database/db";

import type { GetListOfUserWishes, GetOneRoute, ListRoute, LoginRoute, PatchRoute, RemoveRoute, SignUpRoute } from "./users.routes";

// Controller function to get all users
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const res = await db.query.users.findMany();
  return c.json(res);
};

export const signup: AppRouteHandler<SignUpRoute> = async (c) => {
  const { username, password } = c.req.valid("json");
  const passwordHash = await Bun.password.hash(password);
  const userId = generateId(15);

  const [inserted] = await db.insert(users).values({
    id: userId,
    username,
    password_hash: passwordHash,
  }).returning();

  const session = await lucia.createSession(userId, { username });
  const sessionCookie = lucia.createSessionCookie(session.id).serialize();

  c.header("Set-Cookie", sessionCookie, { append: true });
  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const { username, password } = c.req.valid("json");

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!existingUser) {
    return c.json(
      {
        success: true,
        message: "Incorrect username",
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  const validPassword = await Bun.password.verify(
    password,
    existingUser.password_hash,
  );
  if (!validPassword) {
    return c.json(
      {
        success: true,
        message: "Incorrect username",
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  const session = await lucia.createSession(existingUser.id, { username });
  const sessionCookie = lucia.createSessionCookie(session.id).serialize();

  c.header("Set-Cookie", sessionCookie, { append: true });

  return c.json(
    {
      success: true,
      message: "Logged in",
    },
    HttpStatusCodes.OK,
  );
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const task = await db.query.users.findFirst({
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

  const [task] = await db.update(users)
    .set(updates)
    .where(eq(users.id, id))
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
  const wishExists = await db.select().from(users).where(eq(users.id, id));

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
  await db.delete(users).where(eq(users.id, id));

  // If the wish was found and deleted, return 204 No Content
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
export const listOfUserWishes: AppRouteHandler<GetListOfUserWishes> = async (c) => {
  const { id } = c.req.valid("param");

  // Fetch all wishes for the user with the provided ID
  const userWishes = await db
    .select()
    .from(wishes)
    .where(eq(wishes.userId, id));

  return c.json(userWishes);
};
