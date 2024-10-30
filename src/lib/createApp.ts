import { OpenAPIHono } from "@hono/zod-openapi";
import { lucia } from "@lucia";
import { pinoLogger } from "@middlewares/pinoLogger";
import { notFound, onError, serveEmojiFavicon } from "~torch/middlewares";
import { defaultHook } from "~torch/openapi";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";

import type { AppBindings } from "./types";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();
  app.use(serveEmojiFavicon("📝"));
  app.use(pinoLogger());

  app.use("*", cors(), async (c, next) => {
    const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
    if (!sessionId) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
      c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
        append: true,
      });
    }
    if (!session) {
      c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
        append: true,
      });
    }
    c.set("session", session);
    c.set("user", user);
    return next();
  });

  app.use("*", csrf());
  app.use("*", prettyJSON());
  app.use("*", secureHeaders());
  app.use("*", timing());
  app.notFound(notFound);
  app.onError(onError);
  return app;
}
