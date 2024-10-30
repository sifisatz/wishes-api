import { createRouter } from "@lib/createApp";

import * as handlers from "./users.handlers";
import * as routes from "./users.routes";

const usersRouter = createRouter()
  .openapi(routes.signup, handlers.signup)
  .openapi(routes.login, handlers.login)
  .openapi(routes.list, handlers.list)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.listOfUserWishes, handlers.listOfUserWishes);
export default usersRouter;
