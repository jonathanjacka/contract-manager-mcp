import type { ContractManagerMCP } from '../index.js';
import { programService } from '../services/index.js';

export function registerProgramResources(agent: ContractManagerMCP) {
  agent.server.registerResource(
    'programs',
    'contract-manager://programs',
    {
      title: 'Programs',
      description: 'All programs currently in the database',
    },
    async uri => {
      const programs = await programService.getAll();
      return {
        contents: [
          {
            mimeType: 'application/json',
            text: JSON.stringify(programs),
            uri: uri.toString(),
          },
        ],
      };
    }
  );
}
