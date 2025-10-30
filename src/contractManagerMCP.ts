import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { initializeTools } from './tools/index.js';
import { initializeResources } from './resources/index.js';
import { initializePrompts } from './prompts/index.js';
import { SERVER_INFO } from './constants.js';

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
        completions: {},
        elicitation: {},
      },
      instructions: `
${SERVER_INFO.displayName}: An MCP server for contract management with database integration.

${SERVER_INFO.description}
      `.trim(),
    }
  );

  async init() {
    await initializeTools(this);
    await initializeResources(this);
    await initializePrompts(this);
  }
}
