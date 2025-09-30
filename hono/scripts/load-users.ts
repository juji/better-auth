#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../src/lib/db/index.js';
import { users } from '../src/lib/db/schema/auth.js';
import { readFileSync } from 'fs';
import { join } from 'path';

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

async function loadUsers() {
  try {
    console.log('📥 Loading fake users into database...');

    // Read the fake users data
    const usersData: User[] = JSON.parse(
      readFileSync(join(process.cwd(), 'scripts', 'users', 'fake-users.json'), 'utf-8')
    );

    console.log(`📋 Found ${usersData.length} users to load`);

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

    console.log('✅ All fake users loaded successfully!');

  } catch (error) {
    console.error('❌ Error loading users:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the script
loadUsers();