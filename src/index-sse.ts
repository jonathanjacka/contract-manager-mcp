import { config } from 'dotenv';
import { ContractManagerMCP } from './contractManagerMCP.js';
import { createBaseRoutes } from './routes/base.js';
import { createSSERoutes } from './routes/sse.js';
import { startServer } from './startServer.js';

config();

const contractManagerMCP = new ContractManagerMCP();

startServer({
  contractManagerMCP,
  createBaseRoutes,
  createTransportRoutes: createSSERoutes,
  mode: 'sse',
  logMessages: ['🔗 SSE Transport Mode - Use MCP Inspector with SSE transport'],
  endpoint: '/sse',
});
