import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle({
  connection: {

    ... process.env.POSTGRES_URL ? {
      connectionString: process.env.POSTGRES_URL!  
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

  }
});
