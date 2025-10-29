import { completable } from '@modelcontextprotocol/sdk/server/completable.js';
import { z } from 'zod';
import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { taskService, tagService } from '../services/index.js';
import { assert } from '../utils/assert.js';

export function registerTagSuggestionsPrompt(agent: ContractManagerMCP) {
  agent.server.registerPrompt(
    'suggest_tags',
    {
      title: 'Suggest Tags',
      description: 'Suggest tags for a task based on its content and available tags',
      argsSchema: {
        taskCode: completable(
          z.string().describe('The code of the task to suggest tags for (e.g., T001)'),
          async value => {
            const tasks = await taskService.getAll();
            return tasks
              .map(task => task.code)
              .filter(code => code.toLowerCase().includes(value.toLowerCase()));
          }
        ),
      },
    },
    async ({ taskCode }) => {
      assert(taskCode, 'taskCode is required');

      const task = await taskService.getByCode(taskCode);
      assert(task, `Task with code "${taskCode}" not found`);

      const allTags = await tagService.getAll();
      const currentTags = await taskService.getTags(task.id);

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `
Below is my contract management task with code "${taskCode}" and the tags I have available.

Please suggest some tags to add to it. Feel free to suggest new tags I don't have yet.

For each tag I approve, if it does not yet exist, create it with the "create_tag" tool. Then add approved tags to the task with the "add_tag_to_task" tool.

Consider the task's:
- Name and description
- Completion level (indicates task complexity/status)
- Context within the contract and program

Suggest tags that would help with:
- Categorization (e.g., development, testing, documentation)
- Priority/urgency indicators
- Skill requirements
- Status tracking
- Risk/complexity levels
              `.trim(),
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://tags`,
                name: 'Available Tags',
                mimeType: 'application/json',
                text: JSON.stringify(allTags),
              },
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://tasks/${taskCode}`,
                mimeType: 'application/json',
                text: JSON.stringify(task),
              },
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://task-tags/${taskCode}`,
                name: 'Current Tags on Task',
                mimeType: 'application/json',
                text: JSON.stringify(currentTags),
              },
            },
          },
        ],
      };
    }
  );
}
