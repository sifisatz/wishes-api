import { serve } from "@hono/node-server";

import { showRoutes } from "hono/dev";
import app from "./app";

const port = 4000;
console.log(`Server is running on port - ${port}`);

serve({
	fetch: app.fetch,
	port,
});


showRoutes(app);
