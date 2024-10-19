import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";
import errorHandler from "./middlewares/error.middleware";
// import swaggerApp from "./middlewares/swagger.middleware";
import { routes } from "./routes";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

const app = new OpenAPIHono()

// Middlewares
app
  .use("*", logger())
  .use("*", cors())
  .use("*", csrf())
  .use("*", prettyJSON())
  .use("*", secureHeaders())
  .use("*", timing())
  // Routes
  // .route("/ui", swaggerApp)
  .route("/", routes)
  .onError(errorHandler);

// Use the middleware to serve Swagger UI at /ui
app.get("/ui", swaggerUI({ url: "/doc" }));

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

// Export the app TYPE
export type AppType = typeof app;

export default app;
