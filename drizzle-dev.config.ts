import { defineConfig } from "drizzle-kit";
// https://orm.drizzle.team/docs/drizzle-kit-migrate
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
  migrations: {
    table: "my-migrations-table", // `__drizzle_migrations` by default
    schema: "public", // used in PostgreSQL only, `drizzle` by default
  },
});
