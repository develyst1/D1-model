import { SQL } from "bun";
import { env } from "../config/env";

// Bun's native PostgreSQL client — tagged-template SQL, parameterized automatically.
export const sql = new SQL({
  url: env.databaseUrl,
  ssl: env.databaseSsl,
});
