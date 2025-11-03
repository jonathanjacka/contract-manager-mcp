import { config } from 'dotenv';
import { ContractManagerMCP } from './contractManagerMCP.js';
import { initializeDatabase } from './database/connection.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { redirectConsoleToFile } from './utils/stdioLogger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

// Redirect all console output to log file to prevent JSON-RPC interference
redirectConsoleToFile(path.join(__dirname, 'stdio.log'));

const contractManagerMCP = new ContractManagerMCP();

async function start() {
  try {
    await initializeDatabase();
    await contractManagerMCP.init();

    const transport = new StdioServerTransport(process.stdin, process.stdout);

    transport.onclose = () => {
      process.exit(0);
    };
    transport.onerror = err => {
      console.error('Transport error:', err);
      process.exit(1);
    };

    await contractManagerMCP.server.connect(transport);
  } catch (error) {
    console.error('Failed to start server:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    process.exit(1);
  }
}

start();
