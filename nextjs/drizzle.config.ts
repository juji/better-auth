// import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

console.log('Database URL:', process.env.POSTGRES_URL);

export default defineConfig({
  out: './drizzle',
  schema: './db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
});
