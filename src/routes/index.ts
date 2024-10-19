import { userApp } from "./userRoute";
import { wishesApp } from "./wishesRoutes";
import { OpenAPIHono } from "@hono/zod-openapi";

const routes = new OpenAPIHono();

// Add individual route modules
routes.route("/wishes", wishesApp);
routes.route("/user", userApp);

export { routes };
