import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ContractManagerMCP } from '../index.js';
import { contractService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import type { ResourceAnnotations } from '../types/annotations.js';

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
}
