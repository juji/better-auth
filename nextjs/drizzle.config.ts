import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    ... process.env.POSTGRES_URL ? {
      url: process.env.POSTGRES_URL!  
    } : {
      host: process.env.POSTGRES_HOST!,
      port: parseInt(process.env.POSTGRES_PORT!),
      user: process.env.POSTGRES_USER!,
      password: process.env.POSTGRES_PASSWORD!,
      database: process.env.POSTGRES_DB!,
      ...process.env.POSTGRES_CERT ? {
      ssl: {
        ca: process.env.POSTGRES_CERT
      }} : {},
    }
  },
});
