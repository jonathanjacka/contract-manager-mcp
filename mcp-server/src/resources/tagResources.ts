import type { ContractManagerMCP } from '../index.js';
import { tagService } from '../services/index.js';

export function registerTagResources(agent: ContractManagerMCP) {
  agent.server.registerResource(
    'tags',
    'contract-manager://tags',
    {
      title: 'Tags',
      description: 'All tags currently in the database',
    },
    async uri => {
      const tags = await tagService.getAll();
      return {
        contents: [
          {
            mimeType: 'application/json',
            text: JSON.stringify(tags),
            uri: uri.toString(),
          },
        ],
      };
    }
  );
}
