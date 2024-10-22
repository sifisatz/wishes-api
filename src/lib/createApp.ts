import { OpenAPIHono } from "@hono/zod-openapi";
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
  app.use("*", cors());
  app.use("*", csrf());
  app.use("*", prettyJSON());
  app.use("*", secureHeaders());
  app.use("*", timing());
  app.notFound(notFound);
  app.onError(onError);
  return app;
}
