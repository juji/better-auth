// import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
    ...process.env.POSTGRES_CERT ? { 
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.POSTGRES_CERT
      }
    } : {},
  },
});
