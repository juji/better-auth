import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle({
  connection: {
    connectionString: process.env.POSTGRES_URL,
    ...process.env.POSTGRES_CERT ? {
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.POSTGRES_CERT
    }} : {},
  }
});
