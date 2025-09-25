import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// since we are using aiven with self-signed certificates
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // This allows self-signed certificates
  },
});

export const db = drizzle(pool);
