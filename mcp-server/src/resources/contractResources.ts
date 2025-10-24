import type { ContractManagerMCP } from '../index.js';
import { contractService } from '../services/index.js';

export function registerContractResources(agent: ContractManagerMCP) {
  agent.server.registerResource(
    'contracts',
    'contract-manager://contracts',
    {
      title: 'Contracts',
      description: 'All contracts currently in the database',
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
}
