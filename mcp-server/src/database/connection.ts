import knex from 'knex';
import type { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '#utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '..', '..', 'database', 'contract_manager.sqlite3'),
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'migrations'),
    extension: 'ts',
  },
  seeds: {
    directory: path.join(__dirname, 'seeds'),
    extension: 'ts',
  },
  pool: {
    afterCreate: (conn: any, done: any) => {
      // Enable foreign key constraints in SQLite
      conn.run('PRAGMA foreign_keys = ON', done);
    },
  },
};
// Create the Knex instance
export const db = knex(dbConfig);

/**
 * Initialize the database by running migrations and seeds
 */
export async function initializeDatabase(): Promise<void> {
  try {
    logger.info('🔄 Initializing database...');

    // Run migrations
    logger.info('📋 Running database migrations...');
    await db.migrate.latest();
    logger.success('✅ Database migrations completed');

    // Run seeds for fresh data on every restart
    logger.info('🌱 Running database seeds...');
    await db.seed.run();
    logger.success('✅ Database seeds completed');

    logger.success('🗄️  Database initialization completed');
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Close the database connection
 */
export async function closeDatabase(): Promise<void> {
  try {
    await db.destroy();
    logger.info('🔒 Database connection closed');
  } catch (error) {
    logger.error('❌ Error closing database connection:', error);
    throw error;
  }
}

/**
 * Reset the database by rolling back all migrations and re-running them with seeds
 */
export async function resetDatabase(): Promise<void> {
  try {
    logger.info('🔄 Resetting database...');

    // Rollback all migrations
    await db.migrate.rollback(undefined, true);
    logger.info('📋 Rolled back all migrations');

    // Re-run migrations
    await db.migrate.latest();
    logger.info('📋 Re-ran migrations');

    // Run seeds
    await db.seed.run();
    logger.info('🌱 Re-ran seeds');

    logger.success('✅ Database reset completed');
  } catch (error) {
    logger.error('❌ Database reset failed:', error);
    throw error;
  }
}
