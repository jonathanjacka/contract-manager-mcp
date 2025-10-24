import type { ContractManagerMCP } from '../index.js';
import { taskService } from '../services/index.js';

export function registerTaskResources(agent: ContractManagerMCP) {
  agent.server.registerResource(
    'tasks',
    'contract-manager://tasks',
    {
      title: 'Tasks',
      description: 'All tasks currently in the database',
    },
    async uri => {
      const tasks = await taskService.getAll();
      return {
        contents: [
          {
            mimeType: 'application/json',
            text: JSON.stringify(tasks),
            uri: uri.toString(),
          },
        ],
      };
    }
  );
}
