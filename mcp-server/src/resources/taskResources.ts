import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ContractManagerMCP } from '../index.js';
import { taskService } from '../services/index.js';
import { assert } from '../utils/assert.js';

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

  agent.server.registerResource(
    'task',
    new ResourceTemplate('contract-manager://tasks/{code}', {
      complete: {
        async code(value) {
          const tasks = await taskService.getAll();
          return tasks
            .map(task => task.code)
            .filter(code => code.toLowerCase().includes(value.toLowerCase()));
        },
      },
      list: undefined,
    }),
    {
      title: 'Task',
      description: 'A single task with the given code',
    },
    async (uri, { code }) => {
      assert(typeof code === 'string', `Invalid task code: ${code}`);
      const task = await taskService.getByCode(code);
      assert(task, `Task with code "${code}" not found`);
      return {
        contents: [
          {
            mimeType: 'application/json',
            text: JSON.stringify(task),
            uri: uri.toString(),
          },
        ],
      };
    }
  );
}
