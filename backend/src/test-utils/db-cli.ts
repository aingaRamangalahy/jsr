#!/usr/bin/env node

import { Command } from 'commander';
import { seedDatabase, clearDatabase, dropDatabase } from './seeder';

const program = new Command();

program
  .name('jsr-db-cli')
  .description('CLI to manage JSR test database')
  .version('1.0.0');

// Seed database command
program
  .command('seed')
  .description('Seed the database with test data')
  .action(async () => {
    console.log('🌱 Seeding database...');
    await seedDatabase();
    process.exit(0);
  });

// Clear database command
program
  .command('clear')
  .description('Clear all collections in the database')
  .action(async () => {
    console.log('🧹 Clearing database...');
    await clearDatabase();
    process.exit(0);
  });

// Drop database command
program
  .command('drop')
  .description('Drop the entire database')
  .action(async () => {
    console.log('💥 Dropping database...');
    await dropDatabase();
    process.exit(0);
  });

// If no arguments, show help
if (process.argv.length < 3) {
  console.log('');
  console.log('JSR Database CLI Tool');
  console.log('-------------------');
  console.log('Run one of the following commands:');
  console.log('  - npm run db:seed   : Seed the database with test data');
  console.log('  - npm run db:clear  : Clear all collections');
  console.log('  - npm run db:drop   : Drop the entire database');
  console.log('');
  process.exit(0);
}

program.parse(process.argv); 