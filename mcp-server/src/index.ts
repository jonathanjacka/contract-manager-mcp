import { config } from 'dotenv';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import express from 'express';
import { logger } from './utils/logger.js';
import { initializeDatabase } from './database/connection.js';
import { initializeTools } from './tools/index.js';
import { setupMiddleware } from './middleware/index.js';
import { createRoutes } from './routes/index.js';
import { setupProcessHandlers } from './utils/process.js';
import { SERVER_INFO, SERVER_CONFIG } from './constants.js';

config();

export class ContractManagerMCP {
  server = new McpServer(
    {
      name: SERVER_INFO.name,
      version: SERVER_INFO.version,
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
      instructions: `
${SERVER_INFO.displayName}: An MCP server for contract management with database integration.

${SERVER_INFO.description}
      `.trim(),
    }
  );

  async init() {
    await initializeTools(this);
  }
}

// Create MCP server instance
const contractManagerMCP = new ContractManagerMCP();

const app = express();
setupMiddleware(app);
app.use('/', createRoutes(contractManagerMCP));

const port = SERVER_CONFIG.getPort();

async function startServer() {
  try {
    await initializeDatabase();

    // Initialize MCP capabilities
    await contractManagerMCP.init();

    app
      .listen(port, () => {
        logger.serverStarted(port);
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

setupProcessHandlers();

startServer();
