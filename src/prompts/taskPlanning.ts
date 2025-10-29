import { completable } from '@modelcontextprotocol/sdk/server/completable.js';
import { z } from 'zod';
import type { ContractManagerMCP } from '../contractManagerMCP.js';
import {
  contractService,
  taskService,
  employeeService,
  programService,
} from '../services/index.js';
import { assert } from '../utils/assert.js';

export function registerTaskPlanningPrompt(agent: ContractManagerMCP) {
  agent.server.registerPrompt(
    'task_planning',
    {
      title: 'Task Planning',
      description: 'Generate task suggestions and planning recommendations for a contract',
      argsSchema: {
        contractCode: completable(
          z.string().describe('The code of the contract to plan tasks for (e.g., C001)'),
          async value => {
            const contracts = await contractService.getAll();
            return contracts
              .map(contract => contract.code)
              .filter(code => code.toLowerCase().includes(value.toLowerCase()));
          }
        ),
      },
    },
    async ({ contractCode }) => {
      assert(contractCode, 'contractCode is required');

      const contract = await contractService.getByCode(contractCode);
      assert(contract, `Contract with code "${contractCode}" not found`);

      const existingTasks = await taskService.getByContractCode(contractCode);
      const allEmployees = await employeeService.getAll();
      const program = await programService.getById(contract.program_id);

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `
Please help me plan tasks for contract "${contractCode}". Based on the contract details, existing tasks, and available team members, suggest:

1. **Missing Tasks**: What key tasks might be missing for successful contract completion?
2. **Task Breakdown**: How to break down large or complex existing tasks into smaller, manageable pieces?
3. **Dependencies**: What task dependencies and sequencing should be considered?
4. **Resource Planning**: How to optimally distribute tasks among available team members?
5. **Timeline Recommendations**: Suggested priorities and scheduling based on contract timeline and current progress?

For each suggested task, provide:
- Clear task name and description
- Estimated completion level (0-10 scale to match existing system)
- Recommended assignees based on skills and current workload
- Dependencies on existing tasks
- Priority level and timeline suggestions

If you recommend creating any tasks, you can use the "create_task" tool to add them to the contract.
              `.trim(),
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://contracts/${contractCode}`,
                mimeType: 'application/json',
                text: JSON.stringify(contract),
              },
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://tasks`,
                name: `Existing Tasks for ${contractCode}`,
                mimeType: 'application/json',
                text: JSON.stringify(existingTasks),
              },
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://employees`,
                name: 'Available Team Members',
                mimeType: 'application/json',
                text: JSON.stringify(allEmployees),
              },
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://programs/${program?.code || 'unknown'}`,
                name: 'Program Context',
                mimeType: 'application/json',
                text: JSON.stringify(program),
              },
            },
          },
        ],
      };
    }
  );
}
