import { logger } from '../utils/logger.js';
import { closeDatabase } from '../database/connection.js';

export function setupProcessHandlers(): void {
  process.on('SIGTERM', async () => {
    logger.info('📱 Received SIGTERM, shutting down gracefully...');
    await gracefulShutdown();
  });

  process.on('SIGINT', async () => {
    logger.info('📱 Received SIGINT, shutting down gracefully...');
    await gracefulShutdown();
  });
}

async function gracefulShutdown(): Promise<void> {
  try {
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}
