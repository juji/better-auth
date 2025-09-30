#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../src/lib/db/index.js';
import { users } from '../src/lib/db/schema/auth.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { eq, inArray } from 'drizzle-orm';

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

async function removeUsers() {
  try {
    console.log('🗑️  Removing fake users from database...');

    // Read the fake users data to get the emails
    const usersData: User[] = JSON.parse(
      readFileSync(join(process.cwd(), 'scripts', 'users', 'fake-users.json'), 'utf-8')
    );

    const fakeEmails = usersData.map(user => user.email);

    console.log(`📋 Found ${fakeEmails.length} fake user emails to remove`);

    // Delete users with these emails
    const result = await db.delete(users)
      .where(inArray(users.email, fakeEmails))
      .returning({ email: users.email });

    console.log(`✅ Removed ${result.length} fake users from database`);

  } catch (error) {
    console.error('❌ Error removing users:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the script
removeUsers();