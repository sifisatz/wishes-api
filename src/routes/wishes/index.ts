import { createRouter } from "@lib/createApp";

import * as handlers from "./wishes.handlers";
import * as routes from "./wishes.routes";

const wishesRouter = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default wishesRouter;
