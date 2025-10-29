import chalk from 'chalk';
import { config } from 'dotenv';
import { ContractManagerMCP } from './contractManagerMCP.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Reminder: Safe logging to stderr will not interfere with Inspector stdio transport
console.error(chalk.green('[MCP STDIO] Starting MCP server in stdio mode...'));

config();

const contractManagerMCP = new ContractManagerMCP();

async function start() {
  await contractManagerMCP.init();

  const transport = new StdioServerTransport(process.stdin, process.stdout);

  transport.onclose = () => {
    process.exit(0);
  };
  transport.onerror = err => {
    console.error('Stdio transport error:', err);
    process.exit(1);
  };

  await contractManagerMCP.server.connect(transport);
}

start();
