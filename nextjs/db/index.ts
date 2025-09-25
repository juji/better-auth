import { drizzle } from 'drizzle-orm/node-postgres';


export const db = drizzle({
  connection: {
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false, // This allows self-signed certificates
    },
  }
});
