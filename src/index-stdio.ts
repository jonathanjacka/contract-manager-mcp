import { config } from 'dotenv';
import { ContractManagerMCP } from './contractManagerMCP.js';
import { initializeDatabase } from './database/connection.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

// Create a debug log file instead of using console
const logFile = path.join(__dirname, 'stdio-debug.log');
const debugLog = (msg: string) => {
  try {
    fs.appendFileSync(logFile, `${new Date().toISOString()} - ${msg}\n`);
  } catch (e) {
    // Ignore logging errors
  }
};

// Disable all console logging in stdio mode to prevent JSON-RPC parsing issues
const noop = () => {};
console.log = noop;
console.error = noop;
console.warn = noop;
console.info = noop;

const contractManagerMCP = new ContractManagerMCP();

async function start() {
  try {
    debugLog('Starting MCP server in stdio mode');
    await initializeDatabase();
    debugLog('Database initialized');

    await contractManagerMCP.init();
    debugLog('ContractManagerMCP initialized');

    const transport = new StdioServerTransport(process.stdin, process.stdout);

    transport.onclose = () => {
      debugLog('Transport closed');
      process.exit(0);
    };
    transport.onerror = err => {
      debugLog(`Transport error: ${err}`);
      process.exit(1);
    };

    await contractManagerMCP.server.connect(transport);
    debugLog('Server connected to transport');
  } catch (error) {
    debugLog(`Start error: ${error}`);
    process.exit(1);
  }
}

start();
