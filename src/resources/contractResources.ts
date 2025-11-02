import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { contractService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import type { ResourceAnnotations } from '../types/annotations.js';
import {
  SubscribeRequestSchema,
  UnsubscribeRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

export function registerContractResources(agent: ContractManagerMCP) {
  agent.server.registerResource(
    'contracts',
    'contract-manager://contracts',
    {
      title: 'Contracts',
      description: 'All contracts currently in the database',
      annotations: {
        audience: ['user', 'assistant'],
        priority: 0.9,
      } satisfies ResourceAnnotations,
    },
    async uri => {
      const contracts = await contractService.getAll();
      return {
        contents: [
          {
            mimeType: 'application/json',
            text: JSON.stringify(contracts),
            uri: uri.toString(),
          },
        ],
      };
    }
  );

  agent.server.registerResource(
    'contract',
    new ResourceTemplate('contract-manager://contracts/{code}', {
      complete: {
        async code(value) {
          const contracts = await contractService.getAll();
          return contracts
            .map(contract => contract.code)
            .filter(code => code.toLowerCase().includes(value.toLowerCase()));
        },
      },
      list: undefined,
    }),
    {
      title: 'Contract',
      description: 'A single contract with the given code',
      annotations: {
        audience: ['user', 'assistant'],
        priority: 0.9,
      } satisfies ResourceAnnotations,
    },
    async (uri, { code }) => {
      assert(typeof code === 'string', `Invalid contract code: ${code}`);
      const contract = await contractService.getByCode(code);
      assert(contract, `Contract with code "${code}" not found`);
      return {
        contents: [
          {
            mimeType: 'application/json',
            text: JSON.stringify(contract),
            uri: uri.toString(),
          },
        ],
      };
    }
  );

  // Register subscription request handlers for contract resources
  agent.server.server.setRequestHandler(SubscribeRequestSchema, async (request, extra) => {
    const { uri } = request.params;

    // Only allow subscriptions to individual contract URIs
    if (!uri.startsWith('contract-manager://contracts/')) {
      throw new Error(
        `Cannot subscribe to ${uri}. Only individual contract resources support subscriptions (e.g., contract-manager://contracts/CNT001)`
      );
    }

    // Extract contract code from URI
    const code = uri.replace('contract-manager://contracts/', '');

    // Verify the contract exists
    const contract = await contractService.getByCode(code);
    if (!contract) {
      throw new Error(`Contract with code "${code}" not found`);
    }

    // Subscribe the session to this URI
    const sessionId = extra.sessionId || 'default';
    agent.subscriptionManager.subscribe(sessionId, uri);

    // Return empty success response
    return {};
  });

  // Register unsubscription request handler
  agent.server.server.setRequestHandler(UnsubscribeRequestSchema, async (request, extra) => {
    const { uri } = request.params;
    const sessionId = extra.sessionId || 'default';

    agent.subscriptionManager.unsubscribe(sessionId, uri);

    // Return empty success response
    return {};
  });

  // Return notification function to be called when contracts change
  return () => {
    agent.server.sendResourceListChanged();
  };
}
