import { config } from 'dotenv';
import { ContractManagerMCP } from './contractManagerMCP.js';
import { createBaseRoutes } from './routes/base.js';
import { createStreamableHTTPRoutes } from './routes/streamableHttp.js';
import { startServer } from './startServer.js';

config();

const contractManagerMCP = new ContractManagerMCP();

startServer({
  contractManagerMCP,
  createBaseRoutes,
  createTransportRoutes: createStreamableHTTPRoutes,
  mode: 'http',
  logMessages: [
    'Streamable HTTP Transport Mode - Use MCP Inspector with Streamable HTTP transport',
  ],
  endpoint: '/mcp',
});
