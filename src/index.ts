import { logger } from "hono/logger";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

const app = new OpenAPIHono();
app.use(logger());

// Error handling middleware
app.use("*", errorHandler);

// Register all API routes
app.route("/", routes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Use the middleware to serve Swagger UI at /ui
app.get("/ui", swaggerUI({ url: "/doc" }));

// The OpenAPI documentation will be available at /doc
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

export default {
  port: 4000,
  fetch: app.fetch,
};
