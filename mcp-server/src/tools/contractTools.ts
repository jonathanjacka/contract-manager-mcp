import type { ContractManagerMCP } from '../index.js';
import { contractService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import { contractCodeSchema } from '../schemas/schema.js';
import { createText, createContractResourceLink, createContractEmbeddedResource } from './utils.js';

export function registerContractTools(agent: ContractManagerMCP) {
  agent.server.registerTool(
    'list_contracts',
    {
      title: 'List Contracts',
      description: 'List all contracts in the contract management system',
    },
    async () => {
      const contracts = await contractService.getAll();
      const contractLinks = contracts.map(createContractResourceLink);
      return {
        content: [createText(`Found ${contracts.length} contracts.`), ...contractLinks],
      };
    }
  );

  agent.server.registerTool(
    'get_contract',
    {
      title: 'Get Contract',
      description: 'Get a contract by its code',
      inputSchema: contractCodeSchema,
    },
    async ({ code }) => {
      const contract = await contractService.getByCode(code);
      assert(contract, `Contract with code "${code}" not found`);
      return {
        content: [createContractEmbeddedResource(contract)],
      };
    }
  );
}
