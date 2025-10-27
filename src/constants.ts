export const SERVER_INFO = {
  name: 'contract-manager',
  displayName: 'Contract Manager MCP Server',
  version: '1.0.0',
  description:
    'An MCP server for contract management with SQLite database, featuring programs, contracts, tasks, employees, and tags.',
} as const;

export const SERVER_CONFIG = {
  defaultPort: 3000,
  getPort: () => parseInt(process.env['PORT'] || '3000'),
} as const;

export const HEALTH_RESPONSE = {
  status: 'healthy',
  server: SERVER_INFO.name + '-mcp',
  version: SERVER_INFO.version,
} as const;

export const getMcpInfoResponse = (port: number) => ({
  name: SERVER_INFO.displayName,
  version: SERVER_INFO.version,
  protocol: 'Model Context Protocol (MCP) with Server-Sent Events',
  message: 'This is an MCP server with SSE transport. Use an MCP client to connect.',
  transport: 'Server-Sent Events (SSE)',
  usage: {
    'MCP Inspector': 'npx @modelcontextprotocol/inspector',
    'SSE Connection (Primary)': `http://localhost:${port}/mcp/sse`,
    'SSE Connection (Inspector)': `http://localhost:${port}/sse`,
    'Message Endpoint (Primary)': `http://localhost:${port}/mcp/messages`,
    'Message Endpoint (Inspector)': `http://localhost:${port}/messages`,
    'Connection Flow':
      '1. GET /mcp/sse or /sse to establish SSE stream, 2. POST to /mcp/messages or /messages with X-Session-ID header',
  },
  capabilities: {
    tools: 0,
    resources: 0,
    prompts: 0,
  },
});

export const ERROR_CODES = {
  INTERNAL_ERROR: -32603,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
} as const;
