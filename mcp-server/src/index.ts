import { config } from 'dotenv';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { logger } from './utils/logger.js';
import { initializeDatabase, closeDatabase } from './database/connection.js';
import {
  SERVER_INFO,
  HEALTH_RESPONSE,
  getMcpInfoResponse,
  ERROR_CODES,
  SERVER_CONFIG,
} from './constants.js';

config();

const mcpServer = new McpServer(
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

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Health check
app.get('/health', (_req, res) => {
  res.json({
    ...HEALTH_RESPONSE,
    timestamp: new Date().toISOString(),
  });
});

// info for browsers
app.get('/mcp', (_req, res) => {
  res.status(200).json({
    ...getMcpInfoResponse(SERVER_CONFIG.getPort()),
    timestamp: new Date().toISOString(),
  });
});

// JSON-RPC requests
app.post('/mcp', async (req, res) => {
  const mcpMethod = req.body?.method || 'unknown';
  const mcpId = req.body?.id !== undefined ? req.body.id : 'none';
  logger.mcpRequest(mcpMethod, mcpId);

  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on('close', () => {
      logger.mcpClosed(mcpMethod, mcpId);
      transport.close();
    });

    await mcpServer.connect(transport);
    logger.mcpConnected(mcpMethod, mcpId);

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    logger.mcpError(mcpMethod, mcpId, error);
    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Internal error',
        data: error instanceof Error ? error.message : String(error),
      },
      id: null,
    });
  }
});

const port = SERVER_CONFIG.getPort();

// Start server with database initialization
async function startServer() {
  try {
    // Initialize database first
    await initializeDatabase();

    // Start the Express server
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

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  logger.info('📱 Received SIGTERM, shutting down gracefully...');
  try {
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  logger.info('📱 Received SIGINT, shutting down gracefully...');
  try {
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();
