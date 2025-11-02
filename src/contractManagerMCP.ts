import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { initializeTools } from './tools/index.js';
import { initializeResources, type ResourceNotifiers } from './resources/index.js';
import { initializePrompts } from './prompts/index.js';
import { SERVER_INFO } from './constants.js';
import { SubscriptionManager } from './subscriptions/subscriptionManager.js';

export class ContractManagerMCP {
  server = new McpServer(
    {
      name: SERVER_INFO.name,
      version: SERVER_INFO.version,
    },
    {
      capabilities: {
        tools: { listChanged: true },
        resources: { listChanged: true, subscribe: true },
        prompts: {},
        completions: {},
        elicitation: {},
        sampling: {},
      },
      instructions: `
${SERVER_INFO.displayName}: An MCP server for contract management with database integration.

${SERVER_INFO.description}
      `.trim(),
    }
  );

  resourceNotifiers?: ResourceNotifiers;
  subscriptionManager = new SubscriptionManager();

  async init() {
    this.resourceNotifiers = await initializeResources(this);
    await initializeTools(this);
    await initializePrompts(this);
  }
}
