#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '#lib/db/index.js';
import { users } from '#lib/db/schema/auth.js';
import { sql } from 'drizzle-orm';
import { faker } from '@faker-js/faker';

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export const generateUsers = (count: number): User[] => {
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const id = faker.string.uuid()
    const user: User = {
      id: id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean(),
      image: `https://robohash.org/${id}`,
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    };
    users.push(user);
  }

  return users;
};

export async function emptyDatabase() {
  console.log('🗑️  Emptying database...');

  // Disable foreign key checks temporarily to avoid constraint issues
  await db.execute(sql`SET session_replication_role = replica;`);

  // Get all table names from the current schema
  const result = await db.execute(sql`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  `);

  const tables = result.rows.map((row: any) => row.tablename);

  if (tables.length === 0) {
    console.log('✅ No tables found. Database is already empty.');
    return;
  }

  console.log(`📋 Found ${tables.length} tables: ${tables.join(', ')}`);

  // Truncate all tables
  for (const table of tables) {
    console.log(`🧹 Truncating table: ${table}`);
    await db.execute(sql.raw(`TRUNCATE TABLE "${table}" CASCADE`));
  }

  // Re-enable foreign key checks
  await db.execute(sql`SET session_replication_role = DEFAULT;`);

  console.log('✅ Database emptied successfully!');
}

export async function maintenance(exitProcess = true) {
  try {
    console.log('🔧 Starting database maintenance...');

    // Step 1: Empty the database
    await emptyDatabase();

    console.log('🎉 Database maintenance completed successfully!');

  } catch (error) {
    console.error('❌ Error during maintenance:', error);
    if (exitProcess) {
      process.exit(1);
    }
    throw error; // Re-throw for programmatic calls
  } finally {
    if (exitProcess) {
      process.exit(0);
    }
  }
}

// Run the maintenance script only when executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  maintenance(true);
}