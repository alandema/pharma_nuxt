#!/usr/bin/env node
/**
 * Database Migration Script
 * 
 * This script uses Prisma's db push to sync the database schema.
 * Run this script during deployment or when setting up a new environment.
 * 
 * Usage:
 *   npm run migrate
 *   or
 *   npx tsx scripts/migrate.ts
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  try {
    console.log('🔄 Running database migrations...');
    console.log('📦 Using Prisma db push to sync schema...');

    const { stdout, stderr } = await execAsync('npx prisma db push');

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    console.log('✅ Database migrations completed successfully!');
    console.log('📊 Schema synced with:');
    console.log('   - users');
    console.log('   - patients');
    console.log('   - prescriptions');
    console.log('   - cids');
    console.log('   - medications');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
