// import { OpenAPIHono } from "@hono/zod-openapi";

// import { userApp } from "./userRoute";
// import { wishesApp } from "./wishesRoutes";

// const routes = new OpenAPIHono();

// // Add individual route modules
// routes.route("/wishes", wishesApp);
// routes.route("/user", userApp);

// export { routes };

import { createRoute } from "@hono/zod-openapi";
import { createRouter } from "@lib/createApp";
import * as HttpStatusCodes from "~torch/http-status-codes";
import { jsonContent } from "~torch/openapi/helpers";
import { createMessageObjectSchema } from "~torch/openapi/schemas";

const router = createRouter()
  .openapi(
    createRoute({
      tags: ["Index"],
      method: "get",
      path: "/",
      responses: {
        [HttpStatusCodes.OK]: jsonContent(
          createMessageObjectSchema("Wishes API"),
          "Wishes API Index",
        ),
      },
    }),
    (c) => {
      return c.json({
        message: "Gods are available to hear your wish list",
      }, HttpStatusCodes.OK);
    },
  );

export default router;
