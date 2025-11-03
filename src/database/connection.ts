import knex from 'knex';
import type { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'contract_manager.sqlite3'),
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'migrations'),
    extension: 'js',
    loadExtensions: ['.js'],
  },
  seeds: {
    directory: path.join(__dirname, 'seeds'),
    extension: 'js',
    loadExtensions: ['.js'],
  },
  pool: {
    afterCreate: (conn: any, done: any) => {
      // Enable foreign key constraints in SQLite
      conn.run('PRAGMA foreign_keys = ON', done);
    },
  },
};

export const db = knex(dbConfig);

export async function initializeDatabase(): Promise<void> {
  try {
    logger.info('Initializing database...');

    // Run migrations
    logger.info('Running database migrations...');
    await db.migrate.latest();
    logger.success('Database migrations completed');

    // Run seeds on every restart
    logger.info('Running database seeds...');
    await db.seed.run();
    logger.success('Database seeds completed');

    logger.success('Database initialization completed');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  try {
    await db.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
}

export async function resetDatabase(): Promise<void> {
  try {
    logger.info('Resetting database...');

    await db.migrate.rollback(undefined, true);
    logger.info('Rolled back all migrations');

    await db.migrate.latest();
    logger.info('Re-ran migrations');

    await db.seed.run();
    logger.info('Re-ran seeds');

    logger.success('Database reset completed');
  } catch (error) {
    logger.error('Database reset failed:', error);
    throw error;
  }
}
