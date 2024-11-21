import env from "@config/env";
import { serve } from "@hono/node-server";
import { showRoutes } from "hono/dev";

import app from "./app";

const port = env.PORT;
// const db = env.DATABASE_URL;
// const db = env.DATABASE_URL;
const db = "postgresql://user:pass@localhost:1234/wishes-db";
// eslint-disable-next-line no-console
console.log(`Server is running on port http://localhost:${port}`);
console.log(`db running: ${db}`);

serve({
  fetch: app.fetch,
  port,
});
showRoutes(app);
