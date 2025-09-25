import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite",
    usePlural: true,
  }),
});

// force build comment