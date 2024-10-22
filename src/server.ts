import env from "@config/env";
import { serve } from "@hono/node-server";
import { showRoutes } from "hono/dev";

import app from "./app";

const port = env.PORT;
// eslint-disable-next-line no-console
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
showRoutes(app);
