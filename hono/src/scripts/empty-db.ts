#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '#lib/db/index.js';
import { sql } from 'drizzle-orm';

async function emptyDatabase() {
  try {
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
    
  } catch (error) {
    console.error('❌ Error emptying database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the script
emptyDatabase();