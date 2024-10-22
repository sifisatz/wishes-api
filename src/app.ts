import configureOpenAPI from "@lib/configure-open-api";
import createApp from "@lib/createApp";
import index from "@routes/index";
import users from "@routes/users";
import wishes from "@routes/wishes";

const app = createApp();

configureOpenAPI(app);

const routes = [
  index,
  wishes,
  users,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
