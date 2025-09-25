// import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

console.log('Database URL:', process.env.POSTGRES_URL);
console.log('Database URL string length:', process.env.POSTGRES_URL?.length);

export default defineConfig({
  out: './drizzle',
  schema: './db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  ssl: {
    rejectUnauthorized: false, // This allows self-signed certificates
  },

  
});
