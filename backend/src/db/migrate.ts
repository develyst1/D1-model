import { sql } from "./client";

const schema = await Bun.file(new URL("./schema.sql", import.meta.url)).text();

console.log("Running migration: schema.sql");
await sql.unsafe(schema);
console.log("Migration complete ✅");

await sql.close();
