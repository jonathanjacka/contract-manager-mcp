import express, { Express } from 'express';
import { logger } from './utils/logger.js';
import { initializeDatabase } from './database/connection.js';
import { setupMiddleware } from './middleware/index.js';
import { setupProcessHandlers } from './utils/process.js';
import { SERVER_CONFIG } from './constants.js';

export interface StartServerOptions {
  contractManagerMCP: any;
  createBaseRoutes: (mode: 'sse' | 'http') => express.Router;
  createTransportRoutes: (contractManagerMCP: any) => express.Router;
  mode: 'sse' | 'http';
  logMessages: string[];
  endpoint: string;
}

export async function startServer({
  contractManagerMCP,
  createBaseRoutes,
  createTransportRoutes,
  mode,
  logMessages,
  endpoint,
}: StartServerOptions) {
  const app: Express = express();
  setupMiddleware(app);

  app.use('/', createBaseRoutes(mode));
  app.use('/', createTransportRoutes(contractManagerMCP));

  const port = SERVER_CONFIG.getPort();

  setupProcessHandlers();

  try {
    await initializeDatabase();
    await contractManagerMCP.init();
    app
      .listen(port, () => {
        logger.serverStarted(port);
        logMessages.forEach(msg => logger.info(msg));
        logger.info(`   Connect to: http://localhost:${port}${endpoint}`);
      })
      .on('error', error => {
        logger.serverError(error);
        process.exit(1);
      });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}
