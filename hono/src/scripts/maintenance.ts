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

const generateUsers = (count: number): User[] => {
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const username = faker.person.fullName()
    const user: User = {
      id: faker.string.uuid(),
      name: username,
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean(),
      image: `https://avatar.iran.liara.run/username?username=${encodeURIComponent(username)}`,
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    };
    users.push(user);
  }

  return users;
};

async function emptyDatabase() {
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

async function createAndLoadUsers() {
  console.log('👥 Generating 100 fake users...');

  const usersData = generateUsers(100);
  console.log(`📋 Generated ${usersData.length} users`);

  console.log('📥 Loading users into database...');

  // Insert users in batches to avoid overwhelming the database
  const batchSize = 10;
  let inserted = 0;

  for (let i = 0; i < usersData.length; i += batchSize) {
    const batch = usersData.slice(i, i + batchSize);

    await db.insert(users).values(
      batch.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      }))
    );

    inserted += batch.length;
    console.log(`✅ Inserted ${inserted}/${usersData.length} users`);
  }

  console.log('✅ All users loaded successfully!');
}

async function maintenance() {
  try {
    console.log('🔧 Starting database maintenance...');

    // Step 1: Empty the database
    await emptyDatabase();

    // Step 2: Create and load 100 users
    await createAndLoadUsers();

    console.log('🎉 Database maintenance completed successfully!');

  } catch (error) {
    console.error('❌ Error during maintenance:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the maintenance script
maintenance();