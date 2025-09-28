import knex, { Knex } from 'knex';
import { config } from 'dotenv';
import path from 'path';
import { beforeAll, afterAll, beforeEach } from '@jest/globals';

config({ path: path.join(__dirname, '../../.env.test') });

// eslint-disable-next-line @typescript-eslint/no-require-imports
const knexConfig = require('../../knexfile.js');

export let testDb: Knex;

const createTestDatabase = async (): Promise<void> => {
  const config = knexConfig.test;
  const dbName = config.connection.database;

  const adminDb = knex({
    ...config,
    connection: {
      ...config.connection,
      database: 'postgres'
    }
  });

  try {
    await adminDb.raw(`DROP DATABASE IF EXISTS "${dbName}"`);
    await adminDb.raw(`CREATE DATABASE "${dbName}"`);
  } catch (error) {
    console.error('Error creating test database:', error);
    throw error;
  } finally {
    await adminDb.destroy();
  }
};

const runMigrations = async (db: Knex): Promise<void> => {
  try {
    await db.migrate.latest();
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
};

beforeAll(async () => {
  process.env.NODE_ENV = 'test';

  await createTestDatabase();

  testDb = knex(knexConfig.test);
  await runMigrations(testDb);
});

afterAll(async () => {
  if (testDb) {
    await testDb.destroy();
  }
});

beforeEach(async () => {
  if (testDb) {
    await testDb('todos').del();
  }
});